const Promise = require('bluebird'),
			express = require('express'),
      bp      = require('body-parser'),
  		fetch		= require('node-fetch')
      cheerio = require('cheerio');


let payload = require('./payload');

fetch.Promise = Promise;

const app = express();

const docPoliciesBaseURL = 'https://docs.apigee.com/api-platform/reference/policies';

function fetchInfo(policyURL) {
  return fetch(policyURL)
    .then( d => d.text() )
    .then( html => {
      let docstuff = {};
      $ = cheerio.load(html);
      docstuff.title  = $('h1.devsite-page-title').html().trim();
      docstuff.img    = $('div .devsite-article-body img').attr('src').trim();
      if ( $('div .devsite-article-body p img').length  ) {
        docstuff.desc   = $('div .devsite-article-body p').next().next().html().trim();
      }
      else {
        docstuff.desc   = $('div .devsite-article-body p').html().trim();
      }
      docstuff.url   = policyURL;
      return docstuff;
    })
    .catch( e => console.error('We done failed and shit: %s', e.stack)  );
}

function gimmeResponse(d) {
  let responseItems = {
    "items": [
      {
        "simpleResponse": {
          "textToSpeech": `Docuementation for ${d.title}`
        }
      },
      {
        "basicCard": {
          "title": `${d.title}`,
          "formattedText": d.desc,
          "image": {
            "url": d.img,
            "accessibilityText": `${d.title} icon`
          },
          "buttons": [
            {
              "title": `Read more about the ${d.title}`,
              "openUrlAction": {
                "url": d.url
              }
            }
          ]
        }
      }
    ]};
  return responseItems;
}


let jsonBP = bp.json({type: 'application/json'});
app.post('/', jsonBP, (req,res) =>  {

  let policy = req.body.queryResult.parameters['apigee-policy'] + '-policy';

  fetchInfo(`${docPoliciesBaseURL}/${policy}`)
    .then(gimmeResponse)
    .then( d => {
      payload.payload.google.richResponse = d;
      res.json(payload);
    })
});

// Start the server
const PORT = process.env.PORT || 8080;
module.exports = app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}... Let's do this!`);
	console.log('Press Ctrl+C to quit.');
});
