import { AiFillCopy, AiOutlineReload } from 'react-icons/ai'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import { create } from 'zustand'
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
const useSearch = create<{
  text: string
  setText: (data: string) => void
}>((set) => ({
  text: '',
  setText: (data) => set(() => ({ text: data })),
}))

const SearchPopupBody = () => {
  const { text, setText } = useSearch()
  return (
    <>
      <textarea
        name=""
        onChange={(e) => {
          setText(e.target.value)
        }}
        className="w-full min-h-[70px] bg-gray-900 block border-0 border-b border-gray-700 border-solid"
        placeholder="Search watch you want"
      >
        {text}
      </textarea>
      <div>
        <div className="flex justify-between gap-4 w-full px-4 py-2">
          <h2 className="text-2xl font-semibold">Result: </h2>
          <div className="flex gap-1  items-center">
            <button className="flex btn-icon">
              <AiOutlineReload />
            </button>
            <button className="flex btn-icon">
              <AiFillCopy />
            </button>
          </div>
        </div>
        <ReactMarkdown
          rehypePlugins={[
            [
              rehypeHighlight,
              { detect: true, subset: languageSuport, ignoreMissing: true },
              rehypeKatex,
            ],
          ]}
        >
          {
            "In JavaScript, you can make an HTTP request using the `XMLHttpRequest` object or the `fetch` function.\n\nUsing XMLHttpRequest:\n\n```\nvar xhr = new XMLHttpRequest();\nxhr.open('GET', 'http://example.com/api/data', true);\nxhr.onload = function() {\n    if (xhr.status === 200) {\n        console.log(xhr.responseText);\n    }\n};\nxhr.send();\n```\n\nUsing fetch:\n\n```\nfetch('http://example.com/api/data')\n    .then(function(response) {\n        return response.text();\n    })\n    .then(function(data) {\n        console.log(data);\n    });\n```\n\nBoth methods allow you to send requests to a server and receive a response. The `XMLHttpRequest` object is older and has been replaced by `fetch` in modern browsers, but both methods are still widely used."
          }
        </ReactMarkdown>
      </div>
    </>
  )
}

export default SearchPopupBody
