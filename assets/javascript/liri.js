require("dotenv").config();
//set npm and node packages 
const keys = require("./keys.js");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");

//set keys
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const apiKey = "trilogy";

//set command line variables
var command = process.argv[2];
var query = process.argv[3];
const argv = process.argv;

//switch function to execute command line entries
switch(command) {
    case "my-tweets":
    tweetThis();
    break;
    case "spotify-this-song":
    if(query) {
        search = argv.slice(3).join(" ");
    }else {
        search =  "is this love";
    }
    spotifyThis(search);
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
                //append tweets to 'log.txt' file
                fs.appendFile("../log.txt", tweet.text, function(error) {
                    if(error) {
                        console.log(error);
                    }
                })
            }
        }else {
            console.log(error);
        }
    });
}

function spotifyThis(search) {
    
    spotify.search({ type: 'track', query: search }, function(error, data) {
        if (!error) {
          var track = (data.tracks.items[0]);
          console.log("Song Title: " + track.name);
          console.log("Artist: " + track.artists[0].name);
          console.log("Album: " + track.album.name);
          console.log("Listen: " + track.external_urls.spotify);
          fs.appendFile("../log.txt", track.name + ", ", function(error) {
            if(error) {
                console.log(error);
            }
        })
        }else {
            console.log(error);
        }
    })
}

function movieThis() {
    //concatonate search movie title from command line input
    query = argv.slice(3).join("+");
    var newQuery = query ? query : "Mr. Nobody";

    const url = "http://www.omdbapi.com/?apikey=" + apiKey + "&t=" + newQuery;
    
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
            //append searched movie name to 'log.txt' file
            fs.appendFile("../log.txt", movieData.Title + ", ", function(error) {
                if(error) {
                    console.log(error);
                }
            })
      }else {
        console.log(error);
      }  
    });
}

function doThis() {
    fs.readFile("../random.txt", "utf8", function(error, data) {
        
        if (error) {
          return console.log(error);
        }

        console.log(data);
        var dataArr = data.split(",");
        var input1 = dataArr[0];
        search = dataArr[1];
        if(input1 === "spotify-this-song") {
            spotifyThis(search);
        }
        if(input1 === "my-tweets") {
            tweetThis();
        }
        if(input1 === "movie-this") {
            movieThis(search);
        }
      });
}
