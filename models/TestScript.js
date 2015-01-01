var mongoose = require('mongoose');

var TestScriptSchema = new mongoose.Schema({
  title: String,
  author: String,
  script: String,
  downlaod: {type: Number, default: 0}
});

TestScriptSchema.methods.downlaod = function(cb) {
  this.downlaod += 1;
  this.save(cb);
};

mongoose.model('TestScript', TestScriptSchema);