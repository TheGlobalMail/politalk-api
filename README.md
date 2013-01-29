# Politalk API

There are currently three endpoints: 

* `/api/members`
* `/api/keywords`
* `/api/dates`

The api supports CORS. We might add JSONp at some point.

## Deploy

`heroku deploy`

Call to view various configuration variables `heroku config`.

## Downloading new data

At 10am every day, `download.js` is run to check for new hansard data.

## Word Choices API

* add /api/weeks to cache
* make sure common words don't return ridiculous results
* look at other stemmers that are less agressive
* add cache layer or use fastly?
* add app cache
  * that can be rebuilt offline
* log all requests and time
* load test

## Done

* Release:
  * test on IE before releasing
* add loading of snippets to mockup

## Cache

* upsert term request with counter
  * can be used as stats
* recalculation
  * stream
    * look at only the top 400 ordered by requests?
    * loop over each and call for term and store results
