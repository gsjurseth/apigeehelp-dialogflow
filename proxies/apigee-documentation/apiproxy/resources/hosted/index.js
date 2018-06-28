const Promise = require('bluebird'),
			express = require('express'),
      bp      = require('body-parser'),
  		fetch		= require('node-fetch')
      cheerio = require('cheerio');



fetch.Promise = Promise;

const app = express();

const docPoliciesBaseURL = 'https://docs.apigee.com/api-platform/reference/policies';


class DocNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DocNotFoundError';
  }
}

function fetchInfo(policyURL) {
  return fetch(policyURL)
    .then( d => {
      if (d.ok)
        return d;
      else if (d.status == 404) {
        throw new DocNotFoundError(d.statusText);
      }
    })
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
    });
}

app.get('/documentation/:policy', (req,res) =>  {

  let policy = req.params.policy + '-policy';

  fetchInfo(`${docPoliciesBaseURL}/${policy}`)
    .then( d => res.json(d) )
    .catch( DocNotFoundError, e => {
      res.status(404).json(e.toString());
    })
		.catch( e => {
			res.status(500).json({ code: 500, message: "internal error"});
		});
});

// Start the server
const PORT = process.env.PORT || 8080;
module.exports = app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}... Let's do this!`);
	console.log('Press Ctrl+C to quit.');
});
