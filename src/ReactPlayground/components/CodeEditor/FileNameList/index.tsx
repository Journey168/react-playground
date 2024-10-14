import React, { useContext, useEffect, useState } from "react";

import { PlaygroundContext } from "../../../PlaygroundContext";
import { FileNameItem } from "./fileNameItem";
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

  return (
    <div className={styles.tabs}>
      {tabs.map((item, index) => {
        return (
          <FileNameItem
            key={item + index}
            value={item}
            actived={selectedFileName === item}
            onClick={() => setSelectedFileName(item)}
          />
        );
      })}
    </div>
  );
}
