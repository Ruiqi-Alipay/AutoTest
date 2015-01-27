var mongoose = require('mongoose');

var TestScriptSchema = new mongoose.Schema({
  title: String,
  content: String,
  folder: String,
  type: String,
  date: Date,
  count: {type: Number, default: 0}
});

TestScriptSchema.methods.downlaod = function(cb) {
  this.count += 1;
  this.save(cb);
};

mongoose.model('TestScript', TestScriptSchema);