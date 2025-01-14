import { Mtg } from "./api/mtg.js";
import { ColorStats } from "./widgets/colorStats.js";
import { ManaCostStats } from "./widgets/manaCostStats.js";

document.addEventListener("DOMContentLoaded", setup);

const deck = {};


var color_data = [
    { color: "NoColor", count: 0},
    { color: "W", count: 0},
    { color: "U", count: 0},
    { color: "G", count: 0},
    { color: "R", count: 0},
    { color: "B", count: 0}
];

var data = [
    { cost: "0", count: 0 },
    { cost: "1", count: 0 },
    { cost: "2", count: 0 },
    { cost: "3", count: 0 },
    { cost: "4", count: 0 },
    { cost: "5", count: 0 },
    { cost: "6", count: 0 },
    { cost: '7+', count: 0 }
];

function setup() {
    const mtg = new Mtg();
    new ColorStats(color_data).buildStats(document.getElementById("colorStats"));
    new ManaCostStats(data).buildStats(document.getElementById("manaStats"));
    let allCards = [];
    const cardsContainer = document.getElementById('cardsContainer');
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        mtg.loadCards(searchInput.value)
            .then((cards) => {

                renderCardList(cards);
            })
            .catch((error) => {
                console.error('Error loading cards:', error);
            });
    });
}

function renderCardList(cards) {
    const menu = document.getElementById('listContainer');
    const list = document.createElement('ul');

    cards.forEach(card => {
        const listItem = document.createElement('li');
        listItem.innerHTML = card.name;

        listItem.addEventListener('click', () => {
            displayCardDetails(card);
        });

        list.appendChild(listItem);
    });

    menu.innerHTML = '';
    menu.appendChild(list);
}

function displayCardDetails(card) {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';

    const cardImage = document.createElement('img');
    cardImage.src = card.imageUrl; 
    cardImage.alt = card.name;

    const cardDescription = document.createElement('p');
    cardDescription.innerText = card.text || 'No description';

    const cardColor = document.createElement('p');
    cardColor.innerText = "Color: " + (card.colors ? card.colors.join(", ") : "No color");

    const rarity = document.createElement('p');
    rarity.innerText = "Rarity: " + card.rarity;

    const manaCost = document.createElement('p');
    manaCost.innerText = "Mana Cost: " + card.cmc;

    const addToDeckButton = document.createElement('button');
    addToDeckButton.innerText = 'Add card';
    
    addToDeckButton.addEventListener('click', () => {
        addToDeck(card);
        updateStats();
        displayDeck();
 
      
    });

    cardsContainer.appendChild(cardImage);
    cardsContainer.appendChild(cardDescription);
    cardsContainer.appendChild(cardColor);
    cardsContainer.appendChild(manaCost);
    cardsContainer.appendChild(rarity);
    cardsContainer.appendChild(addToDeckButton);
}

function addToDeck(card) {
    const isUnique = (card.rarity === "Mythic Rare" || card.rarity === "Rare");
    const existingCount = deck[card.name] ? deck[card.name].count : 0;

    if (isUnique) {
        if (existingCount >= 1) {
            alert(`You have already added a unique card "${card.name}" `);
            return;
        }
    } else if (existingCount >= 4) {
        alert(`You cannot add more than 4 copies of the card "${card.name}".`);
        return;
    }
    if (card.colors != null) {
        card.colors.forEach(color => {
            let found = color_data.find(c => c.color === color); // Проверка на наличие цвета
            if (found) {
                found.count++; // Увеличиваем count
            } else {
                color_data.push({ color: color, count: 1 }); // Добавляем новый цвет
            }
        });
    } else
    {
        color_data[0].count++;
    }
    if (card.cmc != null)
    {
        if (card.cmc >= 7)
            {
                data[7].count++;
            }
            else
            {
                data[card.cmc].count++;
            }
    }
    if (deck[card.name]) {
        deck[card.name].count += 1; 
    } else {
        deck[card.name] = { ...card, count: 1 }; 
    }
}

function removeFromDeck(cardName) {
    if (deck[cardName]) {
        const card = deck[cardName];
        if (card.colors != null) {
            card.colors.forEach(color => {
                let found = color_data.find(c => c.color === color); // Проверка на наличие цвета
                if (found) {
                    found.count--; // Увеличиваем count
                } else {
                    //color_data.push({ color: color, count: 1 }); // Добавляем новый цвет
                }
            });
        } else
        {
            color_data[0].count--;
        }


        if (card.cmc >= 7) {
            data[7].count --; 
        } else if (card.cmc >= 0 && card.cmc <= 6) {
            data[card.cmc].count --; 
        }

        deck[cardName].count -= 1;

        if (deck[cardName].count <= 0) {
            delete deck[cardName];
        }

        updateStats(); 
        displayDeck(); 
    }
}


function updateStats() {
    const colorStatsContainer = document.getElementById("colorStats");
    const manaStatsContainer = document.getElementById("manaStats");

    colorStatsContainer.innerHTML = '';
    manaStatsContainer.innerHTML = '';

    const colorStats = new ColorStats(color_data);
    colorStats.buildStats(colorStatsContainer);

    const manaStats = new ManaCostStats(data);
    manaStats.buildStats(manaStatsContainer);
}

function displayDeck() {
    const cardsContainer = document.getElementById('cardsContainer');
    const deckContainer = document.createElement('div');
    deckContainer.innerHTML = '<h2>Your Cards</h2>';
    
    for (const cardKey in deck) {
        const card = deck[cardKey];
        const cardElement = document.createElement('div');
        cardElement.classList.add('deck-card');
        
        const cardImage = document.createElement('img');
        cardImage.src = card.imageUrl;
        cardImage.alt = card.name;

        const cardCount = document.createElement('span');
        cardCount.innerText = ` x${card.count}`; 

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Delete';
        removeButton.addEventListener('click', () => removeFromDeck(cardKey));

        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardCount);
        cardElement.appendChild(removeButton);
        
        deckContainer.appendChild(cardElement);
    }

    cardsContainer.innerHTML = '';
    cardsContainer.appendChild(deckContainer); 
}
