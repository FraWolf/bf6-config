import type React from 'react';
import { useState, useRef } from 'react';
import { parseConfigFile } from '@/utils/parse';
import type { FileUploaderProps } from '@/typings';
import { tw } from '@/utils/merge';

export default function FileUploader({ onFileLoaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError('');

    // if (!file.name.endsWith('.cfg') && !file.name.endsWith('.txt')) {
    //   setError('Please upload a .cfg or .txt file');
    //   return;
    // }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = parseConfigFile(content);

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
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <img src="/img/bf6.png" alt="BF6 Logo" className="h-11 w-11 object-contain" />
          </div>
          <h1 className="text-foreground mb-2 text-4xl font-bold tracking-tight">BATTLEFIELD 6</h1>
          <p className="text-primary text-xl font-semibold tracking-wider">CONFIG EDITOR</p>
          <div className="via-primary mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent to-transparent" />
        </div>

        {/* Upload Area */}
        <div className="bg-card border-border border-2 p-8">
          <div className="mb-6">
            <h2 className="text-muted-foreground mb-2 text-sm font-bold tracking-widest">STEP 1: UPLOAD CONFIG FILE</h2>
            <p className="text-muted-foreground text-sm">Upload your Battlefield 6 configuration file (PROFSAVE_profile)</p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={tw('cursor-pointer rounded border-2 border-dashed transition-all duration-200', {
              'border-primary bg-primary/10': isDragging,
              'border-border bg-secondary/50 hover:border-primary/50 hover:bg-secondary': !isDragging
            })}
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary/50 cursor-pointer border-2 px-6 py-3 font-bold tracking-wider transition-colors"
              >
                SELECT FILE
              </button>
              <input ref={fileInputRef} type="file" onChange={handleFileInput} className="hidden" />
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
              <span className="font-bold">LOCATION:</span> Documents/Battlefield 6/settings/
              <span className="font-bold">YOUR PLATFORM</span>/PROFSAVE_profile
            </p>
          </div>
        </div>

        {/* Copyright footer */}
        <div className="mt-6 flex flex-col gap-2 text-center">
          <p className="text-muted text-xs">
            All rights to the Battlefield franchise, including its trademarks, logos, characters, and related content, are
            the property of Electronic Arts Inc. (EA) and its subsidiary DICE (EA Digital Illusions CE AB). This project/fan
            work is not affiliated with, endorsed by, or sponsored by EA or DICE. All rights reserved to their respective
            owners.
          </p>

          <p className="text-muted text-xs">
            made by{' '}
            <a href="https://frawolf.dev" className="text-primary/50" target="_blank">
              frawolf.dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
