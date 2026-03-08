import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileUploaderProps {
  onFilesSelect: (files: File[]) => void;
  isProcessing: boolean;
  progress: { total: number; completed: number; pending: number; currentFile?: string } | null;
  error?: string | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelect, isProcessing, progress, error }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFiles(acceptedFiles);
      onFilesSelect(acceptedFiles);
    }
  }, [onFilesSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true,
    disabled: isProcessing
  } as any);

  const clearFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFiles([]);
  };

  const progressPercentage = progress ? (progress.completed / progress.total) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer transition-all duration-300 ease-in-out",
          "border-2 border-dashed rounded-3xl p-12 text-center",
          isDragActive ? "border-brand-500 bg-brand-50/50" : "border-slate-200 hover:border-brand-400 hover:bg-slate-50/50",
          isProcessing && "opacity-50 cursor-not-allowed pointer-events-none",
          error && "border-red-200 bg-red-50/30"
        )}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isProcessing && progress ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <div className="relative">
                <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
                <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full animate-pulse" />
              </div>
              
              <div className="w-full max-w-sm">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">Processing Files</span>
                  <span className="text-slate-500">{progress.completed} / {progress.total}</span>
                </div>
                
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-brand-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <div className="mt-4 flex flex-col gap-1">
                  <p className="text-sm text-slate-600 font-medium truncate">
                    {progress.currentFile || 'Preparing...'}
                  </p>
                  <div className="flex justify-center gap-4 text-xs text-slate-400">
                    <span>Completed: {progress.completed}</span>
                    <span>Pending: {progress.pending}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : selectedFiles.length > 0 ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="p-4 bg-brand-100 rounded-2xl text-brand-600">
                <FileText className="w-10 h-10" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-medium text-slate-800">
                  {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
                </span>
                <div className="flex flex-wrap justify-center gap-2 max-w-md">
                  {selectedFiles.map((file, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600 truncate max-w-[120px]">
                      {file.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={clearFiles}
                className="mt-2 flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="p-4 bg-slate-100 rounded-2xl text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-500 transition-colors">
                <Upload className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Upload Statements</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Drag & drop multiple PDF or Image bank statements here
                </p>
                <p className="text-xs text-slate-400 mt-4">
                  Supports PDF, PNG, JPG, WebP
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700"
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">Extraction Failed</p>
            <p className="opacity-90">{error}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
