const mongoose = require('mongoose');

// define schema for org(name, id) items
const orgSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  id: Number,
  isCompany: Boolean
});

const Org = mongoose.model('Org', orgSchema);

module.exports = Org;