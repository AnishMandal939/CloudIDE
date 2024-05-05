import { Terminal as XTerminal } from "@xterm/xterm";
import { useRef } from "react";
import { useEffect } from "react";
import "@xterm/xterm/css/xterm.css";
import socket from '../socket.js';

export const Terminal = () => {
  const terminalRef = useRef();
  //   creating a flag if isRendered is true, then only render the terminal, because now it is rendering 2 times, in development mode useEffect runs 2 times and in production mode it runs 1 time
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;
    const term = new XTerminal({
      // options
      cursorBlink: true,
      theme: {
        background: "#020202",
        foreground: "#fff",
      },
      rows: 20,
    });
    // attach terminal, and provide target , which is the ref to the div
    term.open(terminalRef.current);
    term.onData((data) => {
    //   term.write(data);
      console.log(data);
      socket.emit('terminal:write', data);
    });
    socket.on('terminal:data',(data) => {
      term.write(data);
    })
    // eslint-disable-next-line
  }, []);
  return <div id="terminal" ref={terminalRef}></div>;
};
