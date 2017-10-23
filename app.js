"use strict"

var PokedexClass = require('./lib/pokedex/');
var Pokedex = new PokedexClass();

// requires
const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);

// Parties
var Parties = {};
const PartyClass = require('./lib/party');

// Middleware
app.use(express.static(__dirname + '/node_modules'));  
app.use(express.static(__dirname + '/asset'));  

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {  
  res.sendFile(__dirname + '/public/index.html');
});
app.post('/', (req, res) => 
{
  var party = new PartyClass(req.body.generation);
  Parties[party.ID] = party;
  
  res.redirect(`/party/${party.ID}`);
});

app.get("/generation/:generationId", (req, res) => {
  return res.send(Pokedex.Generation(req.params.generationId));
});

app.get('/party/:partyId', (req, res) => 
{
  if(!Parties.hasOwnProperty(req.params.partyId))
    return res.redirect(`/`);
  return res.sendFile(__dirname + '/public/party.html');
});
app.get('/party/:partyId/simple', (req, res) => 
{
  if(!Parties.hasOwnProperty(req.params.partyId))
    return res.redirect(`/`);
  return res.sendFile(__dirname + '/public/simple.html');
});
app.get('/party/:partyId/:slotId', (req, res) => 
{
  if(!Parties.hasOwnProperty(req.params.partyId))
    return res.redirect(`/`);
  return res.sendFile(__dirname + '/public/slot.html');
});

// Socket IO
io.on('connection', (client) =>
{  
  console.log('Client connected...');

  client.on("party", (data) => 
  {
    // Join room for emitting
    client.config = { party: data };
    client.join(`party-${data}`);

    if(!Parties.hasOwnProperty(data))
      return io.to(`party-${data}`).emit('error', "Invalid party ID.");

    io.to(`party-${data}`).emit('party',Parties[data]);
  });

  client.on("input", (data) => 
  {
    // Process input
    var foundError = false;
    for(var key in data)
    {
      if(data[key].pokemon)
      {
        Pokedex.Search(data[key].pokemon, (error, pokemon) =>
        {
          if(error)
          {
            foundError = true;
            return io.to(`party-${client.config.party}`).emit('error', `Pokemon ${data[key].pokemon} not found.`);
          }
          data[key].pokemon = pokemon;
        });
      }
      else 
      {
        data[key] = false;
      }
    }

    var counter = 1;
    if(!foundError)
    {
      Parties[client.config.party].Set(data);
      io.to(`party-${client.config.party}`).emit('party',Parties[client.config.party]);
    }

  });

});

server.listen(4200);  