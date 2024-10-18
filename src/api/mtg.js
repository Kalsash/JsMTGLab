class Mtg {

    constructor(baseUrl = "https://api.magicthegathering.io/v1/") {
        this.baseUrl = baseUrl;
    }


    /*loadCards(){
        return fetch(`${this.baseUrl}cards`)
            .then(response=>response.json())
            .then(json=>json.cards)
    }
            */

    async loadCards(name = '') {
        const url = new URL('cards', this.baseUrl).toString() + '?' + new URLSearchParams({
        name: name
        }).toString();
        return fetch(url).then(response=>response.json()).then(json=>json.cards)
        }
}


export {Mtg}
