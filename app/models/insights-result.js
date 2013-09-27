var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InsightsSchema = new Schema( {
    domain: String,
    url: String,
    strategy: String,
    result: Object,
    date: Date
});

mongoose.model('InsightsResult', InsightsSchema);