import React, { useEffect, useState } from "react";
import classnames from "classnames";
import styles from "./index.module.scss";

interface MessageProps {
  type: "warn" | "error";
  content: string;
}

export const Message: React.FC<MessageProps> = (props: MessageProps) => {
  const { type, content } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!content);
  }, [content]);

  return visible ? (
    <div>
      <div className={classnames(styles.msg, styles[type])}>
        <pre dangerouslySetInnerHTML={{ __html: content }}></pre>
        <button className={styles.dismiss} onClick={() => setVisible(false)}>
          ✕
        </button>
      </div>
    </div>
  ) : null;
};
