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

class Pokedex
{
  constructor()
  {
    this.ID = require('./ID.js');
    this.Name = require('./Name.js');
  }

  Search(query, callback)
  {
    // Convert string to number if its a number
    if(!isNaN(query))
      query = Number(query);

    switch(typeof query)
    {
      case 'string':
        if(this.Name.hasOwnProperty(query))
          return callback(false, this.Name[query]);
        return callback(new Error("Invalid pokemon."));
        break;
      case 'number':
        if(this.ID.hasOwnProperty(query))
          return callback(false, this.ID[query]);
        return callback(new Error("Invalid pokemon."));
        break;
      default:
        return callback(new Error("Invalid search type."));
        break;
    }
  }

  Generation(query)
  {
    return {
      info: generations[query],
      pokedex: this.PokedexByGeneration(query)
    };
  }

  PokedexByGeneration(generation = false)
  {
    if(generation)
    {
      var info = generations[generation];
      var list = {};
      for(var key in this.ID)
      {
        if(Number(key) <= info.total)
          list[key] = this.ID[key];
        else
          return list;
        if(Number(key) == info.total)
          return list;
      }
    }
  }

}

module.exports = Pokedex;