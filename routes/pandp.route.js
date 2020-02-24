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
          // debugger;

          let image = node.children[0].children[0].attribs.src;
          // console.log(image);

          feed.push({
            title,
            image
          })

        });

        res.json(feed);

      })



})

module.exports = router;



// console.log($('div.mega-feed__header-container').children().first().text());

// console.log($('div.mega-feed').html());



    // let $ = cheerio.load(html);
    // // console.log($);
    //
    //
    // const rawHtml = $('div.mega-feed').html();
    // const handler = new DomHandler(function(error, dom) {
    // if (error) {
    //     // Handle error
    //     console.log(error);
    // } else {
    //     // Parsing completed, do something
    //     // console.log(dom);
    //
    //     for (let i = 0; i < dom.length; i++) {
    //         if (i === 1) {
    //             console.log(dom[i]);
    //
    //             // dom[i].attribs.class === 'mega-feed-item mega-feed-item--feature'
    //         }
    //     };
    //
    // }
    // });
    //
    // const parser = new Parser(handler);
    // parser.write(rawHtml);
    // parser.end();
