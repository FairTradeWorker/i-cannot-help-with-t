// src/components/InvoiceUploader.tsx
'use client';

import { useState } from 'react';
import { uploadInvoiceImages } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@phosphor-icons/react';  // ← FIXED

export function InvoiceUploader({ jobId }: { jobId: string }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      await uploadInvoiceImages(jobId, Array.from(files));
      toast.success('Invoice processed — AI just learned from this job!');
    } catch (err) {
      toast.error('Failed to read invoice');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-foreground mb-3">
        Upload final invoice photos <span className="text-muted-foreground">(AI reads automatically)</span>
      </label>
      
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
      />
      
      {uploading && (
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <Spinner className="w-4 h-4 animate-spin" weight="bold" />
          <span>AI is reading your invoice...</span>
        </div>
      )}
    </div>
  );
}

