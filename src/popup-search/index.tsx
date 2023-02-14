// import './style.scss'
import { render } from 'preact'
import Main from './Main'
import './style.scss'
import style from './style.string.css'

// const sheet = new CSSStyleSheet()
// sheet.replaceSync(style)
function injectStyle() {
  const styleDom = document.createElement('style')
  styleDom.innerHTML = style
  return styleDom
}
async function run() {
  const app = document.createElement('chatgpt-popup-search')
  const shadowRoot = app.attachShadow({ mode: 'closed' })
  const fragment = document.createDocumentFragment()
  shadowRoot.appendChild(injectStyle())
  const container = document.createElement('div')
  render(<Main />, container)
  shadowRoot.appendChild(fragment)
  shadowRoot.appendChild(container)
  document.body.appendChild(app)
}

run()
