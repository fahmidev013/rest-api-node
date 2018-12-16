const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// {
//   "name": "Peter Pan",
//   "image": "images/alberto.png",
//   "designation": "Chief Epicurious Officer",
//   "abbr": "CEO",
//   "description": "Our CEO, Peter, . . .",
//   "featured": false
// }

var leadersSchema = new Schema({
  name: {
      type: String,
      required: true,
      unique: true
  },
  image: {
      type: String,
      required: true
  },
  designation: {
      type: String,
      default: ''
  },
  abbr: {
      type: String,
      default: ''
  },
  description: {
    type: String,
    default: ''
  },
  featured: {
      type: Boolean,
      default:false      
  }
}, {
  timestamps: true
});

var Leaders = mongoose.model('Leader', leadersSchema);

module.exports = Leaders;