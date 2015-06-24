var mongoose = require('mongoose');
var PuzzleController = {}

PuzzleController.createNew = function(req, res){
    mongoose.model('PuzzlePart').count({user: req.user._id}, function(err, count){
        if (err){
            res.status(500).send(err);
        } else if (count != 0){
            res.status(200).send({})
        } else {
            mongoose.model('PuzzlePart').create({ user: req.user._id, number: 1, }, function(err, puzzlePart){
                if (err){
                    res.status(500).send(err);
                } else {
                    res.status(201).send({});
                }
            });
        }
    });
}

module.exports = PuzzleController;