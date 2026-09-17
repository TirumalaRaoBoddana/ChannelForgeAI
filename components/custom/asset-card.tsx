import { FileIcon, ImageIcon, TypeIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AssetCardProps {
  title: string;
  type: "image" | "text" | "video";
  badgeText?: string;
  actionText?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function AssetCard({ title, type, badgeText, actionText = "Download", onAction, children }: AssetCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full group">
      <div className="aspect-video bg-muted relative flex items-center justify-center border-b border-border transition-colors group-hover:bg-accent/50">
        {children || (
          type === "image" ? <ImageIcon className="w-12 h-12 text-muted-foreground/30" /> :
          type === "text" ? <TypeIcon className="w-12 h-12 text-muted-foreground/30" /> :
          <FileIcon className="w-12 h-12 text-muted-foreground/30" />
        )}
      </div>
      <CardHeader className="flex-1 p-5">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base truncate">{title}</CardTitle>
          {badgeText && <Badge variant="secondary" className="shrink-0">{badgeText}</Badge>}
        </div>
      </CardHeader>
      <CardFooter className="p-5 pt-0">
        <Button variant="outline" className="w-full text-sm font-semibold" onClick={onAction}>
          {actionText}
        </Button>
      </CardFooter>
    </Card>
  );
}
