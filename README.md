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

* get api/members loading from db (DONE)
* load test
* slave db following
* put main site behind fastly
* add main site to alert
* add dns
* send email (DONE)

## Partylines

* breakdown tables even further
* fix "lie"??
* compress /api/hansards to get it into a get
* only return snippets from server
