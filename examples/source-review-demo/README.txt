Source Review Demo 1.0.0
An original CRXFile example for reading extension source without installing it.

Open the files in a text editor. Installation is not needed for the exercise.
This is a teaching sample, not a Chrome Web Store download or signed CRX.

Reading order:
1. manifest.json lists the entry files and the storage permission.
2. content.js reads the title on https://example.com/* and sends PAGE_TITLE.
3. worker.js checks the sender and message, then writes lastTitle to local storage.
4. popup.html loads popup.js, which reads lastTitle and displays it with textContent.

The source contains no outbound network calls or third-party libraries.
The example is distributed under the CRXFile repository's MIT License.

Guide: https://www.crxfile.xyz/blog/view-chrome-extension-source-without-installing
