const mongoose = require("mongoose");

const GroupsSchema = new mongoose.Schema({
  groupName: {
    type: String,
    unique: true,
    required: true,
  },
  participants: {
    type: [String],
    default: [],
    validate: {
      validator: function (value) {
        return new Set(value).size === value.length;
      },
      message: "Duplicate participant.",
    },
  },
});

const Groups = mongoose.model("Groups", GroupsSchema);

module.exports = Groups;
