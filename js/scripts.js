
// IIFE containing repository of pokemons and functions to access them
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    // function to add new pokemon to pokemonList
    function add(pokemon) {
        if (typeof (pokemon) === 'object' && 'name' in pokemon && 'detailsUrl' in pokemon) {
            pokemonList.push(pokemon);
        } else {
            console.log('wrong data type');
        }
    }

    //function to return the array pokemonList
    function getAll() {
        return pokemonList;
    }

    //load list of pokemon from API, then write pokemons into array pokemonList
    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
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

    //load details for a given pokemon from api
    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            // add the details to the item
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
            item.abilities = details.abilities;
        }).catch(function (e) {
            console.error(e);
        });
    }

    // write pokemon object to console
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            console.log(pokemon);
        })
    }

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadDetails: loadDetails,
        showDetails: showDetails,
        loadList: loadList
    };
})();

//display all pokemons on website
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});
