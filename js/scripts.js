// define three pokemons
let pokemon1 = {
    name: 'Ivysaur',
    height: 100,
    types: ['grass', 'poison'],
    abilities: ['Chlorophyll', 'Overgrow']
};

let pokemon2 = {
    name: 'Jigglypuff',
    height: 50,
    types: ['fairy', 'normal'],
    abilities: ['Cute-charm', 'Friend-guard']
};

let pokemon3 = {
    name: 'Spearow',
    height: 30,
    types: ['flying', 'normal'],
    abilities: ['Keen-eye', 'Sniper']
};

// define list of pokemons
let pokemonList = [pokemon1, pokemon2, pokemon3];

//write names and properties of all pokemons in websites DOM

pokemonList.forEach(function (currentPokemon) {
    //write name of pokemon as headline
    document.write(`<h2>${currentPokemon.name}</h2>`);

    //in the following paragraph display all properties of pokemon
    document.write(`<p><span class="highlight">Properties of ${currentPokemon.name}:</span><br>`);
    document.write(`<span class="highlight">Height:</span> ${currentPokemon.height} cm`);

    //determine if this is a big pokemon
    if (currentPokemon.height > 70) {
        document.write(`<span class="exclaim"> - Wow, that's big!</span>`);
    }

    //display all types of this pokemon
    document.write(`<br><span class="highlight">Types:</span> `);

    currentPokemon.types.forEach(function (currentType) {
        document.write(`${currentType}, `);
    });

    //display all abilities of pokemon
    document.write(`<br><span class="highlight">Abilities:</span> `);

    currentPokemon.abilities.forEach(function (currentAbility) {
        document.write(`${currentAbility}, `);
    });

    document.write(`</p>`);
});
