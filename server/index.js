const http = require("http");
const express = require("express");
const { Server: SocketServer } = require("socket.io");
// for files and directories system
const fs = require("fs/promises");

// for filepath
const path = require("path");

const pty = require("node-pty");

// creating terminal
const ptyProcess = pty.spawn("bash", [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + "/user",
  env: process.env,
});

const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});

io.attach(server);

// any output come from ptyProcess
ptyProcess.onData((data) => {
  io.emit("terminal:data", data);
});

io.on("connection", (socket) => {
  // console.log(`socket connected`, socket.id);

  socket.on("terminal:write", (data) => {
    ptyProcess.write(data);
  });
});

// now work on user files and directories
app.get("/files", async (req, res) => {
  // files can be in tree structure so we need to construct that, we'll be using inbuilt package `fs` to read files and directories
  const fileTree = await generateFileTree("./user");
  return res.json({ tree: fileTree });
});
server.listen(9000, () => console.log(`Docker is running on port 9000`));

// function to generate file tree,
// whenever we work with files , always think of recursive solution, because tree works on recursive solution
async function generateFileTree(directory) {
  const tree = {};

  // function that will run recursively
  async function buildTree(currentDir, currentTree) {
    const files = await fs.readdir(currentDir);
    for (const file of files) {
      // can be folder or files,
      // now for filepath, we'll use path module
      const filepath = path.join(currentDir, file);
      const stat = await fs.stat(filepath); // to know if it is a folder or file
      // if directory/folder then work recursively on it
      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filepath, currentTree[file]); // recursive call to curr directory
      } else {
        currentTree[file] = null;
      }
    }
  }
  // return tree
  await buildTree(directory, tree);
  return tree;
}
