//need express router
const router = require('express').Router();
// require the mongoose model
let User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const axios = require('axios');

require('dotenv').config();
const auth = require('../middleware/auth');

const baseURL = 'https://api.nytimes.com/svc/news/v3/content/';
const apiKey = process.env.NY_TIMES;



//route Get /nytimes/all
//desc default gets all news
//acess public
router.route('/all').get((req, res) => {

  console.log('nyt/all');

  const endpoint = 'all/all.json'
  console.log(`${baseURL}${endpoint}${apiKey}`);


  axios.get( `${baseURL}${endpoint}${apiKey}`)
    .then( response => {
      let results = response.data.results

      let feed = [];

      results.forEach( result => {

        //check multimedia not null
        //and get the medium sized thumbnail
        if (result.multimedia) {

          for (let i = 0; i < result.multimedia.length; i++) {

            if (result.multimedia[i].format === "mediumThreeByTwo440") {

              feed.push({
                title: result.title,
                content: result.abstract,
                category: result.section,
                image: result.multimedia[i].url,
                link: result.url
              })

            }
          };

        }
      }); //forEach

      res.json(feed)
    })
    .catch( err => console.log(err))

}); //get


//route Get /nytimes/tech
//desc gets tech news
//acess public
router.route('/tech').get((req, res) => {
  console.log('/tech');

  const endpoint = 'all/technology.json'

  axios.get( `${baseURL}${endpoint}${apiKey}`)
    .then( response => {
      console.log(response.data.results);
      let results = response.data.results

      let feed = [];

        results.forEach( result => {


          //check multimedia not null
          //and get the medium sized thumbnail
          if (result.multimedia) {

            for (let i = 0; i < result.multimedia.length; i++) {

              if (result.multimedia[i].format === "mediumThreeByTwo440") {

                feed.push({
                  title: result.title,
                  content: result.abstract,
                  category: result.section,
                  image: result.multimedia[i].url,
                  link: result.url
                })

              }
            };

          }
        }); //forEach

      res.json(feed)
    })
    .catch( err => console.log(err))
}); //get

//route Get /nytimes/magazins
//desc gets magazine
//acess public
router.route('/magazine').get((req, res) => {
  console.log('/magazine');

  const endpoint = 'all/magazine.json'

  axios.get( `${baseURL}${endpoint}${apiKey}`)
    .then( response => {
      console.log(response.data.results);
      let results = response.data.results

      let feed = [];

        results.forEach( result => {


          //check multimedia not null
          //and get the medium sized thumbnail
          if (result.multimedia) {

            for (let i = 0; i < result.multimedia.length; i++) {

              if (result.multimedia[i].format === "mediumThreeByTwo440") {

                feed.push({
                  title: result.title,
                  content: result.abstract,
                  category: result.section,
                  image: result.multimedia[i].url,
                  link: result.url
                })

              }
            };

          }
        }); //forEach

      res.json(feed)
    })
    .catch( err => console.log(err))
}); //get

//route Get /nytimes/business
//desc gets magazine
//acess public
router.route('/business').get((req, res) => {
  console.log('/business');

  const endpoint = 'all/business.json'

  axios.get( `${baseURL}${endpoint}${apiKey}`)
    .then( response => {
      console.log(response.data.results);
      let results = response.data.results

      let feed = [];

        results.forEach( result => {


          //check multimedia not null
          //and get the medium sized thumbnail
          if (result.multimedia) {

            for (let i = 0; i < result.multimedia.length; i++) {

              if (result.multimedia[i].format === "mediumThreeByTwo440") {

                feed.push({
                  title: result.title,
                  content: result.abstract,
                  category: result.section,
                  image: result.multimedia[i].url,
                  link: result.url
                })

              }
            };

          }
        }); //forEach

      res.json(feed)
    })
    .catch( err => console.log(err))
}); //get

module.exports = router;
