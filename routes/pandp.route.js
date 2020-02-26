const router = require('express').Router();
const cheerio = require("cheerio")
const request = require('request')



const baseURL = 'https://www.complex.com/pigeons-and-planes/';


router.route('/all').get((req, res) => {

    console.log('pandp/all');

    request(baseURL, (err, response, html) => {

      const $ = cheerio.load(html)

      let feed = [];

      $('.mega-feed-item.mega-feed-item--feature').map( (i, node) => {
          let title = node.children[0].attribs['aria-label'];
          // console.log(title);
          let link = node.children[0].attribs['href'];
          debugger;

          let image = node.children[0].children[0].attribs.src;
          // console.log(image);

          feed.push({
            title,
            link,
            image
          })

        });

        res.json(feed);

      })



})

module.exports = router;
