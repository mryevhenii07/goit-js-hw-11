const axios = require('axios');
export default class PicturesApi {
  constructor() {
    this.inputText = '';
    this.page = 1;
  }
  async fetchPictures() {
    const API_KEY = '24365759-2ae99721413bde5b8bf65f9b1';
    const URL =
      'https://pixabay.com/api/?key=' +
      API_KEY +
      '&q=' +
      encodeURIComponent(`${this.inputText}`) +
      '&image_type=photo' +
      '&orientation=horizontal' +
      '&safesearch=true' +
      `&page=${this.page}` +
      '&per_page=40';
    this.incrementPage();
    const fetchData = await axios.get(URL);
    const fetchEl = await fetchData.data;
    return fetchEl;
  }

  getURL() {
    const URL =
      'https://pixabay.com/api/?key=' +
      '24365759-2ae99721413bde5b8bf65f9b1' +
      '&q=' +
      encodeURIComponent(`${this.inputText}`) +
      '&image_type=photo' +
      '&orientation=horizontal' +
      '&safesearch=true' +
      `&page=${this.page}` +
      '&per_page=40';
    return URL;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get inputValue() {
    return this.inputText;
  }

  set inputValue(newInputValue) {
    this.inputText = newInputValue;
  }
}
