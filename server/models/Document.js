const mongoose = require("mongoose")

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Document"
  },

  content: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
})

module.exports = mongoose.model("Document", DocumentSchema)