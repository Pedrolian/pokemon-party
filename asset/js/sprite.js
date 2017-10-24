function SpriteDiv(generation, type, pokemon, name)
{
  return `
    <div style="position: relative">
    <div id="pokemon-name" class="text-center">${name}</div>
    <div id="pokemon-sprite" class="text-center center-block pokedex-gen-${generation}-${type} pokemon-${pokemon}"></div>
    </div>
  `;
}