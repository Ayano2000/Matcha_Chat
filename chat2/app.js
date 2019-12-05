const express   = require('express');
const app       = express();

// set the template engine.
app.set('view engine', 'ejs');
// middleware
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
    res.render('index');
});

server = app.listen(3000)
console.log("server listening on port 3000");

const io = require('socket.io')(server);
// listen on every connection.

io.on('connection', (socket) => {
    console.log("new user connected");
    // set username.
    socket.username = "Arata";
    // listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username;
    });
    // listen on new message
    socket.on('new_message', (data) => {
        // show message
        io.sockets.emit('new_message', {message : data.message, username: socket.username});
    });
});