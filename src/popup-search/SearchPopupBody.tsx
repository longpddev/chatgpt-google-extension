import clsx from 'clsx'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AiFillCopy, AiOutlineCheck, AiOutlineReload } from 'react-icons/ai'
import { ImSpinner10 } from 'react-icons/im'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import SimpleBar from 'simplebar-react'
import Browser from 'webextension-polyfill'
import { useChatGpt, useSearch } from './context'
const languageSuport = [
  'python',
  'javascript',
  'java',
  'go',
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'graphql',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'php-template',
  'plaintext',
  'python-repl',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'vbnet',
  'wasm',
  'xml',
  'yaml',
]

interface CopyCodeProps extends React.HTMLAttributes<HTMLElement> {
  className: string | undefined
}
const CopyCode: React.FC<CopyCodeProps> = ({ className, children, ...props }) => {
  const ref = useRef<HTMLElement>(null)
  const [copied, copiedSet] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timer = setTimeout(() => {
      copiedSet(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [copied])
  const handleCopy = () => {
    const el = ref.current
    if (!el) return
    navigator.clipboard.writeText(el.innerText).then(() => copiedSet(true))
  }
  return (
    <code ref={ref} className={clsx(className, 'relative')} {...props}>
      <button
        className={clsx('btn-icon !absolute top-1 right-1 text-lg', {
          'text-green-400 before:opacity-20': copied,
          'text-gray-400': !copied,
        })}
        onClick={handleCopy}
      >
        {copied ? <AiOutlineCheck /> : <AiFillCopy />}
      </button>
      {children}
    </code>
  )
}

const SearchPopupBody = () => {
  const { text, setText } = useSearch()
  const port = useMemo(() => Browser.runtime.connect(), [])
  const ref = useRef<HTMLTextAreaElement>(null)
  const send = () => {
    if (text.trim().length === 0) return
    chatGpt.setSending()
    port.postMessage({ question: text.trim() })
  }
  const chatGpt = useChatGpt()
  useEffect(() => {
    const listener = (msg: any) => {
      if (msg.text) {
        chatGpt.setAnswer(msg)
      } else if (msg.error) {
        chatGpt.setError()
      } else if (msg.event === 'DONE') {
        chatGpt.setAnswered()
      }
    }
    port.onMessage.addListener(listener)
    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const timer = setTimeout(() => el.focus(), 150)
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      <textarea
        ref={ref}
        onChange={(e) => {
          if (chatGpt.answering || chatGpt.sending) {
            setText(text)
            return
          }
          setText(e.target.value)
          e.nativeEvent.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
          e.nativeEvent.preventDefault()
        }}
        className={clsx(
          'w-full h-[70px] bg-gray-900 block border-0 border-b border-gray-700 border-solid',
          {
            'text-opacity-60 text-gray-200': chatGpt.answering || chatGpt.sending,
          },
        )}
        placeholder="Search watch you want"
        onKeyUp={(e) => {
          e.nativeEvent.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
          e.nativeEvent.preventDefault()
        }}
        onKeyDown={(e) => {
          if (chatGpt.answering || chatGpt.sending) return
          if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey) {
            send()
            ;(e.target as HTMLTextAreaElement).blur()
          }

          if (e.key !== 'Escape') {
            e.nativeEvent.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            e.nativeEvent.preventDefault()
          }
        }}
      >
        {text}
      </textarea>
      {chatGpt.answer?.text.length || chatGpt.sending ? (
        <div className="flex flex-col">
          <div className="flex justify-between gap-4 w-full pl-4 py-2 shadow-lg shadow-gray-800 z-[1]">
            {/* <h2 className="text-2xl font-medium text-gray-400">Result: </h2> */}
            <div className="flex gap-1 items-center mr-2">
              <button
                className="flex btn-icon"
                onClick={() => {
                  if (!chatGpt.answering) send()
                }}
              >
                <AiOutlineReload />
              </button>
              <button className="flex btn-icon">
                <AiFillCopy />
              </button>
            </div>
          </div>
          <SimpleBar className="px-4 py-2 chat-gpt-result pt-6">
            {chatGpt.sending && (
              <>
                <div className="absolute inset-0 w-full h-full bg-gray-700 bg-opacity-20 z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <ImSpinner10 className="text-3xl icon text-gray-300 animate-spin" />
                </div>
              </>
            )}

            <div className="min-h-[100px]">
              <ReactMarkdown
                rehypePlugins={[
                  [
                    rehypeHighlight,
                    { detect: true, subset: languageSuport, ignoreMissing: true },
                    rehypeKatex,
                  ],
                ]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <CopyCode className={className} {...props}>
                        {children}
                      </CopyCode>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {/* {
              "In JavaScript, you can make an HTTP request using the `XMLHttpRequest` object or the `fetch` function.\n\nUsing XMLHttpRequest:\n\n```\nvar xhr = new XMLHttpRequest();\nxhr.open('GET', 'http://example.com/api/data', true);\nxhr.onload = function() {\n    if (xhr.status === 200) {\n        console.log(xhr.responseText);\n    }\n};\nxhr.send();\n```\n\nUsing fetch:\n\n```\nfetch('http://example.com/api/data')\n    .then(function(response) {\n        return response.text();\n    })\n    .then(function(data) {\n        console.log(data);\n    });\n```\n\nBoth methods allow you to send requests to a server and receive a response. The `XMLHttpRequest` object is older and has been replaced by `fetch` in modern browsers, but both methods are still widely used."
            } */}
                {chatGpt.answer?.text || ''}
              </ReactMarkdown>
            </div>
          </SimpleBar>
        </div>
      ) : null}
    </>
  )
}

export default SearchPopupBody
