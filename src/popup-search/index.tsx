// import './style.scss'
import { render } from 'preact'
import simplebarStyle from 'simplebar-react/dist/simplebar.min.css'
import { POPUP_APP_ELEMENT_NAME } from './contant'
import { useRootDom } from './context'
import './initCustomElement'
import Main from './Main'
import markdowStyle from './markdow.string.css'
import './style.scss'
import style from './style.string.css'
// const sheet = new CSSStyleSheet()
// sheet.replaceSync(style)
function injectStyle() {
  const fragment = document.createDocumentFragment()
  const styleFont = document.createElement('style')
  const styleDom = document.createElement('style')
  styleDom.innerHTML = simplebarStyle + markdowStyle + style
  styleFont.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
  `
  fragment.appendChild(styleFont)
  fragment.appendChild(styleDom)
  return fragment
}
async function run() {
  const app = document.createElement(POPUP_APP_ELEMENT_NAME)
  app.setAttribute('tabindex', '0')
  const shadowRoot = app.attachShadow({ mode: 'open' })
  useRootDom.setState(() => ({ el: app }))
  app.addEventListener('connected', () => {
    console.log('app connected')
  })
  // const shadowRoot = app
  const fragment = document.createDocumentFragment()
  shadowRoot.appendChild(injectStyle())
  const container = document.createElement('div')
  render(<Main />, container)
  shadowRoot.appendChild(fragment)
  shadowRoot.appendChild(container)
  document.body.appendChild(app)
}

run()
