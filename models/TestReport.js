var mongoose = require('mongoose');

var TestReportSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  count: {type: Number, default: 0}
});

TestReportSchema.methods.downlaod = function(cb) {
  this.count += 1;
  this.save(cb);
};

mongoose.model('TestReport', TestReportSchema);