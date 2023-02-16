class RootApp extends HTMLDivElement {
  connectedCallback() {
    this.dispatchEvent(new Event('connected'))
  }
  disconnectedCallback() {
    this.dispatchEvent(new Event('removed'))
  }
}
