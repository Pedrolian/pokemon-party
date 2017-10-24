"use strict"

class Generation {
  
  constructor()
  {
    this.generations = {
      1: { id: 1, total: 151, hasShiny: false },
      2: { id: 2, total: 251, hasShiny: true  },
      3: { id: 3, total: 386, hasShiny: true  },
      4: { id: 4, total: 493, hasShiny: true  },
      5: { id: 5, total: 649, hasShiny: true  },
      6: { id: 6, total: 721, hasShiny: true  }
    }
  }

  Search(query, callback)
  {
    query = Number(query);
    
    if(!this.generations.hasOwnProperty(query))
      return callback(new Error("Invalid generation."));

    return callback(false, this.generations[query]);
  }
}

module.exports = Generation;