const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongoDB').MongoClient
const app = express();
var http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
var usernames = [];

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/css', express.static('css'));
app.use('/img', express.static('img'));

var db;

MongoClient.connect('mongodb://test-user:user123@ds111963.mlab.com:11963/test-db', function (err, database) {
    if (err) return console.log(err);
    db = database;
    server.listen(3000, function () {
        console.log('listening to port 3000');
    });
});

io.sockets.on('connection', function (socket) {
    console.log('Socket Connected...');

    socket.on('new user', function (data, callback) {
        if (usernames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    function updateUsernames() {
        io.sockets.emit('usernames', usernames);
    }

    socket.on('send message', function (data) {
        io.sockets.emit('new message', {
            msg: data,
            user: socket.username
        });
    });
    socket.on('disconnect', function (data) {
        if (!socket.username) {
            return;
        }
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames;
    });
});
app.get('/', function (req, res) {
    res.sendFile('public/index.html', {
        root: __dirname
    });
});

app.post('/suggest', function (req, res) {
    db.collection('suggest').save(req.body, function (err, result) {
        if (err) return console.log(err);

        console.log('saved to our db');
        res.redirect('/');
    })
})

app.post('/suggest2', function (req, res) {
    db.collection('suggest2').save(req.body, function (err, result) {
        if (err) return console.log(err);

        console.log('saved to our db');
        res.redirect('/about.html');
    })
})

app.post('/suggest3', function (req, res) {
    db.collection('suggest3').save(req.body, function (err, result) {
        if (err) return console.log(err);

        console.log('saved to our db');
        res.redirect('/contact.html');
    })
})

app.post('/suggest4', function (req, res) {
    db.collection('suggest4').save(req.body, function (err, result) {
        if (err) return console.log(err);

        console.log('saved to our db');
        res.redirect('/chat.html');
    })
})

app.post('/offer', function (req, res) {
    db.collection('offer').save(req.body, function (err, result) {
        if (err) return console.log(err);

        console.log('saved to our db');
        res.redirect('/contact.html');
    })
})