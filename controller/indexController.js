"use strict"

// Lib
const PartyClass = require('../lib/party/');

module.exports = {

  index : (req, res) =>
  {
    res.render('index', { title: "Home", parties: PartyClass.Object });
  },
  post : (req, res) =>
  {
    new PartyClass(req.body.generation, (error, party) => 
    {
      if(error)
        return res.status(404).render('index', { error: true, error_message: "An error occured creating party." });
      
      party.Save();
      PartyClass.Object[party.ID] = party;

      return res.redirect(`/party/${party.ID}`);
    });
  }

}