const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outletSchema = new Schema({
    outlet_name: {
      type: String,
      required: true,
      unique: true,
    },
    outlet_route: {
      type: String,
      required: true,
      unique: true
    },
    categories: [{
        category_name: {
          type: String,
          required: false
        },
        category_url: {
          type: String,
          required: false
        }
      }]
})

const Outlet = mongoose.model('Outlet', outletSchema);

module.exports = Outlet;
