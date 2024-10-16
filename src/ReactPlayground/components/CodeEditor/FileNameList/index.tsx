import React, { useContext, useEffect, useState } from "react";
import {
  APP_COMPONENT_FILE_NAME,
  ENTRY_FILE_NAME,
  IMPORT_MAP_FILE_NAME,
} from "../../../files";

import { PlaygroundContext } from "../../../PlaygroundContext";
import { FileNameItem } from "./FileNameItem";
import styles from "./index.module.scss";

export default function FileNameList() {
  const {
    files,
    addFile,
    removeFile,
    selectedFileName,
    updateFileName,
    setSelectedFileName,
  } = useContext(PlaygroundContext);

  const [tabs, setTabs] = useState([""]);

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  const handleEditComplete = (name: string, prevName: string) => {
    updateFileName(prevName, name);
    setSelectedFileName(name);
    setCreating(false);
  };

  const [creating, setCreating] = useState(false);
  const addTab = () => {
    addFile("Comp" + Math.random().toString().slice(2, 4) + ".tsx");
    setCreating(true);
  };

  const handleRemove = (name: string) => {
    removeFile(name);
    setSelectedFileName(ENTRY_FILE_NAME);
  };

  const readonlyFileNames = [
    ENTRY_FILE_NAME,
    IMPORT_MAP_FILE_NAME,
    APP_COMPONENT_FILE_NAME,
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((item, index, arr) => {
        return (
          <FileNameItem
            key={item + index}
            value={item}
            actived={selectedFileName === item}
            creating={creating && index === arr.length - 1}
            readonly={readonlyFileNames.includes(item)}
            onClick={() => setSelectedFileName(item)}
            onEditComplete={(name: string) => handleEditComplete(name, item)}
            onRemove={() => {
              handleRemove(item);
            }}
          />
        );
      })}
      <div className={styles["add"]} onClick={addTab}>
        +
      </div>
    </div>
  );
}
