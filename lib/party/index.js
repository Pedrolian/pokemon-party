"use strict"

var fs = require('fs');

var Parties = {};

var generations = 
{
  1: { id: 1, total: 151, hasShiny: false },
  2: { id: 2, total: 251, hasShiny: true  },
  3: { id: 3, total: 386, hasShiny: true  },
  4: { id: 4, total: 493, hasShiny: true  },
  5: { id: 5, total: 649, hasShiny: true  },
  6: { id: 6, total: 721, hasShiny: true  }
};

class Party {

  constructor(generation)
  {
    this.ID = randomString();
    this.generation = generation;
    this.party = this.Reset();
  }

  Slot(slot)
  {
    return this.party[slot];
  }

  Set(party)
  {
    this.party = this.Reset();

    var counter = 0;
    for(var key in party)
    {
      if(party[key])
      {
        this.party[counter] = party[key];
        counter++;
      }
    }

    this.Save();
  }

  Reset()
  {
    return [
      { pokemon: false, name: "", type: "normal" },
      { pokemon: false, name: "", type: "normal" },
      { pokemon: false, name: "", type: "normal" },
      { pokemon: false, name: "", type: "normal" },
      { pokemon: false, name: "", type: "normal" },
      { pokemon: false, name: "", type: "normal" },
    ];
  }

  Save()
  {
    fs.writeFile(`${__dirname}/storage/${this.ID}.txt`, JSON.stringify({ID: this.ID, generation: this.generation, party: this.party}), function(err) {
      if(err) {
        return console.log(err);
      }
    });
  }

  Generation()
  {
    return generations[this.generation];
  }
}

// Load all files in storage and store it to party object
function Storage()
{
  fs.readdirSync(`${__dirname}/storage/`).forEach(file => {
    if(file.indexOf(".txt") >= 0)
    {
      fs.readFile(`${__dirname}/storage/${file}`, function (err, data) {

        var tmp = JSON.parse(data);
        var party = new Party(tmp.generation);
        party.ID = tmp.ID;
        party.Set(tmp.party);
        Parties[party.ID] = party;

      });
    }
  });
}
Storage();

/* 
FUNCTIONS
*/
function randomString(length = 10) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

module.exports = Party;
module.exports.Parties = Parties;