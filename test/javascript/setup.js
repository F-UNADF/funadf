// jsdom ne fournit pas ResizeObserver, utilisé par Vuetify
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// ... ni visualViewport, utilisé par les fenêtres de dialogue
global.visualViewport = {
  width: 1024, height: 768, offsetLeft: 0, offsetTop: 0, scale: 1,
  addEventListener() {}, removeEventListener() {},
}
