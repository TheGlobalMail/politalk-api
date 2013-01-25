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
* add new hansards to `wordchoice_tokens`
* run analyze at the end of import
* add no analyze when importing
* add caseinsensitive search to exact match
* look at other stemmers that are less agressive
* add cache layer or use fastly?
