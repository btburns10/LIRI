require("dotenv").config();

const keys = require("./keys.js");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");

//set keys
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const apiKey = "trilogy";

const command = process.argv[2];
const argv = process.argv;

switch(command) {
    case "my-tweets":
    tweetThis();
    break;
    case "spotify-this-song":
    spotifyThis();
    break;
    case "movie-this":
    movieThis();
    break;
    case "do-what-it-says":
    doThis();
    break;
    default: 
    console.log("not a command. please enter 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'");
}

//---------------------------------------------------Functions--------------------------------------------------->>

function tweetThis() {
    client.get('statuses/user_timeline', function(error, tweets, response) {
        if(!error) {
            for(let tweet of tweets) {
                console.log(tweet.text);
                console.log(tweet.created_at);
                console.log(tweet.user.screen_name);
              }
          
        }
        else {
            console.log(error);
        }
    });
}

function spotifyThis() {
    var query = ""
    var newQuery = query ? query : "purple rain"

    for(var i = 3; i < argv.length; i++) {
        query = query + argv[i];
    }

    spotify.search({ type: 'track', query: newQuery }, function(error, data) {
        if (!error) {
          var track = (data.tracks.items[0]);
          console.log("Song Title: " + track.name);
          console.log("Artist: " + track.artists[0].name);
          console.log("Listen: " + track.external_urls.spotify);
        }
        else {
            console.log(error);
        }
    })
}

function movieThis() {
    var movie = "";
    //concatonate movie input
    for(var i = 3; i < argv.length; i++) {
        movie = movie + argv[i];
    }

    const url = "http://www.omdbapi.com/?apikey=" + apiKey + "&t=" + movie;
    console.log(url)
    request(url, function (error, response, body) {
      if(!error && response.statusCode === 200) {
        const movieData = JSON.parse(body);
        console.log("Title: " + movieData.Title);
      } else {
        console.log(error);
      }  
    });
}

function doThis() {
    
}
