var mongoose = require('mongoose');

var ScriptParameterSchema = new mongoose.Schema({
  name: String,
  value: String
});

mongoose.model('ScriptParameter', ScriptParameterSchema);