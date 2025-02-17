import type React from "react"
import { useAtom } from "jotai"
import { FileText, X } from "lucide-react"
import { isMobileAtom, showFilePanelAtom } from "@/atoms/promptAtoms"

interface HeaderProps {
  toggleFilePanel: () => void
}

const Header: React.FC<HeaderProps> = ({ toggleFilePanel }) => {
  const [isMobile] = useAtom(isMobileAtom)
  const [showFilePanel] = useAtom(showFilePanelAtom)

  return (
    <header className="flex justify-between items-center p-2 md:p-4 border-b border-gray-800 bg-gray-900 text-white">
      <div className="text-xl font-semibold flex items-center">
        {isMobile && (
          <button className="mr-2 p-1" onClick={toggleFilePanel}>
            {showFilePanel ? <X size={16} /> : <FileText size={16} />}
          </button>
        )}
        Prompt Generator
      </div>
    </header>
  )
}

export default Header

