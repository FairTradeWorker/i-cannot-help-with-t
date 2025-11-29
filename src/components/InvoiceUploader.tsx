// src/components/InvoiceUploader.tsx
'use client';

import { useState } from 'react';
import { uploadInvoiceImages } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileImage, Loader } from '@phosphor-icons/react';

export function InvoiceUploader({ jobId }: { jobId: string }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      await uploadInvoiceImages(jobId, Array.from(files));
      toast.success('Invoice processed — AI just learned from this job!');
    } catch (error) {
      console.error('Failed to process invoice:', error);
      toast.error('Failed to read invoice');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        <FileImage className="w-4 h-4" />
        Upload final invoice photos (AI reads them automatically)
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {uploading && (
        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
          <Loader className="w-4 h-4 animate-spin" />
          AI is reading invoice...
        </p>
      )}
    </div>
  );
}

