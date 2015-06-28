config = {}

var getOrDie = function(varName) {
    var variable = process.env[varName];
    if (!variable) {
        throw "You are missing the " + varName + " environment variable.";
    } else {
        return variable;
    }
}

function Puzzle(urlGenerationFunction, verifierFunction) {
    return {
      generateUrl: urlGenerationFunction,
      verifierFunction: verifierFunction
    }
}

config.githubClientId = getOrDie("GITHUB_CLIENT_ID");
config.githubClientSecret = getOrDie("GITHUB_CLIENT_SECRET");
config.publicHostUrl = getOrDie("PUBLIC_HOST_URL");

// Github usernames - feel free to add yourself
config.admins = [ "katexyu",
                  "anishathalye",
                  "kimberli",
                  "vervious",
                  "Detry322",
                  "lzhang124",
                  "ehzhang",
                  "jenniferjzhang",
                  "zareenc" ];

config.puzzles = [ Puzzle(function(username){ return "https://hackmit.org";}, function(guess){ return guess == "answer"; }),
                   Puzzle(function(username){ return "https://hackmit.org";}, function(guess){ return guess == "answer"; }),
                   Puzzle(function(username){ return "https://hackmit.org";}, function(guess){ return guess == "answer"; }),
                   Puzzle(function(username){ return "https://hackmit.org";}, function(guess){ return guess == "answer"; }),
                   Puzzle(function(username){ return "https://hackmit.org";}, function(guess){ return guess == "answer"; }),
                   Puzzle(function(username){ return "https://hackmit.org";}, function(guess){ return guess == "answer"; }) ];

module.exports = config;