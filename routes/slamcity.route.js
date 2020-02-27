const router = require('express').Router();
const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();

const cheerio = require("cheerio")


const baseURL = 'https://blog.slamcity.com/'

//route Get /slamcity/all
//desc default gets all news
//acess public
router.route('/all').get( (req, res) => {

    console.log('slamcity/all');

    const endpoint = 'feed'

// rss-parser
    parser.parseURL(`${baseURL}${endpoint}`)
      .then( response => {
          // console.log(response.items);

          const results = response.items


          let feed = []

          results.forEach( result => {

              let htmlContent= result['content:encoded'];
              let $ = cheerio.load(htmlContent);
              //regex to split if multiple images
              // let img = $.html('img').split(/(?=<)/g)
              // let img = $.html('img').match(/<img.*?src="(.*?)"/g)
              let img = $('img').attr('src');
              // let img = $.html('img')
              // console.log('IMG src', img);




              // let p = $.html('p') //pulls out the raw html full paragraph
              // console.log(img);

              //create placeholder image
              img = img ? img : 'No Image';
              // ...img, //this in the object

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


//route Get /slamcity/interviews
//desc default gets all interviews
//acess public
router.route('/interviews').get( (req, res) => {

    console.log('slamcity/all');

    const endpoint = 'category/interviews/feed/'

// rss-parser
    parser.parseURL(`${baseURL}${endpoint}`)
      .then( response => {
          // console.log(response.items);

          const results = response.items


          let feed = []

          results.forEach( result => {

              let htmlContent= result['content:encoded'];
              let $ = cheerio.load(htmlContent);

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
