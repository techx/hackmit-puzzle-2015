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

function check(answer) {
    return function(guess) {
        return guess.replace(' ', '') === answer.replace(' ', '');
    };
}

config.puzzles = [
    /* puzzle 1 - slack */
    Puzzle(function(username) { return "http://0xd09ec0de.dogemit.party";}, function(guess){ return guess == "amaze robot"; }),
    /* puzzle 2 - origami */
    Puzzle(function(username){ return "https://hackmit.org";}, function(guess){ return guess == "answer"; }),
    /* puzzle 3 - qr */
    Puzzle(function(username){ return "https://hackmit.org";}, function(guess, username){ return guess == "answer"; }),
    /* puzzle 4 - audio */
    Puzzle(function(username){ return "http://0xff7d09e.dogemit.party";}, function(guess){ return guess == "such hertz"; }),
    /* puzzle 5 - maze */
    Puzzle(function(){ return "http://0xd09eeffec7.dogemit.party";}, check('much snarl')),
    /* puzzle 6 - stronghold */
    Puzzle(function(username){ return "http://0xd09e5ec.dogemit.party";}, check('amaze algorithm')),
];

module.exports = config;
