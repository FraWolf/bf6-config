export interface FileUploaderProps {
  onFileLoaded: (data: Record<string, any>, fileName: string) => void;
}

export interface ConfigEditorProps {
  configData: Record<string, any>;
  fileName: string;
  onBack: () => void;
  onSave: (data: Record<string, any>) => void;
}
