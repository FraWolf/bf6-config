"use client";

import { useState } from "react";
import FileUploader from "@/components/file-uploader";
import ConfigEditor from "@/components/config-editor";

export function App() {
  const [configData, setConfigData] = useState<Record<string, any> | null>(
    null
  );
  const [fileName, setFileName] = useState<string>("");

  const handleFileLoaded = (data: Record<string, any>, name: string) => {
    setConfigData(data);
    setFileName(name);
  };

  const handleBack = () => {
    setConfigData(null);
    setFileName("");
  };

  return (
    <main className="min-h-screen bg-background">
      {!configData ? (
        <FileUploader onFileLoaded={handleFileLoaded} />
      ) : (
        <ConfigEditor
          configData={configData}
          fileName={fileName}
          onBack={handleBack}
          onSave={setConfigData}
        />
      )}
    </main>
  );
}
