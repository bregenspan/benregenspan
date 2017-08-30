import fetch from 'unfetch';

const G = function (apiKey) {
  this.apiKey = apiKey;
};

G.prototype.getRandomMrDiv = function (callback) {
  if (this._requesting) {
    return false;
  }
  if (!this.data) {
    const ENDPOINT = 'http://api.giphy.com/v1/gifs/artists?api_key=' + this.apiKey + '&username=mrdiv&limit=100';
    this._requesting = true;
    fetch(ENDPOINT)
      .then(response => response.json())
      .then((data) => {
        this.data = data;
        this._requesting = false;
        this._getRandomGIF(callback);
      })
      .catch((error) => {
        console.error(error);
        this._requesting = false;
      });
  } else {
    this._getRandomGIF(callback);
  }
};

G.prototype._getRandomGIF = function (callback) {
  if (!this.data && this.data.data) {
    console.error('No GIFS found :(');
    return;
  }

  const count = this.data.data.length;
  const min = 0;
  const max = count - 1;
  const randIndex = Math.floor(Math.random() * (max - min) + min);
  const result = this.data.data[randIndex];
  const gif = {
    'img': result.images.original.url,
    'url': result.url
  };
  callback(gif);
};

export default G;
