const express = require('express');
const hbs = require('hbs'); //hbs is handlebars view engine template
const fs = require('fs');

const port = process.env.PORT || 3000;  //for heroku
var app = express();

hbs.registerPartials(__dirname + '/views/partials');    //partials are like master pages
app.set('view engine', 'hbs');

//express middleware
//app.use(express.static(__dirname + '/public')); //express.static takes the absolute path to the page we want to serve up

app.use((request, response, next) => {  //next exists so you can tell express when your middleware function is done

    var now = new Date().toString();
    var log = `${now}: ${request.method} ${request.url}`;
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// app.use((request,response,next) => {
//     response.render('maintenance.hbs'); 
// });

app.use(express.static(__dirname + '/public'));

//parameters: 1. name of the helper, 2. the funciton to run
hbs.registerHelper(`getCurrentYear`, () => {
    return new Date().getFullYear();
});

hbs.registerHelper(`screamIt`, (text) => {
    return text.toUpperCase();
});

//first parameter takes root of website, second parameter takes a function of what to send back to user
app.get('/', (request, response) => {
    response.render('home.hbs', {   //render checks for templates you have made, in this case about.hbs and home.hbs
        pageTitle: 'Home page',
        welcomeMsg: 'Welcome to this page.',
        //currentYear: new Date().getFullYear(),
    });
});

app.get('/projects', (request, response) => {
    response.render('projects.hbs', {   //render checks for templates you have made, in this case about.hbs and home.hbs
        pageTitle: 'Home page',
        //welcomeMsg: 'Welcome to this page.',
        //currentYear: new Date().getFullYear(),
    });
});

app.get('/about', (request, response) => {
    //response.send('About Page.');   //sent html through the send function
    response.render('about.hbs', {
        pageTitle: 'About page',
        //currentYear: new Date().getFullYear(),
    });
});

app.get('/bad', (request, response) => {
    response.send({
        errorMessage: 'Error could not be handled!',
    });
});

app.listen(port, () => {
    console.log(`Server is up at port ${port}.`)
});