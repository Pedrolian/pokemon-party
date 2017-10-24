"use strict"

const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);

const bodyParser = require('body-parser');

// set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(__dirname + '/public'));  
app.use(express.static(__dirname + '/node_modules')); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Routes
app.use('/', require('./routes'));

// Controller
const partyController = require('./controller/partyController');

// IO
io.on('connection', (client) =>
{  
  
  client.on('party-join', (data) => {
    client.join(`party-${data}`);
  });

  client.on('party-update', (data) => {
    partyController.update(data, (error, party) => {
      if(!error)
        io.to(`party-${party.ID}`).emit('party-update', party);
    });
  });

});

server.listen(4200);  
console.log(`Server has initiated - http://localhost:4200/`);