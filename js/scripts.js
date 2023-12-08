const count = 1292; //total number of pokemons available
let limit = 100; //number of items loades with each click on load more Button
let loadMore = document.querySelector('.loadMoreButton');

// IIFE containing repository of pokemons and functions to access them
let pokemonRepository = (function () {
    let modalContainer = document.querySelector('#modal-container');
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

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

    //a subset of available pokemons defined by offset and limit is loaded from API
    //loaded pokemons are then added to array pokemonList
    function loadList(offset, limit) {
        let apiUrlCurrent = apiUrl + '?offset=' + offset + '&limit=' + limit;
        return fetch(apiUrlCurrent).then(function (response) {
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

    //show a modal on top of list of pokemons that displays the detais of the clicked pokemon
    function showModal(pokemon) {

        //Clear all existing modal content
        modalContainer.innerHTML = '';

        let modal = document.createElement('div');
        modal.classList.add('modal');

        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText = 'close';
        closeButtonElement.addEventListener('click', hideModal);

        //read all pokemon abilities from array pokemon.abilities
        let allPokemonAbilities = '';
        pokemon.abilities.forEach(function (current) {
            allPokemonAbilities += ('<span class = "pokemonAbility">' + current.ability.name + '</span> ');
        });
        let pokemonAbilities = `Abilities: ${allPokemonAbilities}`;

        //read all pokemon types from array pokemon.types
        let allPokemonTypes = ''
        pokemon.types.forEach(function (current) {
            allPokemonTypes += ('<span class = "pokemonTypes">' + current.type.name + '</span> ');
        });
        let pokemonTypes = `Types: ${allPokemonTypes}`;

        let titleElement = document.createElement('h1');
        titleElement.innerText = pokemon.name;

        let imageElement = document.createElement('img');
        imageElement.src = pokemon.imageUrl;

        let contentElement1 = document.createElement('p');
        contentElement1.innerText = `Height: ${pokemon.height}`;

        let contentElement2 = document.createElement('p');
        contentElement2.innerHTML = pokemonAbilities;

        let contentElement3 = document.createElement('p');
        contentElement3.innerHTML = pokemonTypes;

        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(imageElement);

        // check if image showing pokemon from back exists 
        if (pokemon.imageUrlBack) {
            let imageElement2 = document.createElement('img');
            imageElement2.src = pokemon.imageUrlBack;
            modal.appendChild(imageElement2);
        }

        modal.appendChild(contentElement1);
        modal.appendChild(contentElement2);
        modal.appendChild(contentElement3);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');

        modalContainer.addEventListener('click', function (e) {
            let target = e.target;
            if (target === modalContainer) {
                hideModal();
            }
        });
    }

    function hideModal() {

        modalContainer.classList.remove('is-visible');
    }

    //remove Modal when escape key is hit
    window.addEventListener('keydown', function (event) {

        if (event.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

    //if user clicks a pokemon, call function to first load details then display them
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

    //load details for a given pokemon from api, add details to pokemon object
    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            // add the details to the item
            item.imageUrl = details.sprites.front_default;
            item.imageUrlBack = details.sprites.back_default;
            item.height = details.height;
            item.types = details.types;
            item.abilities = details.abilities;
        }).catch(function (e) {
            console.error(e);
        });
    }

    // after details of pokemon have been loaded from api, call function to display modal
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            showModal(pokemon);
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

//show how many pokemons are displayed on website
function showNumberDisplayedPokemons() {
    let displayNumberPokemons = document.querySelector('#displayNumberPokemons');
    let number = pokemonRepository.getAll().length;
    displayNumberPokemons.innerText = `${number} of ${count} shown`;
}

//on loading page display the first batch of pokemons on website
pokemonRepository.loadList(0, limit).then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
    showNumberDisplayedPokemons();
});

//load and display the next batch when button is clicked
loadMore.addEventListener('click', function () {
    let offset = pokemonRepository.getAll().length;
    let newLimit;
    if (offset + limit <= count) {
        newLimit = limit;
    } else {
        newLimit = count - offset;
    }

    pokemonRepository.loadList(offset, newLimit).then(function () {
        pokemonRepository.getAll().slice(offset).forEach(function (pokemon) {
            pokemonRepository.addListItem(pokemon);
        });
        showNumberDisplayedPokemons();
        if (pokemonRepository.getAll().length === count) {
            loadMore.classList.add('invisible');
        }
    });

})
