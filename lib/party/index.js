"use strict"

const fs = require("fs");
const randomstring = require("randomstring");

const GenerationClass = require("../generation");
const Generation = new GenerationClass();

var PartyObj = {};

class Party {
  
  constructor(generation, callback) 
  {
    generation = Number(generation);

    Generation.Search(generation, (error, generation) => 
    {
      if(error)
        return callback(new Error("Invalid generation."));

      this.ID = randomstring.generate(15);
      this.generation = generation;
      this.slots = new Array(6).fill({ pokemon: false, name: "", type: "normal"});

      //PartyObj[this.ID] = this;
      //this.Save();
      
      return callback(false, this);
    });
  }

  Set(data)
  {
    this.slots = new Array(6).fill({ pokemon: false, name: "", type: "normal"});
    for(var key in data)
    {
      this.slots[key] = data[key];
    }
    this.Save();
  }

  Save()
  {
    fs.writeFile(`./storage/party/${this.ID}.txt`, JSON.stringify(this), (err) =>
    {
      if(err)
        return console.error(err);
    });
  }

  Remove()
  {
    fs.unlinkSync(`./storage/party/${this.ID}.txt`);
    delete PartyObj[this.ID];
  }
}

// Load all files in storage and store it to party object
function Storage()
{
  fs.readdirSync(`./storage/party/`).forEach(file => {
    if(file.indexOf(".txt") >= 0)
    {
      fs.readFile(`./storage/party/${file}`, function (err, data) {

        var tmp = JSON.parse(data);
        new Party(tmp.generation.id, (error, party) => 
        {
          party.ID = tmp.ID;
          party.slots = tmp.slots;
          PartyObj[party.ID] = party;
        });

      });
    }
  });
}
Storage();

module.exports = Party;
module.exports.Object = PartyObj;