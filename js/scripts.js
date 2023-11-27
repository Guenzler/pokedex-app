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

// IIFE containing repository of pokemons and functions to access them
let pokemonRepository = (function () {
    let pokemonList = [pokemon1, pokemon2, pokemon3];

    // function to add new pokemon to pokemonList
    function add(pokemon) {
        if (typeof (pokemon) !== 'object') {
            return 'wrong data type';
        } else if ((Object.keys(pokemon).length === 4) && (Object.keys(pokemon)[0] === 'name' && Object.keys(pokemon)[1] === 'height' && Object.keys(pokemon)[2] === 'types' && Object.keys(pokemon)[3] === 'abilities')) {
            pokemonList.push(pokemon);
        } else {
            return 'object keys don\'t match expected keys';
        }
    }

    //function to return the array pokemonList
    function getAll() {
        return pokemonList;
    }

    //write details of pokemon to console if button is clicked
    function displayPropertiesOnClick(pokemon, button) {
        button.addEventListener('click', function () {
            showDetails(pokemon);
        });
    }

    //function to add one pokemon to list displayed on websites DOM
    function addListItem(pokemon) {
        let displayPokemonList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('listItemButton');
        listItem.appendChild(button);
        displayPokemonList.appendChild(listItem);
        displayPropertiesOnClick(pokemon, button);
    }

    // write details of pokemon to console
    function showDetails(pokemon) {
        console.log(pokemon.name);
        console.log('pokemon height: ' + pokemon.height);
        console.log('pokemon types:');
        pokemon.types.forEach(function (currentType) {
            console.log(currentType);
        })
        console.log('pokemon abilities:');
        pokemon.abilities.forEach(function (currentAbility) {
            console.log(currentAbility);
        })
    }

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        showDetails: showDetails
    };
})();

//display all pokemons on website
pokemonRepository.getAll().forEach(function (currentPokemon) {
    pokemonRepository.addListItem(currentPokemon);
});
