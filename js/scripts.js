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
for (let i = 0; i < pokemonList.length; i++) {

    //write name of pokemon as headline
    document.write(`<h2>${pokemonList[i].name}</h2>`);

    //in the following paragraph display all properties of pokemon
    document.write(`<p><span class="highlight">Properties of ${pokemonList[i].name}:</span><br>`);
    document.write(`<span class="highlight">Height:</span> ${pokemonList[i].height} cm`);

    //determine if this is a big pokemon
    if (pokemonList[i].height > 70) {
        document.write(`<span class="exclaim"> - Wow, that's big!</span>`);
    }

    //display all types of this pokemon
    document.write(`<br><span class="highlight">Types:</span> `);
    for (let j = 0; j < pokemonList[i].types.length; j++) {
        document.write(`${pokemonList[i].types[j]} `);
    }

    //display all abilities of pokemon
    document.write(`<br><span class="highlight">Abilities:</span> `);
    for (let k = 0; k < pokemonList[i].abilities.length; k++) {
        document.write(`${pokemonList[i].abilities[k]} `);
    }
    document.write(`</p>`);
}