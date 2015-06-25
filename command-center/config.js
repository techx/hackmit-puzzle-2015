config = {}

var getOrDie = function(varName) {
    var variable = process.env[varName];
    if (!variable) {
        throw "You are missing the " + varName + " environment variable.";
    } else {
        return variable;
    }
}

function Puzzle(url, verifierFunction) {
    this.url = url;
    this.verifierFunction = verifierFunction;
    return this;
}

config.githubClientId = getOrDie("GITHUB_CLIENT_ID");
config.githubClientSecret = getOrDie("GITHUB_CLIENT_SECRET");
config.publicHostUrl = getOrDie("PUBLIC_HOST_URL");

config.puzzles = [ Puzzle("url1", function(guess){ return guess == "answer"; }),
                   Puzzle("url2", function(guess){ return guess == "answer"; }),
                   Puzzle("url3", function(guess){ return guess == "answer"; }),
                   Puzzle("url4", function(guess){ return guess == "answer"; }),
                   Puzzle("url5", function(guess){ return guess == "answer"; }),
                   Puzzle("url6", function(guess){ return guess == "answer"; }) ]

module.exports = config;