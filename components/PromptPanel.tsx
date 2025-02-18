import { useAtom } from "jotai";
import { useState } from "react";
import {
  rawPromptAtom,
  finalPromptAtom,
  calculatedTokenCountAtom,
  tokenLimitAtom,
} from "@/atoms/promptAtoms";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const COPY_ANIMATION_DURATION = 1500; // ms

const PromptPanel = () => {
  const [rawPrompt, setRawPrompt] = useAtom(rawPromptAtom);
  const [finalPrompt] = useAtom(finalPromptAtom);
  const [tokenCount] = useAtom(calculatedTokenCountAtom);
  const [tokenLimit] = useAtom(tokenLimitAtom);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      if (!finalPrompt.trim()) {
        throw new Error("No content to copy");
      }

      setCopying(true);
      setError(null);

      if (!navigator.clipboard) {
        throw new Error("Clipboard API not available");
      }

      await navigator.clipboard.writeText(finalPrompt);

      toast({
        title: "Copied successfully!",
        description: "The prompt has been copied to your clipboard",
        duration: 2000,
      });

      // Reset copying state after animation
      setTimeout(() => setCopying(false), COPY_ANIMATION_DURATION);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to copy");
      setCopying(false);

      toast({
        title: "Failed to copy",
        description:
          err instanceof Error ? err.message : "Couldn't copy to clipboard",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full p-4 flex flex-col h-full overflow-auto bg-gray-900 text-white">
      {/* Raw Prompt */}
      <div className="mb-12 flex-grow">
        <h2 className="text-md mb-2">Task Instruction</h2>
        <Textarea
          value={rawPrompt}
          onChange={(e) => setRawPrompt(e.target.value)}
          placeholder="Enter your task instruction here..."
          className="w-full h-full min-h-[200px] bg-gray-800 p-3 text-white resize-none text-sm"
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
        <div className="relative h-full">
          <Textarea
            value={finalPrompt}
            readOnly
            className="w-full h-full min-h-[200px] bg-gray-800 p-3 text-white resize-none text-sm font-mono"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 h-8 w-8 bg-gray-800/50 hover:bg-gray-700 backdrop-blur-sm transition-all duration-200 
                           focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-600"
                  disabled={copying || !finalPrompt.trim()}
                >
                  {copying ? (
                    <Check className="h-4 w-4 text-green-300 animate-in zoom-in duration-300" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copying ? "Copied!" : error || "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default PromptPanel;
