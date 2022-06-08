const overlayId = "vite-error-overlay"

function clearErrorOverlay() {
  document.querySelectorAll(overlayId).forEach((n) => n.close())
}

import.meta.hot.on("viteplay:clear-error-overlay", () => {
  clearErrorOverlay()
})
