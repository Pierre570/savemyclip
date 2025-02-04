document.addEventListener("copy", () => {
  const copiedText = document.getSelection().toString();
  const date = new Date();

  chrome.runtime.sendMessage({
    type: "SAVE_CLIPBOARD",
    text: copiedText,
    date: date,
    url: document.location.hostname,
  });
});
