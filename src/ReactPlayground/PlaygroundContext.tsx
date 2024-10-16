import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { compress, fileName2Language, uncompress } from "./utils";
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
  theme: string;
  setTheme: (theme: Theme) => void;
}

export type Theme = "dark" | "light";

export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileName: "App.tsx",
} as PlaygroundContext);

const getFilesFromUrl = () => {
  let files: Files | undefined;
  try {
    const hash = uncompress(window.location.hash.slice(1));
    files = JSON.parse(hash);
  } catch (error) {
    console.error(error);
  }
  return files;
};

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [files, setFiles] = useState<Files>(getFilesFromUrl() || initFiles);
  const [selectedFileName, setSelectedFileName] = useState("App.tsx");
  const [theme, setTheme] = useState<Theme>("light");

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

    setFiles({ ...rest, ...newFile });
  };

  useEffect(() => {
    const hash = compress(JSON.stringify(files));
    window.location.hash = hash;
  }, [files]);

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
        theme,
        setTheme,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};
