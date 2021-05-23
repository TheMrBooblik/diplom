let pcsc = require('pcsclite');
const express = require("express");
const WebSocket = require( "ws");
const http = require('http');
const config = require("./config/default");
const morgan = require("morgan");
const mongoose = require("mongoose");
const DB_URL = `mongodb+srv://${config.DB_USER}:${config.DB_PASS}@cluster.ogztg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const User = require('./models/User')

const app = express();
const server = http.createServer(app)
const wss = new WebSocket.Server({ port: 5000 });

app.use('/api/auth', require('./routes/auth.routes'));

pcsc = pcsc();
let globalWs;

/*wss.on('connection', ws => {
    console.log(11111)

    /!*ws.on('message', m => {
        wss.clients.forEach(client => client.send(m));
    });*!/

    ws.on("error", e => ws.send(e));

    globalWs = ws;
});*/

pcsc.on('reader', function (reader) {
    console.log('Reader detected', reader.name);
    reader.on('error', function (err) {
        console.log('Error(', this.name, '):', status);
    });
    reader.on('status', function (status) {
        console.log('Reader status', status);
        let changes = this.state ^ status.state;
        if (changes) {
            if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                console.log("Card was removed");
                reader.disconnect(reader.SCARD_LEAVE_CARD, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Disconnect');
                    }
                });
            } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                console.log('Card was placed on reader');
                reader.connect({ share_mode: this.SCARD_SHARE_SHARED }, function (err, protocol) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Protocol (', reader.name, '):', protocol);
                        const message = new Buffer([0xFF, 0xCA, 0x00, 0x00, 0x00]);
                        reader.transmit(message, 40, protocol, function (err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Data received: ', data);
                                let rfid = data.readUIntBE(0, 6, true).toString(36);
                                console.log('RFID code: ' + rfid);
                                if (globalWs) {
                                    globalWs.send(rfid);
                                }
                            }
                        });
                    }
                });
            }
        }
    });
});

app.use(express.json({ extended: true }));

async function start() {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('connected to db');
        //app.listen(config.PORT, () => `App has been started on port ${config.PORT}`);
        app.listen(4200, () => console.log("Server started"))
    } catch (e) {
        console.log(e)
    }
}

start();

/*app.use(express.static('public'));
app.use(morgan('dev'));*/

/*app.get('/', (req, res) => {
    res.redirect('/login');
})

app.get('/login', (req, res) => {
    res.render('login', { title: config.TITLE });
})

app.get('/add-user', (req, res) => {
    const user = new User({
        id: 1,
        name: 'Dmitriy',
        status: 'working'
    })

    user.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/users', (req, res) => {
    User.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        })
})

app.use((req, res) => {
    res.status(404).render('404', { title: config.TITLE });
})*/


