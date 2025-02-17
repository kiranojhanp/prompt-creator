"use client"

import { useAtom } from "jotai"
import { useEffect } from "react"
import Header from "./Header"
import FilePanel from "./FilePanel"
import PromptPanel from "./PromptPanel"
import { isMobileAtom, showFilePanelAtom } from "@/atoms/promptAtoms"

const PromptGeneratorApp = () => {
  const [isMobile, setIsMobile] = useAtom(isMobileAtom)
  const [showFilePanel, setShowFilePanel] = useAtom(showFilePanelAtom)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setShowFilePanel(window.innerWidth >= 768)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [setIsMobile, setShowFilePanel])

  const toggleFilePanel = () => {
    setShowFilePanel(!showFilePanel)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header toggleFilePanel={toggleFilePanel} />
      <main className="flex flex-1 overflow-hidden">
        {(showFilePanel || !isMobile) && (
          <div className="w-full md:w-[40%] lg:w-[30%] border-r border-gray-800">
            <FilePanel />
          </div>
        )}
        {(!showFilePanel || !isMobile) && (
          <div className="w-full md:w-[60%] lg:w-[70%]">
            <PromptPanel />
          </div>
        )}
      </main>
    </div>
  )
}

export default PromptGeneratorApp

