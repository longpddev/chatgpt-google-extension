import { create } from 'zustand'
import { Answer } from '../messaging'

export const usePopupState = create<{ show: boolean; toggle: (status?: boolean) => void }>(
  (set) => ({
    show: false,
    toggle: (status?: boolean) =>
      set((state) => {
        return { show: status !== undefined ? status : !state.show }
      }),
  }),
)

export const useChatGpt = create<{
  answer: Answer | undefined
  answering: boolean
  error: boolean
  sending: boolean
  setSending: () => void
  setError: () => void
  setAnswering: () => void
  setAnswered: () => void
  setAnswer: (a: Answer) => void
  resetAnswer: () => void
}>((set) => ({
  answer: undefined,
  answering: false,
  error: false,
  sending: false,
  setSending: () => set({ error: false, answering: false, sending: true }),
  setError: () => set({ error: true, answering: false, sending: false }),
  setAnswering: () => set({ error: false, answering: true, sending: false }),
  setAnswered: () => set({ error: false, answering: false, sending: false }),
  setAnswer: (answer: Answer) => set({ error: false, sending: false, answering: true, answer }),
  resetAnswer: () => set({ answer: undefined }),
}))

export const useSearch = create<{
  text: string
  setText: (data: string) => void
}>((set) => ({
  text: '',
  setText: (data) => set(() => ({ text: data })),
}))

export const useRootDom = create<{
  el: HTMLElement | undefined
  setEl: (el: HTMLElement | undefined) => void
}>((set) => ({
  el: undefined,
  setEl: (data) => set(() => ({ el: data })),
}))

function openPopup() {
  const range = window.getSelection()
  const textSelected = range?.toString().trim() || ''
  if (textSelected && !usePopupState.getState().show) {
    console.log(textSelected)
    useSearch.setState(() => ({
      text: textSelected,
    }))
  }
  usePopupState.setState((state) => {
    return { show: !state.show }
  })
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'm' && e.ctrlKey) {
    openPopup()
  }

  if (e.key === 'Escape' && usePopupState.getState().show) {
    // usePopupState.getState().show = false
    usePopupState.setState(() => ({ show: false }))
  }
})
// usePopupState.setState((state) => {
//   return { show: false }
// })
