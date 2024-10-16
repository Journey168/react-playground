import { useContext, useEffect, useRef, useState } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";
// import Editor from "../CodeEditor/Editor";
// import { compile } from "./compiler.worker";
import CompilerWoker from "./compiler.worker?worker";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "../../files";
import { Message } from "../Message";
import { debounce } from "lodash-es";

interface MessageData {
  data: {
    type: string;
    message: string;
  };
}

export default function Preview() {
  const getIframeUrl = () => {
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `
    '<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>'
    `
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `
    <script type="module" id="appSrc">${compiledCode}</script>
    `
      );

    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  };

  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState("");
  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());

  const compilerWokerRef = useRef<Worker>();
  useEffect(() => {
    if (!compilerWokerRef.current) {
      compilerWokerRef.current = new CompilerWoker();
      compilerWokerRef.current.addEventListener("message", ({ data }) => {
        if (data.type === "COMPILED_CODE") {
          console.log("worker", data);
          setCompiledCode(data.data);
        } else {
          console.error("error", data);
        }
      });
    }
  }, []);
  useEffect(
    debounce(() => {
      // const res = compile(files);
      // setCompiledCode(res);
      compilerWokerRef.current?.postMessage(files);
    }, 500),
    [files]
  );

  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]);

  // 异常处理
  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data;

    if (type === "ERROR") {
      setError(message);
    }
    if (type === "RESET_ERROR") {
      setError("");
    }
  };
  const [error, setError] = useState("");
  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <iframe
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          padding: 0,
          border: "none",
        }}
      />
      {/* <Editor
        file={{
          name: "dist.js",
          value: compiledCode,
          language: "javascript",
        }}
      /> */}
      <Message type="error" content={error} />
    </div>
  );
}
