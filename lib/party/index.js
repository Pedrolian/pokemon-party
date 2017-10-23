"use strict"

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

  Generation()
  {
    return generations[this.generation];
  }
}

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