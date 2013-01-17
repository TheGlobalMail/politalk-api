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

* find fastest query 
  * what are limitations?
  * possibly stem?
* make sure party gets in
* make sure common words don't return ridiculous results
* make sure longterm solutions can work
* results for:
    * (X) 3 separate queries of: select date, party, sum(CountInString(html, $1))
      as freq, string_agg(id, ',') from hansards where searchable @@
      to_tsquery('''refugee''') group by date, party
      * 2363ms 
    * results from cloudant and then work through them?
      * any faster than postgres?
    * (?) cloudant with facets
      * can't do proper keyword matching or can it???
      * ask in irc?
    * get matches and run regex in node.js
    * create an index of words and phrases
      * check if phrases we already have are ok
        * don't think they are because we cut them off??
      * table:
        1. stem
          * stem
        2. stems_hansards
          * stem_id
          * hansard_id
          * 4 appearances
          * party
          * date
          * snippet
    * elastic search
      * can do phrases
      * can it do rollups? facets?
      * can you control how much is returned?
    * mongo
      * regexs and map reduce are out
      * http://docs.mongodb.org/manual/release-notes/2.4/
        * db.collection.runCommand( "text", { search: "asylum seeker"} )
    * xaipan
    * writing it for openau
    
* cache results (by complete or by word?)
