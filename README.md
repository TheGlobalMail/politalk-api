# Politalk API

Provides the following endpoints:

* `/api/members`
* `/api/keywords`
* `/api/dates`
* `/api/wordchoices/term/:term`
* `/api/hansards`

The api supports CORS. We might add JSONp at some point.

## Deploy

`heroku deploy`

Call to view various configuration variables `heroku config`.

## Downloading new data

At 10am every day, `download.js` is run to check for new hansard data.

## TODO before launch

* look at other stemmers that are less agressive
* load test
* yaxis
* host partylines on cdn
* run 2012-11-29
* host bubleheads on cdn
* up the dynos for launch
