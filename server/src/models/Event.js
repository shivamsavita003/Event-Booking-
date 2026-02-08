const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  total_seats: {
    type: Number,
    required: true,
    min: 1
  },
  available_seats: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  img: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  }
}, {
  timestamps: true
});

// Index for search and filter
eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ date: 1 });
eventSchema.index({ location: 1 });

module.exports = mongoose.model('Event', eventSchema);