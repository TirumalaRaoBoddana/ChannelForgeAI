import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GenerationCardProps {
  status: "idle" | "generating" | "completed" | "error";
  prompt: string;
  progress?: number;
}

export function GenerationCard({ status, prompt, progress = 0 }: GenerationCardProps) {
  return (
    <Card className="relative overflow-hidden border-primary/10">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-primary/40 to-blue-500/20" />
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0">
            {status === "generating" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === "completed" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              {status === "generating" ? "Generating channel brand..." : "Channel Idea"}
            </h4>
            <p className="text-sm text-muted-foreground italic">&ldquo;{prompt}&rdquo;</p>
            
            {status === "generating" && (
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Analyzing niche</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
