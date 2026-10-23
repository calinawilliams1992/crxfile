(() => {
  const headings = document.querySelectorAll("article h2");
  for (const heading of headings) {
    if (heading.querySelector("[data-crxfile-note]")) continue;
    const note = document.createElement("span");
    note.dataset.crxfileNote = "true";
    note.textContent = " [reviewed]";
    heading.append(note);
  }
})();
