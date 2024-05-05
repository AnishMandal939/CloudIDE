import { Terminal } from "./components/Terminal";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import FileTree from "./components/Tree";
import socket from "./socket";

function App() {
  // state 
  const [fileTree, setFileTree] = useState({});

  const getFileTree = async() => {
    const response = await fetch("http://localhost:9000/files")
    const result = await response.json()
    setFileTree(result.tree)
  }

  // when component mounts, loads the file tree, so that we can see the files and directories
  // useEffect(() => {
  //   getFileTree();
  // }, [])

  // rendering the file tree, anytime file gets changed frontend will know and it will render
  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    // cleanup
    return () => {
      socket.off("file:refresh", getFileTree);
    }
  }, [])
  return (
    <div className="playground-container">
      <div className="editor-container">
        <div className="files">
          <FileTree tree={fileTree} />
        </div>
        <div className="editor"></div>
      </div>
      <div className="terminal-container">
        <Terminal />
      </div>
    </div>
  );
}

export default App;
