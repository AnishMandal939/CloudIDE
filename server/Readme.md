# Repl.it like Cloud based IDE 
- [ ] Create a cloud based IDE like Repl.it

- bridge connection using socket.io for terminal is done

# implementing terminal with front end :
- [ ] Creating vite project
    - xtermjs - for terminal in front end
    - terminal setup is done 
        Todo: next
            creating bridge using socket.io in frontend

    - enabling cors - in backend to access from front end
        - cors is enabled in backend
        - package install cors
        npm i cors

npm install chokidar - for watching file changes, and restarting the server

# creating bridge for aceEditor with file system
- npm i react-ace - for ace editor : install in client
- npm i socket.io-client - for socket.io client : install in client
    #tasks:
        detect which file is opened in ace editor and send it to server
            - onClick open file in ace editor
        server should send the content of the file to client
