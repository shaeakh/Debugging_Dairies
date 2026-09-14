import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LuSparkles } from 'react-icons/lu';

interface SummaryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string | null;
}

const SummaryDialog = ({
  isOpen,
  onOpenChange,
  summary,
}: SummaryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-lg rounded-xl p-6 md:p-8 bg-card border-border gap-4">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg md:text-xl font-bold text-foreground">
            <LuSparkles className="w-5 h-5 text-primary animate-pulse" />
            AI Generated Summary
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            A quick digestible brief of the developer's diary entry.
          </DialogDescription>
        </DialogHeader>

        <hr className="border-border" />

        <div className="py-2">
          <p className="text-sm md:text-base text-foreground leading-relaxed font-sans whitespace-pre-wrap">
            {summary || 'No summary available for this story.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDialog;
