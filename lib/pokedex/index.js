"use strict"

const fs = require("fs");

const GenerationClass = require("../generation");
const Generation = new GenerationClass();

class Pokedex {
  
  constructor()
  {

    this.ID = {};
    this.Name = {};

    Load((data) => {
      this.ID = data.ID;
      this.Name = data.Name;
    });

  }

  Generation(query = false, callback)
  {
    query = Number(query);

    Generation.Search(query, (error, generation) => 
    {
      if(error)
        return callback(error);

      var list = {};
      for(var key in this.ID)
      {
        if(Number(key) <= generation.total)
          list[key] = this.ID[key];
        if(Number(key) == generation.total)
          return callback(false, list);
      }
    });
  }

}

function Load(callback)
{
  fs.readFile('./storage/pokedex/ID.json', function (err, data) 
  {
    var ID = JSON.parse(data);
    var Name = {};
    Object.keys(ID).map(function(key, index)
    {
      Name[ ID[key].name ] = ID[key];
    });

    return callback({ ID: ID, Name: Name });
  });
}

module.exports = Pokedex;