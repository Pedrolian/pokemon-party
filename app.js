"use strict"

var PokedexClass = require('./lib/pokedex/');
var Pokedex = new PokedexClass();

// requires
const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);

// Parties
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
  PartyClass.Parties[party.ID] = party;
  
  res.redirect(`/party/${party.ID}`);
});

app.get("/api/generation/:generationId([1-6]{1})", (req, res) => {
  return res.send(Pokedex.Generation(req.params.generationId));
});
app.get("/api/party/:partyId", (req, res) => {
  if(!PartyClass.Parties.hasOwnProperty(req.params.partyId))
    return res.send({error: true, message: "Invalid party ID."});
  return res.send({error: false, party: PartyClass.Parties[req.params.partyId].party});
});
app.get("/api/party/:partyId/:slotId([1-6]{1})", (req, res) => {
  if(!PartyClass.Parties.hasOwnProperty(req.params.partyId))
    return res.send({error: true, message: "Invalid party ID."});
  return res.send({error: false, party: PartyClass.Parties[req.params.partyId].party[req.params.slotId]});
});

app.get('/party/:partyId', (req, res) => 
{
  if(!PartyClass.Parties.hasOwnProperty(req.params.partyId))
    return res.redirect(`/`);
  return res.sendFile(__dirname + '/public/party.html');
});
app.get('/party/:partyId/simple', (req, res) => 
{
  if(!PartyClass.Parties.hasOwnProperty(req.params.partyId))
    return res.redirect(`/`);
  return res.sendFile(__dirname + '/public/simple.html');
});
app.get('/party/:partyId/:slotId([1-6]{1})', (req, res) => 
{
  if(!PartyClass.Parties.hasOwnProperty(req.params.partyId))
    return res.redirect(`/`);
  return res.sendFile(__dirname + '/public/slot.html');
});

// Socket IO
io.on('connection', (client) =>
{  
  console.log('Client connected...');

  client.on("page-index", () => {
    client.emit('parties', PartyClass.Parties);
  });

  client.on("party", (data) => 
  {
    // Join room for emitting
    client.config = { party: data };
    client.join(`party-${data}`);

    if(!PartyClass.Parties.hasOwnProperty(data))
      return io.to(`party-${data}`).emit('error', "Invalid party ID.");

    io.to(`party-${data}`).emit('generation', PartyClass.Parties[data].Generation());
    io.to(`party-${data}`).emit('party',PartyClass.Parties[data]);
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
      PartyClass.Parties[client.config.party].Set(data);
      io.to(`party-${client.config.party}`).emit('party',PartyClass.Parties[client.config.party]);
    }

  });

});

server.listen(4200);  
console.log(`Sever initialized.. Go to http://localhost:4200`);