import { Terminal as XTerminal } from "@xterm/xterm";
import { useRef,useEffect } from "react";
import "@xterm/xterm/css/xterm.css";
import socket from '../socket.js';

export const Terminal = () => {
  const terminalRef = useRef();
  //   creating a flag if isRendered is true, then only render the terminal, because now it is rendering 2 times, in development mode useEffect runs 2 times and in production mode it runs 1 time
  const isRendered = useRef(false);
  const TerminalOptions= {
    cursorBlink: true,
    theme: {
      background: "#020202",
      foreground: "whitesmoke",
    },
    fontFamily: "Monaco",
    rows: 20,
  
  }

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;
    const term = new XTerminal({
      // cursorBlink: true,
      // theme: {
      //   background: "#020202",
      //   foreground: "#fff",
      // },
      // fontFamily: "Monaco",
      // rows: 20,
      ...TerminalOptions
    });
    // attach terminal, and provide target , which is the ref to the div
    term.open(terminalRef.current);
    term.onData((data) => {
    //   term.write(data);
      // console.log(data);
      socket.emit('terminal:write', data);
    });

    // 
    function onTerminalData(data){
      term.write(data);
    }

    socket.on('terminal:data',onTerminalData)

        // Emit initial command to print the username
        socket.emit('terminal:write', `echo $USER\n`);

    // eslint-disable-next-line
  }, []);
  return <div id="terminal" ref={terminalRef}></div>;
};
