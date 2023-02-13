// import './style.scss'
import { render } from 'preact'
import SearchPopup from './SearchPopup'
import './style.scss'
import style from './style.string.css'

const sheet = new CSSStyleSheet()
sheet.replaceSync(style)

async function run() {
  const app = document.createElement('chatgpt-popup-search')
  const shadowRoot = app.attachShadow({ mode: 'open' })
  const fragment = document.createDocumentFragment()
  // shadowRoot.appendChild(injectStyle(Browser.runtime.getURL('/popup-search.css')))
  const container = document.createElement('div')
  shadowRoot.adoptedStyleSheets = [sheet]
  render(<SearchPopup />, container)
  shadowRoot.appendChild(fragment)
  shadowRoot.appendChild(container)
  document.body.appendChild(app)
}

run()
