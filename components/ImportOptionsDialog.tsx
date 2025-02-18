"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import { ignoreFileSuffixesAtom, ignoreFoldersAtom } from "@/atoms/promptAtoms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImportOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: {
    ignoreFileSuffixes?: string[];
    ignoreFolders?: string[];
  }) => void;
  importType: "file" | "folder";
}

export const ImportOptionsDialog = ({
  isOpen,
  onClose,
  onConfirm,
  importType,
}: ImportOptionsDialogProps) => {
  const [ignoreFileSuffixes, setIgnoreFileSuffixes] = useAtom(
    ignoreFileSuffixesAtom
  );
  const [ignoreFolders, setIgnoreFolders] = useAtom(ignoreFoldersAtom);

  // Local state for text inputs (comma-separated values)
  const [localSuffixes, setLocalSuffixes] = useState(
    ignoreFileSuffixes.join(",")
  );
  const [localFolders, setLocalFolders] = useState(ignoreFolders.join(","));

  const handleConfirm = () => {
    if (importType === "folder") {
      const newSuffixes = localSuffixes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const newFolders = localFolders
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      // Update atoms so they persist for future dialogs
      setIgnoreFileSuffixes(newSuffixes);
      setIgnoreFolders(newFolders);
      onConfirm({ ignoreFileSuffixes: newSuffixes, ignoreFolders: newFolders });
    } else {
      // For file imports, simply confirm without options
      onConfirm({});
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Import Options</DialogTitle>
          <DialogDescription className="text-gray-400">
            {importType === "folder"
              ? `Configure your ${importType} import settings. Media files, binary files, and files larger than 500KB are automatically ignored.`
              : "Confirm file import."}
          </DialogDescription>
        </DialogHeader>

        {importType === "folder" && (
          <div className="flex flex-col gap-4 my-4">
            <div>
              <label className="block text-sm font-medium ">
                Ignore File Suffixes
              </label>
              <input
                type="text"
                value={localSuffixes}
                onChange={(e) => setLocalSuffixes(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 text-xs text-gray-950"
                placeholder=".env, .log, .gitignore, ..."
              />
              <p className="text-xs text-gray-400">
                Comma-separated list of file suffixes to ignore.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium ">
                Ignore Folders
              </label>
              <input
                type="text"
                value={localFolders}
                onChange={(e) => setLocalFolders(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 text-xs text-gray-950"
                placeholder=".git/, node_modules/, venv/, ..."
              />
              <p className="text-xs text-gray-400">
                Comma-separated list of folder names to ignore.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
