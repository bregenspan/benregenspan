/*global define*/

define(['lib/xdr'], function(xdr) {
    'use strict';

    var G = function (apiKey) {
        this.apiKey = apiKey;
    };

    G.prototype.getRandomMrDiv = function (callback) {
        var client = this;
        if (this._requesting) {
            return false;
        }
        if (!this.data) {
            var ENDPOINT = 'http://api.giphy.com/v1/gifs/artists?api_key=' + this.apiKey + '&username=mrdiv&limit=100';
            this._requesting = true;
            xdr(ENDPOINT, 'GET', null, function (response) {
                client.data = JSON.parse(response);
                client._requesting = false;
                client._getRandomGIF(callback);
            }, function () {
                client._requesting = false;   
            });
        } else {
            client._getRandomGIF(callback);
        }
    };

    G.prototype._getRandomGIF = function (callback) {
        if (!this.data && this.data.data) {
            console.error('No GIFS found :(');
            return;
        }

        var count = this.data.data.length;
        var min = 0,
            max = count - 1,
            randIndex = Math.floor(Math.random() * (max - min) + min);
        var gif = this.data.data[randIndex].images.original.url;
        callback(gif);
    };

    return G;

});
