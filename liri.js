// Import node modules
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var inquirer = require('inquirer');
var clear = require('clear');
var figlet = require('figlet');
var chalk = require('chalk');

// Import Twitter API secrets from keys.js
var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

// Initial question.
var mainQuestion = {
    type: 'list',
    name: 'command',
    message: 'What would you like me to do?',
    choices: [
        {
            name: 'My Tweets',
            value: 'my-tweets'
        },
        {
            name: 'Spotify this Song',
            value: 'spotify-this-song'
        },
        {
            name: 'Movie This',
            value: 'movie-this'
        },
        {
            name: 'Do What It Says',
            value: 'do-what-it-says'
        }
    ]
};

// Spotify search term.
var spotifyFollowUp = [
    {
        type: 'input',
        name: 'song',
        message: 'What song would you like me to tell you about?'
    },
    {
        type: 'input',
        name: 'artist',
        message: 'Optional: What is the song\'s artist?',
        when: function(answers) {return answers.song.length > 0}
    }
];

// OMDB search term.
var movieFollowUp = [
    {
        type: 'input',
        name: 'movie',
        message: 'What movie would you like me to tell you about?'
    }
];

// Callable inquirer prompt for follow-up questions.
var followUpQuestion = function (type) {
    inquirer.prompt(type).then(
        function (answers) {
            switch (type[0].name) {
                case 'twitterUsername':
                    twitterCall(answers);
                    break;
                case 'song':
                    spotifyCall(answers);
                    break;
                case 'movie':
                    omdbCall(answers);
                    break;
            }
        }
    )
};

// Reads 'random.txt'
// TODO: Make it actually do the contents of random.txt.
var doWhatItSays = function () {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.split(',');
        data = {
            command: data[0],
            query: data[1]
        };
        processInitialAnswer(data);
    });
};

// Clear the terminal.
clear();
console.log(
    chalk.cyan(
        figlet.textSync('liri', { horizontalLayout: 'full' })
    )
);

var processInitialAnswer = function(answers) {
    switch (answers.command) {
        case 'my-tweets':
            twitterCall();
            break;
        case 'spotify-this-song':
            if (!answers.query) {
                followUpQuestion(spotifyFollowUp);
            } else {
                answers.song = answers.query;
                answers.artist = '';
                spotifyCall(answers);
            }
            break;
        case 'movie-this':
            if (!answers.query) {
                followUpQuestion(movieFollowUp);
            } else {
                answers.movie = answers.query;
                omdbCall(answers);
            }
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
    }
};

// Initial question inquirer prompt.
inquirer.prompt(mainQuestion).then(processInitialAnswer);

var omdbCall = function (answers) {
    if (answers.movie.length === 0) {
        answers.movie = 'Mr. Nobody';
    }
    request('http://www.omdbapi.com/?t=' + answers.movie + '&y=&plot=short&r=json&tomatoes=true', function (error, response) {
        var body = JSON.parse(response.body);
        if (!error && response.statusCode == 200 && body.Error === undefined) {
            console.log(chalk.yellow('Results:'));
            console.log('  Title: ' + body.Title);
            console.log('  Release Year: ' + body.Year);
            console.log('  IMDB Rating: ' + body.imdbRating);
            console.log('  Country: ' + body.Country);
            console.log('  Language: ' + body.Language);
            console.log('  Actors: ' + body.Actors);
            console.log('  Rotten Tomatoes Rating: ' + body.tomatoRating);
            console.log('  Rotten Tomatoes URL: ' + body.tomatoURL);
        } else {
            console.log('Sorry, an error occurred. Please check your query and try again.');
        }
    })
};

var spotifyCall = function (answers) {
    if (answers.song.length === 0) {
        answers.song = 'The Sign';
        answers.artist = 'Ace of Base';
    }

    if (answers.artist.length > 0) {
        spotify.get('https://api.spotify.com/v1/search?q=track:' + answers.song + ' artist:' + answers.artist + '&type=track', displaySpotifyResults);
    } else {
        spotify.get('https://api.spotify.com/v1/search?q=track:' + answers.song + '&type=track', displaySpotifyResults);
    }
};

var displaySpotifyResults = function(err, data) {
    if (err) {
        return console.log('Sorry, an error occurred. Please check your query and try again.');
    }
    console.log(chalk.yellow('Results:'));
    console.log('  Artist: ' + data.tracks.items[0].artists[0].name);
    console.log('  Track Name: ' + data.tracks.items[0].name);
    console.log('  Song preview: ' + data.tracks.items[0].preview_url);
    console.log('  Album: ' + data.tracks.items[0].album.name);
};


var twitterCall = function (answers) {
    console.log(answers);
};