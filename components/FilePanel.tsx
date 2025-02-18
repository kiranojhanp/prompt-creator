"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useAtom } from "jotai";
import { useDropzone } from "react-dropzone";
import { ChevronDown, FileText, Folder, Trash2, Upload } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const FilePanel = () => {
  // State management via Jotai
  const [files, setFiles] = useAtom(filesAtom);
  const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom);
  const [taskType, setTaskType] = useAtom(taskTypeAtom);
  const [customInstructions, setCustomInstructions] = useAtom(
    customInstructionsAtom
  );
  const [, setTotalLOC] = useAtom(totalLOCAtom);

  // Local state for import workflow and errors
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importType, setImportType] = useState<"file" | "folder">("file");
  const [filesToImport, setFilesToImport] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Refs for file & folder inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Handler for file input selection
  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files && event.target.files.length > 0) {
        setImportType("file");
        const validFiles = Array.from(event.target.files).filter(
          (file) => file.size < 10 * 1024 * 1024 // 10MB limit
        );
        if (validFiles.length !== event.target.files.length) {
          setUploadError("Some files were skipped due to size limitations");
        }
        setFilesToImport(validFiles);
        setIsImportDialogOpen(true);
      }
    } catch (error) {
      setUploadError("Error processing files. Please try again.");
    }
  };

  // Trigger folder selection
  const handleFolderSelect = () => {
    folderInputRef.current?.click();
  };

  // Handler for folder input selection
  const handleFolderChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImportType("folder");
      setFilesToImport(Array.from(event.target.files));
      setIsImportDialogOpen(true);
    }
  };

  // Handler for drag-and-drop events
  const handleDrop = async (acceptedFiles: File[]) => {
    try {
      const validFiles = acceptedFiles.filter(
        (file) => file.size < 10 * 1024 * 1024
      );
      if (validFiles.length !== acceptedFiles.length) {
        setUploadError("Some files were skipped due to size limitations");
      }
      setImportType("file");
      setFilesToImport(validFiles);
      setIsImportDialogOpen(true);
    } catch (error) {
      setUploadError("Error processing dropped files. Please try again.");
    }
  };

  // Process files after confirming import options
  const handleImportConfirm = async (options: any) => {
    try {
      setUploadError(null);
      const newFiles: FileType[] = await Promise.all(
        filesToImport.map(async (file) => {
          const content = await file.text();
          const loc = content.split("\n").length;
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            content,
            loc,
            extension: file.name.split(".").pop() || "",
          };
        })
      );

      const previousFiles = files ?? [];
      const updatedFiles = [...previousFiles, ...newFiles];
      //@ts-ignore
      setFiles(updatedFiles);
      calculateTotalLOC(updatedFiles, selectedFiles);
      setFilesToImport([]);
      setIsImportDialogOpen(false);
    } catch (error) {
      setUploadError("Error importing files. Please try again.");
    }
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = files?.filter((file) => file.name !== fileName);
    if (updatedFiles) {
      //@ts-ignore
      setFiles(updatedFiles);
      setSelectedFiles(selectedFiles.filter((name) => name !== fileName));
      calculateTotalLOC(updatedFiles, selectedFiles);
    }
  };

  const removeAllFiles = () => {
    //@ts-ignore
    setFiles([]);
    setSelectedFiles([]);
    setTotalLOC(0);
  };

  // Recalculate total LOC based on selected files
  const calculateTotalLOC = (filesList: FileType[], selection: string[]) => {
    const loc = filesList
      .filter((file) => selection.includes(file.name))
      .reduce((sum, file) => sum + file.loc, 0);
    setTotalLOC(loc);
  };

  // Toggle file selection when checkbox is clicked
  const toggleFileSelection = (file: FileType) => {
    const newSelection = selectedFiles.includes(file.name)
      ? selectedFiles.filter((f) => f !== file.name)
      : [...selectedFiles, file.name];
    setSelectedFiles(newSelection);

    const previousFiles = files ?? [];
    calculateTotalLOC(previousFiles, newSelection);
  };

  // Setup dropzone; using noClick to prevent clicks inside from triggering the file dialog
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
  });

  // Reusable button group for file/folder upload
  const renderUploadButtons = () => (
    <div className="flex gap-2">
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
        variant="ghost"
      >
        <FileText size={14} />
        Add File
      </Button>
      <Button
        onClick={handleFolderSelect}
        className="flex items-center gap-2"
        variant="ghost"
      >
        <Folder size={14} />
        Add Folder
      </Button>
      <input
        ref={fileInputRef}
        id="file-input"
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept=".js,.jsx,.ts,.tsx,.css,.html,.json,.md"
      />
      <input
        ref={folderInputRef}
        type="file"
        //@ts-ignore
        directory=""
        webkitdirectory=""
        multiple
        className="hidden"
        onChange={handleFolderChange}
      />
    </div>
  );

  return (
    <div className="p-4 flex flex-col h-full overflow-hidden bg-gray-900 text-white">
      {/* Task Type Section */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Task Type</h2>
        <div className="relative">
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="bg-gray-800 p-2 rounded w-full text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

      {/* Custom Instructions Section */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Custom Instructions</h2>
        <div className="relative">
          <select
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="bg-gray-800 p-2 rounded w-full text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

      {/* Code Context & File Upload Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">Code Context</h2>
          <Button variant="ghost" onClick={removeAllFiles}>
            <Trash2 size={16} className="mr-2" /> Remove all
          </Button>
        </div>

        {uploadError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <div
          {...getRootProps()}
          className={`border border-dashed rounded flex-grow overflow-auto transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          <input {...getInputProps()} />

          {files && files.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-800">
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center p-2 hover:bg-gray-800 text-sm group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.name)}
                      onChange={() => toggleFileSelection(file)}
                      onClick={(e) => e.stopPropagation()} // Prevent dropzone click propagation
                      className="w-4 h-4 mr-2 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <FileText size={14} className="mr-2 text-gray-400" />
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="text-gray-400 text-xs">
                      {file.loc} LOC
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(file.name)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
              {/* Display upload buttons below the file list */}
              <div className="p-4 flex justify-center">
                {renderUploadButtons()}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs md:text-sm p-4">
              <Upload size={24} className="mb-4 text-gray-500" />
              <p className="mb-4 text-center">Drag and drop files here</p>
              <p className="mb-2">Or</p>
              {renderUploadButtons()}
            </div>
          )}
        </div>
      </div>

      {/* Import Options Dialog */}
      <ImportOptionsDialog
        isOpen={isImportDialogOpen}
        onClose={() => {
          setIsImportDialogOpen(false);
          setFilesToImport([]);
          setUploadError(null);
        }}
        onConfirm={handleImportConfirm}
        importType={importType}
      />
    </div>
  );
};

export default FilePanel;
