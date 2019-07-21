const request = require('request');

const forecast = (lat, long, callback) => {
    const url = 'https://api.darksky.net/forecast/bfb1afe8343153a49e37c3e2776e5258/' + lat + ',' + long + '?lang=en';
    
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback("Unable to connect to weather service.");
        } else if (body.error) {
            callback('Error: ' + body.error);
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out. The high today is ' + body.daily.data[0].temperatureMax + ' degrees and the low is ' + body.daily.data[0].temperatureMin + ' degrees. There is a ' + body.currently.precipProbability + '% chance of rain.')
        }
    });
};

module.exports = forecast;