import { Terminal } from "./components/Terminal";
import "./App.css";
import { useState,useCallback,useEffect } from "react";
import FileTree from "./components/Tree";
import socket from "./socket";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";
import RestartButton from "./components/RestartButton";

function App() {
  // state
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  // now for user code editor and send it to backend
  const [code, setCode] = useState("");

  // function to get file contents
  const isSaved = selectedFileContent === code; // debounce if not saved
  
  // debounce function to send code to backend
  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit("file:change", { path: selectedFile, content: code });
        // console.log('sending data to backend', code)
      }, 5 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
    // eslint-disable-next-line
  }, [code, selectedFile, isSaved]);

  useEffect(() => {
    setCode("");
  },[selectedFile])

  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);
  
  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  // when file gets changed , clear the code
  const getFileContents = useCallback(async () => {
    if (!selectedFile) return; // if no file is selected then return
    const response = await fetch(
      `http://localhost:9000/files/content?path=${selectedFile}`
    );
    const result = await response.json();
    setSelectedFileContent(result.content);
    // eslint-disable-next-line
  }, [selectedFile]);
  // if selected file has content then set code to that content , so that we can see the content in editor
  // useEffect(() => {
  //   if (selectedFileContent && selectedFile) setCode(selectedFileContent);
  //   // eslint-disable-next-line
  // }, [selectedFile, setSelectedFileContent]);
  useEffect(() => {
    if (selectedFile) {
      getFileContents();
    }
    // eslint-disable-next-line
  }, [getFileContents, selectedFile]);

    // rendering the file tree, anytime file gets changed frontend will know and it will render
    useEffect(() => {
      socket.on("file:refresh", getFileTree);
      // cleanup
      return () => {
        socket.off("file:refresh", getFileTree);
      };
    }, []);
  return (
    <div className="playground-container">
      {/* restartServer function call */}
      <RestartButton />
      <div className="editor-container">
        <div className="files">
          <FileTree
            tree={fileTree}
            onSelect={(path) => setSelectedFile(path)}
          />
        </div>
        <div className="editor">
          {selectedFile && <p className="selected-file-bg">{selectedFile.replaceAll("/", " > ")} {isSaved ? 'Saved' : 'UnSaved'}</p>}
          <AceEditor value={code} onChange={(newCode) => setCode(newCode)} editorProps={{ $blockScrolling: true }}
           theme="terminal" vimMode={true} fontSize={16} width="100%" height="100%" enableLiveAutocompletion={true} highlightActiveLine={true} wrapEnabled={true} 
          />
        </div>
      </div>
      <div className="terminal-container">
        <Terminal />
      </div>
    </div>
  );
}

export default App;
