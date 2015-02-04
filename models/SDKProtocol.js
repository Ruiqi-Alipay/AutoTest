var mongoose = require('mongoose');

var SDKProtocolSchema = new mongoose.Schema({
  content: String
});

mongoose.model('SDKProtocol', SDKProtocolSchema);