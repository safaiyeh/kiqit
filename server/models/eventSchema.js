/**
  Event Schema. Represents an event.
**/
const mongoose = require('mongoose');
const patcher = require('mongoose-json-patch');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  adminid: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});
EventSchema.plugin(patcher);

module.exports = mongoose.model('Event', EventSchema);
