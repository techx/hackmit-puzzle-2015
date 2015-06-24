var mongoose = require('mongoose');
var UserController = {}

UserController.getPuzzleStatus = function(req, res) {
    mongoose.model('User').findById(req.user._id, function(err, user){
        if (err) {
            res.status(500).send(err);
        } else if (!user) {
            res.status(404).send({'error': 'This user does not exist.'});
        } else {
            user.getPuzzleParts(function(err, puzzleParts){
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.render('main', { puzzleParts: puzzleParts,
                                        currentUser: req.user.githubUsername });
                }
            });
        }
    });
}



module.exports = UserController;