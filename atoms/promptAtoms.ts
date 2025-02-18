import { MiniDb } from "jotai-minidb";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  taskTypeValues,
  customInstructionValues,
  ignoreFoldersData,
  ignoreFileSuffixesData,
} from "./data";
import type { FileType } from "@/types";

const db = (typeof window !== "undefined" ? new MiniDb() : undefined)!;

// Create a MiniDb instance to persist files in IndexedDB.
// We initialize the store with an empty array for the key "files".
const filesDb = (
  typeof window !== "undefined"
    ? new MiniDb<FileType[]>({
        name: "prompt-generator-selected-files",
        initialData: { files: [] },
      })
    : undefined
)!;

// Persist the files under the "files" key.
export const filesAtom = (
  typeof window !== "undefined" ? filesDb.item("files") : atom([])
)!;

export const selectedFilesAtom = atomWithStorage<string[]>("selectedFiles", []);
export const taskTypeAtom = atomWithStorage("taskType", "");
export const customInstructionsAtom = atomWithStorage("customInstructions", "");
export const rawPromptAtom = atomWithStorage<string>("rawPrompt", "");
export const tokenCountAtom = atom<number>(0);
export const tokenLimitAtom = atom<number>(200);
export const usageQuotaAtom = atom<number>(6);
export const maxQuotaAtom = atom<number>(10);
export const taskDifficultyAtom = atom<string>("Easy");
export const isMenuOpenAtom = atom<boolean>(false);
export const totalLOCAtom = atom<number>(0);
export const isMobileAtom = atom<boolean>(false);
export const showFilePanelAtom = atom<boolean>(true);

export const ignoreFileSuffixesAtom = atom<string[]>(ignoreFileSuffixesData);
export const ignoreFoldersAtom = atom<string[]>(ignoreFoldersData);

// Derived atom for final prompt
export const finalPromptAtom = atom((get) => {
  const taskType = get(taskTypeAtom);
  const customInstructions = get(customInstructionsAtom);
  const rawPrompt = get(rawPromptAtom);
  const files = get(filesAtom);
  const selectedFiles = get(selectedFilesAtom);

  let generatedPrompt = [
    taskTypeValues[taskType],
    rawPrompt.length ? `<task>${rawPrompt}</task>` : ``,
    customInstructionValues[customInstructions],
  ]
    .filter(Boolean)
    .join("\n\n")
    .trim();

  // Append content for each selected file.
  const selectedFilesList = files?.filter((file) =>
    selectedFiles.includes(file.name)
  );

  if (selectedFilesList && selectedFilesList.length > 0) {
    selectedFilesList.forEach((file) => {
      generatedPrompt += `\n\n${file.name}\n\`\`\`${file.extension}\n${file.content}\n\`\`\``;
    });
  }

  return generatedPrompt;
});

// Derived atom for token count
export const calculatedTokenCountAtom = atom((get) => {
  const finalPrompt = get(finalPromptAtom);
  const wordCount = finalPrompt.split(/\s+/).length;
  return Math.ceil(wordCount * 1.3);
});
