const {
  Socket
} = require('dgram');
const express = require('express')
const app = express()
const http = require('http').Server(app);
const port = 80
const io = require('socket.io')(http);
const fetch = require('node-fetch');

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
})

let users = {};
let timers = {};
let sockets = {};
let ips = {};
let bans = ['77.127.26.240', '23.227.142.146', '209.205.218.45', '23.227.140.172', '23.227.142.230', '209.205.217.126', '23.227.142.228', '23.227.142.218', '195.181.160.247', '185.220.101.16', '185.191.126.240', '198.251.89.198', '195.37.209.9', '46.19.141.82', '51.81.82.226', '109.70.100.37', '185.220.100.250', '142.44.133.80'];

io.on('connection', client => {
  if (client.handshake.address == '141.226.236.144' || bans.findIndex(o => client.handshake.address.indexOf(o) != -1) == -1 && Object.values(ips).indexOf(client.handshake.address) == -1 && Object.keys(users).indexOf(client.id) == -1) {
    ips[client.id] = client.handshake.address;
    client.on('login', name => {
      if (name != undefined) {
        users[client.id] = {
          name: String(name).substring(0, 10),
          message: '',
          x: 250,
          y: 350,
          admin: client.handshake.address.indexOf('192.168.1.1') != -1,
          sayar: false,
          piss: false
        };
        sockets[client.id] = client;
        console.log(client.handshake.address, name, client.id);
        client.emit('login', users);
        client.broadcast.emit('user-connected', client.id, users[client.id]);
        fetch('https://api.ipdata.co/' + client.handshake.address.split('::ffff:').join('') + '/threat?api-key=8abd94f8109e24644603cabe39b2e2e481b99c48419caaa49a879475')
          .then(res => res.json())
          .then(res => {
            if (res.is_threat) {
              bans.push(ips[client.id]);
              console.log(ips[client.id] + ' has banned');
              sockets[client.id].disconnect();
            }
          })
      }
    });

    client.on('move', (x, y) => {
      if (users[client.id] !== undefined && !isNaN(x) && !isNaN(y)) {
        users[client.id].x = Math.min(960, Math.max(0, x));
        users[client.id].y = Math.min(600, Math.max(310, y));
        io.emit('user-updated', client.id, users[client.id]);
      }
    });

    client.on('message', message => {
      if (String(message).trim().length > 0) {
        if (String(message).startsWith('!')) {
          if (String(message) == '!piss') {
            users[client.id].piss = true;
            io.emit('user-updated', client.id, users[client.id]);
            users[client.id].piss = false;
          } else if (!!users[client.id].admin && String(message).startsWith('!ban')) {
            bans.push(ips[message.split('!ban ').join('')]);
            sockets[message.split('!ban ').join('')].disconnect();
            io.emit('user-updated', client.id, users[client.id]);
          }
        } else {
          users[client.id].message = String(message);
          clearTimeout(timers[client.id]);
          timers[client.id] = undefined;
          timers[client.id] = setTimeout(() => {
            if (users[client.id] !== undefined) {
              users[client.id].message = '';
              io.emit('user-updated', client.id, users[client.id]);
            }
          }, 5000);
          io.emit('user-updated', client.id, users[client.id]);
        }
      }
    });

    client.on('disconnect', () => {
      client.broadcast.emit('user-disconnected', client.id);
      console.log(ips[client.id] + ' disconnected');
      delete users[client.id];
      delete ips[client.id];
    });
  }
});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});