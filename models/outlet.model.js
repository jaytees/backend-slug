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


  // {
  //   "outlet_name": "New York Times",
  //   "outlet_route": "http://localhost:5000/nytimes/",
  //   "categories": [{
  //     "category_name": "All",
  //     "category_url": "http://localhost:5000/nytimes/all"
  //     },
  //     {
  //     "category_name": "Tech",
  //     "category_url": "http://localhost:5000/nytimes/tech"
  //     },
  //     {
  //     "category_name": "Magazine",
  //     "category_url": "http://localhost:5000/nytimes/magazine"
  //     },
  //     {
  //     "category_name": "Business",
  //     "category_url": "http://localhost:5000/nytimes/business"
  //     }]
  //   }
