import { useAtom } from "jotai"
import { rawPromptAtom, finalPromptAtom, calculatedTokenCountAtom, tokenLimitAtom } from "@/atoms/promptAtoms"

const PromptPanel = () => {
  const [rawPrompt, setRawPrompt] = useAtom(rawPromptAtom)
  const [finalPrompt] = useAtom(finalPromptAtom)
  const [tokenCount] = useAtom(calculatedTokenCountAtom)
  const [tokenLimit] = useAtom(tokenLimitAtom)

  return (
    <div className="w-full p-4 flex flex-col h-full overflow-auto bg-gray-900 text-white">

      {/* Raw Prompt */}
      <div className="mb-12 flex-grow">
        <h2 className="text-md mb-2">Task Instruction</h2>
        <textarea
          value={rawPrompt}
          onChange={(e) => setRawPrompt(e.target.value)}
          placeholder="Enter your task instruction here..."
          className="w-full h-full min-h-[200px] bg-gray-800 p-3 rounded text-white resize-none text-sm"
        />
      </div>

      {/* Final Prompt */}
      <div className="mb-8 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-md">Final Prompt</h2>
          <span className="text-xs text-gray-400">
            {tokenCount} / {tokenLimit}k tokens
          </span>
        </div>
        <textarea
          value={finalPrompt}
          readOnly
          className="w-full h-full min-h-[200px] bg-gray-800 p-3 rounded text-white resize-none text-sm font-mono"
        />
      </div>
    </div>
  )
}

export default PromptPanel

