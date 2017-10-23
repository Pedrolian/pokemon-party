"use strict"

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