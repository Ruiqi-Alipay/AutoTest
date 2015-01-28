var mongoose = require('mongoose');

var TestAppSchema = new mongoose.Schema({
  name: String,
  path: String,
  description: String
});

mongoose.model('TestApp', TestAppSchema);