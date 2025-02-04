chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_CLIPBOARD") {
    saveClipboard(message.text, message.date, message.url);
    sendResponse({ status: "ok" });
  }
  return true;
});

async function saveClipboard(text, date, url) {
  try {
    const data = await chrome.storage.sync.get(["clips"]);
    const clips = data.clips || [];
    console.log("clips: ", clips);
    clips.push({ text, date, url });
    await chrome.storage.sync.set({ clips });
  } catch (error) {
    console.error("Error saving to storage:", error);
  }
}
