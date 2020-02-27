const router = require('express').Router();
const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();

const cheerio = require("cheerio")


const baseURL = 'https://www.highsnobiety.com/'

//route Get /hs/all
//desc default gets all news
//acess public
router.route('/all').get( (req, res) => {

    console.log('hs/all');

    const endpoint = 'feed'

// rss-parser
    parser.parseURL(`${baseURL}${endpoint}`)
      .then( response => {
          // console.log(response);

          const results = response.items


          let feed = []

          results.forEach( result => {

              let htmlContent= result['content:encoded'];
              let $ = cheerio.load(htmlContent);
              //regex to split if multiple images
              let img = $('img').attr('src');

              // console.log(img);

              //create placeholder image
              img = img ? img : 'No Image';


              feed.push({
                    title: result.title,
                    content: result.contentSnippet,
                    image: img,
                    category: result.categories[0],
                    link: result.link
                  })



            });

          res.json(feed)
        })
      .catch( err => console.log(err))


} ); // get

//route Get /hs/footwear
//desc gets footwear
//acess public
router.route('/footwear').get( (req, res) => {

    console.log('hs/footwear');

    const endpoint = 'category/footwear/feed'

// rss-parser
    parser.parseURL(`${baseURL}${endpoint}`)
      .then( response => {
          // console.log(response);

          const results = response.items


          let feed = []

          results.forEach( result => {

              let htmlContent= result['content:encoded'];
              let $ = cheerio.load(htmlContent);
              //regex to split if multiple images
              let img = $('img').attr('src');

              // console.log(img);

              //create placeholder image
              img = img ? img : 'No Image';


              feed.push({
                    title: result.title,
                    content: result.contentSnippet,
                    image: img,
                    category: result.categories[0],
                    link: result.link
                  })



            });

          res.json(feed)
        })
      .catch( err => console.log(err))


} ); // get

//route Get /hs/style
//desc gets style
//acess public
router.route('/style').get( (req, res) => {

    console.log('hs/footwear');

    const endpoint = 'category/style/feed/'

// rss-parser
    parser.parseURL(`${baseURL}${endpoint}`)
      .then( response => {
          // console.log(response);

          const results = response.items


          let feed = []

          results.forEach( result => {

              let htmlContent= result['content:encoded'];
              let $ = cheerio.load(htmlContent);
              //regex to split if multiple images
              let img = $('img').attr('src');


              //create placeholder image
              img = img ? img : 'No Image';


              feed.push({
                    title: result.title,
                    content: result.contentSnippet,
                    image: img,
                    category: result.categories[0],
                    link: result.link
                  })



            });

          res.json(feed)
        })
      .catch( err => console.log(err))


} ); // get



module.exports = router;
