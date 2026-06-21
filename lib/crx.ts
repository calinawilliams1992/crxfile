type OffsetResult =
  | {
      ready: true;
      offset: number;
    }
  | {
      ready: false;
    };

const maxHeaderBytes = 16 * 1024 * 1024;
type Bytes = Uint8Array<ArrayBufferLike>;

export function crxToZipStream(crxBody: ReadableStream<Bytes>): ReadableStream<Bytes> {
  return new ReadableStream<Bytes>({
    async start(controller) {
      const reader = crxBody.getReader();
      let buffered: Bytes = new Uint8Array(0);
      let bytesToSkip: number | null = null;

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            if (bytesToSkip === null) {
              throw new Error("The downloaded file did not contain a complete CRX header.");
            }
            if (bytesToSkip > 0) {
              throw new Error("The downloaded file ended before the ZIP payload started.");
            }
            controller.close();
            return;
          }

          if (bytesToSkip === 0) {
            controller.enqueue(value);
            continue;
          }

          if (bytesToSkip !== null) {
            if (value.byteLength <= bytesToSkip) {
              bytesToSkip -= value.byteLength;
              continue;
            }

            controller.enqueue(value.slice(bytesToSkip));
            bytesToSkip = 0;
            continue;
          }

          buffered = concatBytes(buffered, value);
          const result = readCrxZipOffset(buffered);

          if (!result.ready) {
            if (buffered.byteLength > maxHeaderBytes) {
              throw new Error("The CRX header is larger than expected.");
            }
            continue;
          }

          bytesToSkip = result.offset;

          if (bytesToSkip > maxHeaderBytes) {
            throw new Error("The CRX header is larger than expected.");
          }

          if (buffered.byteLength <= bytesToSkip) {
            bytesToSkip -= buffered.byteLength;
            buffered = new Uint8Array(0);
            continue;
          }

          controller.enqueue(buffered.slice(bytesToSkip));
          bytesToSkip = 0;
          buffered = new Uint8Array(0);
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    }
  });
}

export function readCrxZipOffset(bytes: Bytes): OffsetResult {
  if (bytes.byteLength < 4) {
    return { ready: false };
  }

  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    return { ready: true, offset: 0 };
  }

  const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  if (magic !== "Cr24") {
    throw new Error("The downloaded file is not a valid CRX package.");
  }

  if (bytes.byteLength < 12) {
    return { ready: false };
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const version = view.getUint32(4, true);

  if (version === 2) {
    if (bytes.byteLength < 16) {
      return { ready: false };
    }
    const publicKeyLength = view.getUint32(8, true);
    const signatureLength = view.getUint32(12, true);
    return {
      ready: true,
      offset: 16 + publicKeyLength + signatureLength
    };
  }

  if (version === 3) {
    const headerLength = view.getUint32(8, true);
    return {
      ready: true,
      offset: 12 + headerLength
    };
  }

  throw new Error(`Unsupported CRX version: ${version}`);
}

function concatBytes(a: Bytes, b: Bytes): Bytes {
  if (a.byteLength === 0) {
    return b;
  }

  const merged: Bytes = new Uint8Array(a.byteLength + b.byteLength);
  merged.set(a, 0);
  merged.set(b, a.byteLength);
  return merged;
}
