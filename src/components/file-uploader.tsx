import type React from 'react';
import { useState, useRef } from 'react';
import { parseConfigFile } from '@/utils/parse';
import type { FileUploaderProps } from '@/typings';

export default function FileUploader({ onFileLoaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError('');

    if (!file.name.endsWith('.cfg') && !file.name.endsWith('.txt')) {
      setError('Please upload a .cfg or .txt file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = parseConfigFile(content);

        console.log(JSON.stringify(parsedData));

        if (Object.keys(parsedData).length === 0) {
          setError('No valid config entries found in file');
          return;
        }

        onFileLoaded(parsedData, file.name);
      } catch (err) {
        setError('Failed to parse config file');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="bg-primary/20 border-primary flex h-12 w-12 items-center justify-center border-2">
              <svg className="text-primary h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-foreground mb-2 text-4xl font-bold tracking-tight">BATTLEFIELD 6</h1>
          <p className="text-primary text-xl font-semibold tracking-wider">CONFIG EDITOR</p>
          <div className="via-primary mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent to-transparent" />
        </div>

        {/* Upload Area */}
        <div className="bg-card border-border border-2 p-8">
          <div className="mb-6">
            <h2 className="text-muted-foreground mb-2 text-sm font-bold tracking-widest">STEP 1: UPLOAD CONFIG FILE</h2>
            <p className="text-muted-foreground text-sm">Upload your Battlefield 6 configuration file (.cfg or .txt)</p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`rounded border-2 border-dashed transition-all duration-200 ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-border bg-secondary/50 hover:border-primary/50 hover:bg-secondary'
            } `}
          >
            <div className="p-12 text-center">
              <div className="mb-4 flex justify-center">
                <svg className="text-muted-foreground h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-foreground mb-2 text-lg font-semibold">Drop config file here</p>
              <p className="text-muted-foreground mb-6 text-sm">or click to browse</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary/50 border-2 px-6 py-3 font-bold tracking-wider transition-colors"
              >
                SELECT FILE
              </button>
              <input ref={fileInputRef} type="file" accept=".cfg,.txt" onChange={handleFileInput} className="hidden" />
            </div>
          </div>

          {error && (
            <div className="bg-accent/20 border-accent text-accent-foreground mt-4 border p-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          <div className="border-border mt-6 border-t pt-6">
            <p className="text-muted-foreground text-xs">
              <span className="font-bold">SUPPORTED FORMATS:</span> .cfg, .txt
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              <span className="font-bold">LOCATION:</span> Documents/Battlefield 6/settings/
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
