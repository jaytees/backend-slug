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
    thumbnail: {
      type: String,
      require: false
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

// thumbnail: {
//   type: String,
//   required: false
// },

  // {
  //   "outlet_name": "Pigeons and Planes",
  //   "outlet_route": "http://localhost:5000/pandp/",
  //   "thumbnail": "https://pbs.twimg.com/profile_images/755417835191623680/PEEosNS5_400x400.jpg",
  //   "categories": [{
  //     "category_name": "All",
  //     "category_url": "http://localhost:5000/pandp/all"
  //     }]
  //   }
