const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// console.log(__dirname);
// console.log(path.join(__dirname, '../public'));

// Creates a new instance of an express application
const app = express();
const port = process.env.PORT || 3000;

// define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location, assigns setting name to value
app.set('view engine', 'hbs');
app.set('views', viewsPath)
hbs.registerPartials(partialsPath);

// customize our server to serve up a folder
app.use(express.static(publicDirectoryPath))

// can send back html, json, or text with res.send()

// pass in object with information that can be used in template
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App', 
        name: 'Mimi Niou',
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About', 
        name: 'Mimi Niou',
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: "Help page message",
        name: 'Mimi Niou',
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }

            return res.send({
                forecast: forecastData,
                location,
                address: req.query.address,
            });

        })
    });
})

// how to get query values from the request
// app.get('/products', (req, res) => {
//     if (!req.query.search) {
//         return res.send({
//             error: 'You must provide a search term.',
//         })
//     }
//     console.log(req.query);
//     res.send({
//         products: {},
//     })
// })

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help 404',
        message: 'Help article not found.',
        name: 'Mimi Niou',
    });
})

// Match anything that hasn't been matched so far
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        message: 'Page not found.',
        name: 'Mimi Niou',
    });
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});