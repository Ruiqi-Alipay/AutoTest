var mongoose = require('mongoose');

var TestScriptFolderSchema = new mongoose.Schema({
  title: String,
});

mongoose.model('TestScriptFolder', TestScriptFolderSchema);