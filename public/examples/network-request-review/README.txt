CRXFile original network request review example, MIT License.

request.js is a standalone teaching module, not a complete Chrome extension.
Its default fetch function would attempt a POST to https://collector.example/v1/review.
The accompanying check.html always passes a mock instead. No collector POST is sent.
Serve this folder over HTTP and open check.html to exercise the four built-in cases.
The check tests request construction and response handling, not browser networking,
CORS, host permission grants, service worker lifetime, or extension installation.

Article: https://www.crxfile.xyz/blog/audit-extension-network-requests
