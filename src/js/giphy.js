import fetch from 'unfetch';

const ENDPOINT = 'https://api.giphy.com/v1/gifs/search';
const LIMIT = 100;

export default class GiphySearch {
  constructor (apiKey, rating = 'g') {
    this.apiKey = apiKey;
    this.queryMemo = {};
    this.rating = rating;
  }

  searchMemoized (term) {
    if (this.queryMemo[term]) {
      return this.queryMemo[term];
    }
    this.queryMemo[term] = this.search(term);
    return this.queryMemo[term];
  }

  search (term) {
    const encodedTerm = encodeURIComponent(term);
    const url = `${ENDPOINT}?api_key=${this.apiKey}&q=${encodedTerm}&limit=${LIMIT}&rating=${this.rating}`;
    return fetch(url)
      .then(response => response.json());
  }

  /**
   * Gets a random GIF for the specified search term, drawing them from the
   * list of results returned from a search for the term. (Really this is
   * "random GIF from the X most recent search results").
   */
  randomGIF (term) {
    return this.searchMemoized(term)
      .then((results) => {
        const count = results.data.length;
        const max = count - 1;
        const randIndex = Math.floor(Math.random() * max);
        return results.data[randIndex];
      });
  }
}
