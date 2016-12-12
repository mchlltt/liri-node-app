// Import node modules
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var inquirer = require('inquirer');
var preferences = require('preferences');
var clear = require('clear');

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

// Validation for required questions.
var requiredQuestion = function (answer) {
    if (answer.length) {
        return true;
    } else {
        return 'This question is required.';
    }
};

var twitterLoginNeeded = function () {
    return true;
    // true unless we a login saved.
    // also true if the login fails.
};

// Twitter authentication.
// Add in logic for whether these questions actually get asked.
var twitterFollowUp = [
    {
        type: 'input',
        name: 'twitterUsername',
        message: 'What is your Twitter username?',
        validate: requiredQuestion,
        when: twitterLoginNeeded
    },
    {
        type: 'password',
        name: 'twitterPassword',
        message: 'What is your Twitter password?',
        validate: requiredQuestion,
        when: twitterLoginNeeded
    },
    {
        type: 'confirm',
        name: 'saveTwitterLogin',
        message: 'Remember this login for future use?',
        default: false,
        when: twitterLoginNeeded
    }
];

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
        console.log(data);
    });
};

// Clear the terminal.
clear();

// Initial question inquirer prompt.
inquirer.prompt(mainQuestion).then(
    function (answers) {
        switch (answers.command) {
            case 'my-tweets':
                followUpQuestion(twitterFollowUp);
                break;
            case 'spotify-this-song':
                followUpQuestion(spotifyFollowUp);
                break;
            case 'movie-this':
                followUpQuestion(movieFollowUp);
                break;
            case 'do-what-it-says':
                doWhatItSays();
                break;
        }
    }
);

var omdbCall = function (answers) {
    if (answers.movie.length === 0) {
        answers.movie = 'Mr. Nobody';
    }
    request('http://www.omdbapi.com/?t=' + answers.movie + '&y=&plot=short&r=json&tomatoes=true', function (error, response) {
        var body = JSON.parse(response.body);
        if (!error && response.statusCode == 200 && body.Error === undefined) {
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
    console.log('  Artist: ' + data.tracks.items[0].artists[0].name);
    console.log('  Track Name: ' + data.tracks.items[0].name);
    console.log('  Song preview: ' + data.tracks.items[0].preview_url);
    console.log('  Album: ' + data.tracks.items[0].album.name);
};


var twitterCall = function (answers) {
    console.log(answers);
};