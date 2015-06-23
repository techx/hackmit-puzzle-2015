var mongoose = require('mongoose');

//log submissions
var submissionSchema = new mongoose.Schema({
    user: { type: 'String', required: true },
    puzzleNumber: { type: 'Number', required: true},
    timestamp: { type: 'Date', required: true, default: Date.now },
    guess: { type: 'String', required: true },
    isCorrect: { type: 'Boolean', required: true}
});

module.exports = mongoose.model('Submission', submissionSchema);

