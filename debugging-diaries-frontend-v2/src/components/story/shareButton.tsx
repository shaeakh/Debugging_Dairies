import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { LuCheck, LuCopy, LuShare2 } from 'react-icons/lu';

interface ShareButtonProps {
  shareUrl: string; // যে লিঙ্কটি শেয়ার বা কপি করা হবে তা প্রপ হিসেবে আসবে
}

const ShareButton = ({ shareUrl }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      // ২ সেকেন্ড পর আবার কপি আইকনে ফেরত যাওয়ার জন্য
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setCopied(false);
      }}
    >
      {/* মডাল ওপেন করার ট্রিগার হিসেবে আমাদের আসল শেয়ার বাটনটি ব্যবহার করা হলো */}
      <DialogTrigger asChild>
        <button
          className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          title="Share Story"
        >
          <LuShare2 className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border border-border rounded-2xl p-6 shadow-lg animate-in zoom-in-95">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Share Story
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Copy the link below to share this debugging diary entry with others.
          </DialogDescription>
        </DialogHeader>

        {/* লিঙ্ক ডিসপ্লে এবং কপি করার কন্টেইনার */}
        <div className="flex items-center gap-2 mt-4 bg-background border border-border rounded-xl p-2 pl-3">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-transparent text-xs text-muted-foreground outline-none overflow-x-auto"
          />
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg border transition-all shrink-0 flex items-center justify-center ${
              copied
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-muted/50 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            title={copied ? 'Copied!' : 'Copy Link'}
          >
            {copied ? (
              <LuCheck className="w-4 h-4 animate-in fade-in zoom-in duration-200" />
            ) : (
              <LuCopy className="w-4 h-4" />
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
