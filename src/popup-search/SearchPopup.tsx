import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { GrClose } from 'react-icons/gr'
import { usePopupState } from './context'
import SearchPopupBody from './SearchPopupBody'
const SearchPopup = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { show, toggle } = usePopupState()

  useEffect(() => {
    const el = ref.current

    if (!el) return

    if (show) {
      el.classList.remove('no-visible')
      el.classList.add('show')
    } else {
      el.classList.remove('show')
    }
    const handle = () => {
      if (!show) {
        el.classList.add('no-visible')
      }
    }

    el.addEventListener('transitionend', handle)

    return () => {
      el.removeEventListener('transitionend', handle)
    }
  }, [show])

  return (
    <div ref={ref} className={clsx('search-popup no-visible')}>
      {show && (
        <div className="flex flex-col search-popup__content">
          <div className="flex justify-between pl-4 py-2 items-center bg-gray-800 border-0 border-b border-solid border-gray-700">
            <span>ChatGPT</span>
            <button
              onClick={() => toggle(false)}
              className="text-inherit btn-icon flex p-1 mr-2 hover:text-orange-500 cursor-pointer"
            >
              <GrClose className="" />
            </button>
          </div>
          <SearchPopupBody />
        </div>
      )}
    </div>
  )
}

export default SearchPopup
