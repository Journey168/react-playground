import { createContext, PropsWithChildren, useState } from "react";
import { fileName2Language } from "./utils";
import { initFiles } from "./files";

export interface File {
  name: string;
  value: string;
  language: string;
}

export interface Files {
  [key: string]: File;
}

export interface PlaygroundContext {
  files: Files;
  addFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  setFiles: (files: Files) => void;
  selectedFileName: string;
  setSelectedFileName: (fileName: string) => void;
  updateFileName: (oldFileName: string, NewFileName: string) => void;
}

export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileName: "App.tsx",
} as PlaygroundContext);

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [files, setFiles] = useState<Files>(initFiles);
  const [selectedFileName, setSelectedFileName] = useState("App.tsx");

  const addFile = (fileName: string) => {
    files[fileName] = {
      name: fileName,
      value: "",
      language: fileName2Language(fileName),
    };

    setFiles({ ...files });
  };
  const removeFile = (fileName: string) => {
    delete files[fileName];

    setFiles({ ...files });
  };
  const updateFileName = (oldFileName: string, newFileName: string) => {
    if (
      !files[oldFileName] ||
      newFileName === undefined ||
      newFileName === null
    )
      return;

    const { [oldFileName]: oldFile, ...rest } = files;

    const newFile = {
      [newFileName]: {
        ...oldFile,
        name: newFileName,
        language: fileName2Language(newFileName),
      },
    };

    setFiles({ ...newFile, ...rest });
  };

  return (
    <PlaygroundContext.Provider
      value={{
        files,
        setFiles,
        addFile,
        removeFile,
        selectedFileName,
        setSelectedFileName,
        updateFileName,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};
