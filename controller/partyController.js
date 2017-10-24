"use strict"

// Lib
const PartyClass = require('../lib/party/');
const PokedexClass = require('../lib/pokedex');
const Pokedex = new PokedexClass();

module.exports = {

  index : (req, res) =>
  {
    var partyID = req.params.partyId;

    if(!PartyClass.Object.hasOwnProperty(partyID))
      return res.redirect("/");

    var party = PartyClass.Object[partyID];

    Pokedex.Generation(party.generation.id, (error, pokedex) => 
    {
      if(error)
        return res.redirect("/");

      return res.render('party/index', { title: "Party", party: party, pokedex: pokedex });
    });

  },

  update : (data, callback) =>
  {
    if(!PartyClass.Object.hasOwnProperty(data.ID))
      return callback(true);

    var party = PartyClass.Object[data.ID];
    party.Set(data.slots);

    return callback(false, party);
  },

  show : (req, res) => 
  {
    var partyID = req.params.partyId;

    if(!PartyClass.Object.hasOwnProperty(partyID))
      return res.redirect("/");  

    var party = PartyClass.Object[partyID];

    return res.render('party/show', { party: party });
  },

  delete : (req, res) => 
  {
    var partyID = req.params.partyId;

    if(!PartyClass.Object.hasOwnProperty(partyID))
      return res.redirect("/");  

    var party = PartyClass.Object[partyID];
    party.Remove();
    
    return res.redirect("/");
  }

}