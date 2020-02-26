const router = require('express').Router();
let Outlet = require('../models/outlet.model');

router.route('/create').post((req, res) => {

    // console.log(req);

    const { outlet_name, outlet_route, categories } = req.body

    if( !outlet_name || !outlet_route){
      return res.json({ msg: 'Please enter all fields'})
    }

    Outlet.findOne({ outlet_name })
      .then( outlet => {

        if (outlet) {
          return res.json({ msg: 'Outlet already exists'})
        }

        const newOutlet = new Outlet({
          outlet_name,
          outlet_route,
          categories
        })// new outlet

        newOutlet.save()
          .then( resOutlet => {
            res.json(resOutlet);
          })

      })

})

router.route('/index').get(( req, res ) => {

  Outlet.find((err, results ) => {
    res.json(results)
  })

})


module.exports = router;
