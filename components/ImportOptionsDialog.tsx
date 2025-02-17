import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImportOptionsDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (options: ImportOptions) => void
  importType: "file" | "folder"
}

interface ImportOptions {
  includeSubfolders: boolean
  ignoreSuffixes: string
  ignoreFolders: string
}

export function ImportOptionsDialog({ isOpen, onClose, onConfirm, importType }: ImportOptionsDialogProps) {
  const [options, setOptions] = useState<ImportOptions>({
    includeSubfolders: true,
    ignoreSuffixes: "",
    ignoreFolders: "",
  })

  const handleConfirm = () => {
    onConfirm(options)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Import Options - {importType === "file" ? "Files" : "Folder"}</DialogTitle>
          <DialogDescription>
            Configure your {importType} import settings. Media files, binary files, and files larger than 500KB are
            automatically ignored.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {importType === "folder" && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeSubfolders"
                checked={options.includeSubfolders}
                onChange={(e) => setOptions({ ...options, includeSubfolders: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="includeSubfolders">Include files in sub-folders</Label>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ignoreSuffixes" className="text-right">
              Ignore suffixes
            </Label>
            <Input
              id="ignoreSuffixes"
              value={options.ignoreSuffixes}
              onChange={(e) => setOptions({ ...options, ignoreSuffixes: e.target.value })}
              placeholder="e.g., .min.js, .test.js"
              className="col-span-3 bg-gray-700"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ignoreFolders" className="text-right">
              Ignore folders
            </Label>
            <Input
              id="ignoreFolders"
              value={options.ignoreFolders}
              onChange={(e) => setOptions({ ...options, ignoreFolders: e.target.value })}
              placeholder="e.g., node_modules, dist"
              className="col-span-3 bg-gray-700"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

