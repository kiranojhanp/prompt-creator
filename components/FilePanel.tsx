"use client";

import { useRef, type ChangeEvent, type DragEvent, useState } from "react";
import { useAtom } from "jotai";
import { ChevronDown, FileText, Folder } from "lucide-react";
import {
  filesAtom,
  selectedFilesAtom,
  taskTypeAtom,
  customInstructionsAtom,
  totalLOCAtom,
} from "@/atoms/promptAtoms";
import type { FileType } from "@/types";
import { ImportOptionsDialog } from "./ImportOptionsDialog";
import { Button } from "@/components/ui/button";
import { customInstructionTypes, taskTypes } from "@/atoms/data";

const FilePanel = () => {
  const [files, setFiles] = useAtom(filesAtom);
  const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom);
  const [taskType, setTaskType] = useAtom(taskTypeAtom);
  const [customInstructions, setCustomInstructions] = useAtom(
    customInstructionsAtom
  );
  const [, setTotalLOC] = useAtom(totalLOCAtom);

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importType, setImportType] = useState<"file" | "folder">("file");
  const [filesToImport, setFilesToImport] = useState<File[]>([]);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImportType("file");
      setFilesToImport(Array.from(event.target.files));
      setIsImportDialogOpen(true);
    }
  };

  const handleFolderSelect = () => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  };

  const handleFolderChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImportType("folder");
      setFilesToImport(Array.from(event.target.files));
      setIsImportDialogOpen(true);
    }
  };

  const handleImportConfirm = async (options: any) => {
    const newFiles: FileType[] = await Promise.all(
      filesToImport.map(async (file) => {
        const content = await file.text();
        const loc = content.split("\n").length;
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          content: content,
          loc: loc,
          extension: file.name.split(".").pop() || "",
        };
      })
    );

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    calculateTotalLOC([...files, ...newFiles], selectedFiles);
    setFilesToImport([]);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add("border-blue-500");
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove("border-blue-500");
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove("border-blue-500");
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setImportType("file");
      setFilesToImport(Array.from(event.dataTransfer.files));
      setIsImportDialogOpen(true);
    }
  };

  const toggleFileSelection = (file: FileType) => {
    let newSelection;
    if (selectedFiles.includes(file.name)) {
      newSelection = selectedFiles.filter((f) => f !== file.name);
    } else {
      newSelection = [...selectedFiles, file.name];
    }
    setSelectedFiles(newSelection);
    calculateTotalLOC(files, newSelection);
  };

  const calculateTotalLOC = (filesList: FileType[], selection: string[]) => {
    const loc = filesList
      .filter((file) => selection.includes(file.name))
      .reduce((sum, file) => sum + file.loc, 0);
    setTotalLOC(loc);
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-hidden bg-gray-900 text-white">
      {/* Task Type */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Task Type</h2>
        <div className="relative">
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="bg-gray-800 p-2 rounded w-full text-white appearance-none"
          >
            {taskTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Custom Instructions */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Custom Instructions</h2>
        <div className="relative">
          <select
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="bg-gray-800 p-2 rounded w-full text-white appearance-none"
          >
            {customInstructionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Code Context */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <h2 className="text-lg mb-2">Code Context</h2>

        {/* File List / Drop Area */}
        <div
          className="border border-dashed border-gray-700 rounded flex-grow overflow-auto"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {files.length > 0 ? (
            <ul className="divide-y divide-gray-800">
              {files.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center p-2 hover:bg-gray-800 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.name)}
                    onChange={() => toggleFileSelection(file)}
                    className="w-4 h-4 mr-2"
                  />
                  <FileText size={14} className="mr-2 text-gray-400" />
                  <span className="truncate flex-1">{file.name}</span>
                  <span className="text-gray-400 text-xs">{file.loc} LOC</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs md:text-sm p-4">
              <p className="mb-4 text-center">
                Drag and drop files or folders here
              </p>
              <p className="mb-2">Or</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => document.getElementById("file-input")!.click()}
                  className="flex items-center gap-2"
                  variant="ghost"
                >
                  <FileText size={14} />
                  Add File
                </Button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  onClick={handleFolderSelect}
                  className="flex items-center gap-2"
                  variant="ghost"
                >
                  <Folder size={14} />
                  Add Folder
                </Button>
                <input
                  ref={folderInputRef}
                  type="file"
                  //@ts-ignore
                  directory="true"
                  mozdirectory="true"
                  webkitdirectory="true"
                  multiple
                  className="hidden"
                  onChange={handleFolderChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <ImportOptionsDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onConfirm={handleImportConfirm}
        importType={importType}
      />
    </div>
  );
};

export default FilePanel;
