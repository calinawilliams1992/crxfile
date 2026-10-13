chrome.storage.local.get("lastTitle").then(({ lastTitle }) => {
  document.getElementById("title").textContent = lastTitle || "No title saved.";
});
