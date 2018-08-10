require("dotenv").config();
//set npm packages
const keys = require("./keys.js");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");

//set keys
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const apiKey = "trilogy";

//set command line variables
var command = process.argv[2];
var query = "";
const argv = process.argv;

//switch function to execute command line entries
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
                console.log(tweet.text,
                    "\n" + tweet.created_at,
                    "\n" + tweet.user.screen_name);
              }
          
        }
        else {
            console.log(error);
        }
    });
}

function spotifyThis() {
    
    query = argv.slice(3).join(" ");
    var newQuery = query ? query : "purple rain";

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

    query = argv.slice(3).join("+");

    const url = "http://www.omdbapi.com/?apikey=" + apiKey + "&t=" + query;
    
    request(url, function (error, response, body) {
      if(!error && response.statusCode === 200) {
        const movieData = JSON.parse(body);
        
        console.log("Title: " + movieData.Title,
            "\nYear: " + movieData.Year,
            "\nBox Office: " + movieData.BoxOffice,
            "\nIMDB Rating: " + movieData.Ratings[0].Value,
            "\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value,
            "\nCountry: " + movieData.Country,
            "\nLanguage: " + movieData.Language,
            "\nPlot: " + movieData.Plot,
            "\nActors: " + movieData.Actors);
      } else {
        console.log(error);
      }  
    });
}

function doThis() {
    
}
