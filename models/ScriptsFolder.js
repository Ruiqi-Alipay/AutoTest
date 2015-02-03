var mongoose = require('mongoose');

var ScriptsFolderSchema = new mongoose.Schema({
  title: String,
});

mongoose.model('ScriptsFolder', ScriptsFolderSchema);