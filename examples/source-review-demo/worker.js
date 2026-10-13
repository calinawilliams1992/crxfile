chrome.runtime.onMessage.addListener((message, sender) => {
  if (
    sender.url?.startsWith("https://example.com/") &&
    message?.type === "PAGE_TITLE" &&
    typeof message.title === "string"
  ) {
    chrome.storage.local.set({ lastTitle: message.title });
  }
});
