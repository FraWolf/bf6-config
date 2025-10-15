import { useEffect, useState } from 'react';
import FileUploader from '@/components/file-uploader';
import ConfigEditor from '@/components/config-editor';
import type { LocalStorageConfig } from './typings';

export function App() {
  const [configData, setConfigData] = useState<Record<string, Record<string, any>> | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileLoaded = (data: Record<string, any>, name: string) => {
    setConfigData(data);
    setFileName(name);
  };

  const handleBack = () => {
    setConfigData(null);
    setFileName('');
  };

  useEffect(() => {
    if (!configData && !fileName) {
      const localStorageConfig = localStorage.getItem('configFile');
      if (localStorageConfig) {
        const data: LocalStorageConfig = JSON.parse(localStorageConfig);

        // If localStorage is corrupted or invalid, reset it
        if (!data?.fileName || !data?.content) {
          localStorage.removeItem('configFile');
          return;
        }

        // Updated values from localstorage
        setConfigData(data.content);
        setFileName(data.fileName);
      }
    }
  }, []);

  // Update localStorage when configData gets updated
  useEffect(() => {
    if (configData || fileName) {
      localStorage.setItem('configFile', JSON.stringify({ fileName, content: configData }));
    }
  }, [configData, fileName]);

  return (
    <main className="bg-background min-h-screen">
      {!configData ? (
        <FileUploader onFileLoaded={handleFileLoaded} />
      ) : (
        <ConfigEditor configData={configData} fileName={fileName} onBack={handleBack} onSave={setConfigData} />
      )}
    </main>
  );
}
