const http = require('http')
const express = require('express')
// for files and directories system
const fs = require('fs/promises')

const { Server: SocketServer } = require('socket.io')

// for filepath
const path = require("path");
// cors enabling for files and directories
const cors = require("cors");
// for watching files and directories changes
const chokidar = require("chokidar");

const pty = require("node-pty");


// creating terminal
const ptyProcess = pty.spawn("bash", [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + '/user',
  env: process.env,
});

const app = express();
const server = http.createServer(app);
const io = new SocketServer({
  cors: "*",
});

app.use(cors()); // enabling cors

// for restart server from frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

io.attach(server);

// One-liner for current directory , watch all files and directories
chokidar.watch('./user').on('all', (event, path) => {
  io.emit('file:refresh', path)
});

// any output come from ptyProcess
ptyProcess.onData((data) => {
  io.emit("terminal:data", data);
});

io.on("connection", (socket) => {
  // console.log(`socket connected`, socket.id);

  socket.emit("file:refresh"); // to refresh the file tree

  socket.on('file:change', async ({ path, content }) => {
    await fs.writeFile(`./user${path}`, content)
})

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

// route to get the file content
app.get('/files/content', async (req, res) => {
  const path = req.query.path;
  const content = await fs.readFile(`./user${path}`, 'utf-8')
  return res.json({ content })
})

// request post to restart server if incase crashed
app.post('/restart', (req, res) => {
  // process.exit(0);
  fs.utimes('./index.js', new Date(), new Date(), err => {
    if (err) {
      console.log(err);
      res.status(500).send('Server restart failed');
    } else {
      res.send('Server restart initiated');
    }
  });
})


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
