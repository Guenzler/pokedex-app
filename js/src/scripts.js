const count = 1292; //total number of pokemons available
let limit = 100; //number of items loades with each click on load more Button
let loadMore = document.querySelector('.loadMoreButton');

// IIFE containing repository of pokemons and functions to access them
let pokemonRepository = (function () {
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

    //show a modal on top of list of pokemons that displays the details of the clicked pokemon
    function showModal(pokemon) {

        // get the header and body of bootstrap modal
        let modalBody = document.querySelector('.modal-body');
        let modalTitle = document.querySelector('.modal-title');
        let modalHeader = document.querySelector('.modal-header');

        //read pokemon abilities and create p element for display
        let allPokemonAbilities = document.createElement('p');
        allPokemonAbilities.innerText = 'Abilities: '
        pokemon.abilities.forEach(function (current) {
            let newAbility = document.createElement('span');
            newAbility.classList.add('pokemonAbility');
            newAbility.innerText = current.ability.name;
            allPokemonAbilities.appendChild(newAbility);
        });

        //read pokemon types and create p element for display
        let allPokemonTypes = document.createElement('p');
        allPokemonTypes.innerText = 'Types: ';
        pokemon.types.forEach(function (current) {
            let newType = document.createElement('span');
            newType.classList.add('pokemonTypes');
            newType.innerText = current.type.name;
            allPokemonTypes.appendChild(newType);
        });

        let titleElement = document.createElement('h1');
        titleElement.innerText = pokemon.name;

        let imageElement = document.createElement('img');
        imageElement.src = pokemon.imageUrl;

        let pokemonHeight = document.createElement('p');
        pokemonHeight.innerText = `Height: ${pokemon.height}`;

        modalTitle.appendChild(titleElement);
        modalBody.appendChild(imageElement);

        // check if image showing pokemon from back exists 
        if (pokemon.imageUrlBack) {
            let imageElement2 = document.createElement('img');
            imageElement2.src = pokemon.imageUrlBack;
            modalBody.appendChild(imageElement2);
        }

        modalBody.appendChild(pokemonHeight);
        modalBody.appendChild(allPokemonAbilities);
        modalBody.appendChild(allPokemonTypes);

    }

    //if user clicks a pokemon, call function to first load details then display them
    function displayPropertiesOnClick(pokemon, button) {
        button.addEventListener('click', function () {

            //clear existing modal content before calling function to load Details to avoid showing old data
            document.querySelector('.modal-body').innerHTML = '';
            document.querySelector('.modal-title').innerHTML = '';

            showDetails(pokemon);
        });
    }

    function getRandomColor() {
        let colorArray = ['color1Button', 'color2Button', 'color3Button', 'color4Button', 'color5Button', 'color6Button'];
        let randomInteger = Math.floor(Math.random() * 6);
        return colorArray[randomInteger];
    }

    //function to add one pokemon to list displayed on websites DOM
    function addListItem(pokemon) {
        let displayPokemonList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.classList.add('col-12');
        listItem.classList.add('col-sm-6');
        listItem.classList.add('col-md-4');
        listItem.classList.add('col-xl-3');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('btn');
        button.classList.add(getRandomColor());
        button.classList.add('btn-block');
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#exampleModal');
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
    let showNumberInNavbar = document.querySelector('#showNumberInNavbar');
    let number = pokemonRepository.getAll().length;
    displayNumberPokemons.innerText = `${number} pokemons of ${count} shown`;
    showNumberInNavbar.innerText = `${number} pokemons of ${count} loaded`;
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

});

/*************************************************************** */
/* search function, display of results and some basic navigation */
/*****************************************************************/

let backToListButton = document.querySelector('.backToList');
let loadMoreButton = document.querySelector('.loadMoreButton');
let inputField = document.querySelector('input');

//listening to click on search button and enter key on input field

document.querySelector('.searchButton').addEventListener('click', function (event) {
    event.preventDefault();
    searchPage();
});

inputField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchPage();
    }
});

function hideBackToListButton() {
    // show loadMore Button only when there are pokemons left to load
    if (loadMoreButton.classList.contains('invisible') && (pokemonRepository.getAll().length < count)) {
        loadMoreButton.classList.remove('invisible');
    }

    // make sure to add the class invisible only once
    if (!(backToListButton.classList.contains('invisible'))) {
        backToListButton.classList.add('invisible');
    }
}

function showBackToListButton() {
    if (backToListButton.classList.contains('invisible')) {
        backToListButton.classList.remove('invisible');
    }
    // make sure to add the class invisible only once
    if (!(loadMoreButton.classList.contains('invisible'))) {
        loadMoreButton.classList.add('invisible');
    }
}

backToListButton.addEventListener('click', function (event) {
    //empty page
    document.querySelector('.pokemon-list').innerHTML = '';
    document.querySelector('.displayInfoText').innerText = 'click on Pokemon name to show more details +++ scroll down and click load more to show more pokemons';

    //display all currently downloaded pokemons
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
    showNumberDisplayedPokemons();
    hideBackToListButton();
});

function searchPage() {
    let string = inputField.value.toUpperCase();
    let number = pokemonRepository.getAll().length;

    if (string !== '') {
        // empty page 
        document.querySelector('.pokemon-list').innerHTML = '';
        document.querySelector('#displayNumberPokemons').innerText = 'searched within ' + number + ' pokemons';

        pokemonRepository.getAll().forEach(function (currentPokemon) {
            let currentPokemonName = currentPokemon.name.toUpperCase();
            if (currentPokemonName.indexOf(string) >= 0) {
                pokemonRepository.addListItem(currentPokemon);
            }
        });

        if (document.querySelector('.pokemon-list').innerHTML === '') {
            document.querySelector('.displayInfoText').innerText = 'no pokemon found';
        } else {
            document.querySelector('.displayInfoText').innerText = 'click on pokemon name to show more details';
        }
    }
    showBackToListButton();
}
