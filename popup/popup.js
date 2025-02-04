class ClipKeeper {
  constructor() {
    this.initElements();
    this.loadClips();
    this.initSearch();
  }

  initElements() {
    this.clipsContainer = document.querySelector(".clips-container");
    this.searchInput = document.querySelector("#search");
  }

  async loadClips() {
    try {
      const data = await chrome.storage.sync.get(["clips"]);
      const clips = data.clips || [];
      this.renderClips(clips);
    } catch (error) {
      console.error("Error loading clips:", error);
    }
  }

  initSearch() {
    this.searchInput.addEventListener("input", () => {
      this.filterClips();
    });
  }

  async filterClips() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const data = await chrome.storage.sync.get(["clips"]);
    const clips = data.clips || [];

    const filteredClips = clips.filter(
      (clip) =>
        clip.text.toLowerCase().includes(searchTerm) ||
        clip.url.toLowerCase().includes(searchTerm)
    );

    this.renderClips(filteredClips);
  }

  renderClips(clips) {
    const sortedClips = [...clips].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    this.clipsContainer.innerHTML = sortedClips
      .map(
        (clip, index) => `
      <div class="clip-item">
        <div class="clip-content">${this.escapeHtml(clip.text)}</div>
        <div class="clip-meta">
          <div class="clip-info">
            <span>${clip.url}</span>
            <span>${new Date(clip.date).toLocaleString()}</span>
          </div>
          <div class="clip-actions">
            <button class="btn btn-copy" data-index="${index}">Copy</button>
            <button class="btn btn-delete" data-index="${index}">Delete</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    this.initClipActions();
  }

  initClipActions() {
    this.clipsContainer.addEventListener("click", async (e) => {
      const index = e.target.dataset.index;
      if (!index) return;

      const data = await chrome.storage.sync.get(["clips"]);
      const clips = data.clips || [];

      if (e.target.classList.contains("btn-copy")) {
        navigator.clipboard.writeText(clips[index].text);
        e.target.textContent = "Copied!";
        setTimeout(() => (e.target.textContent = "Copy"), 1000);
      }

      if (e.target.classList.contains("btn-delete")) {
        clips.splice(index, 1);
        await chrome.storage.sync.set({ clips });
        this.renderClips(clips);
      }
    });
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ClipKeeper();
});
