import { create } from 'zustand'

export const usePopupState = create<{ show: boolean; toggle: (status?: boolean) => void }>(
  (set) => ({
    show: false,
    toggle: (status?: boolean) =>
      set((state) => {
        return { show: status !== undefined ? status : !state.show }
      }),
  }),
)

document.addEventListener('keydown', (e) => {
  if (e.key === 'm' && e.ctrlKey) {
    usePopupState.setState((state) => {
      return { show: !state.show }
    })
  }
})
// usePopupState.setState((state) => {
//   return { show: false }
// })
