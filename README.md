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

* rickshaw
  * get weeks data
    * use it as index for x dimension

* find fastest query 
  * what are limitations?
  * possibly stem?
* make sure common words don't return ridiculous results
  * limit results?
  * pretest how many hits
* make sure longterm solutions can work


* more thoughts:
  * get off heroku for long queries
  * shard it out

* big query
  * 946629029892

* inverted index
  * perhaps enforce that the first word must not be a stop word (DONE)
    * or at least 'the', 'is', 'once'
  * http://stackoverflow.com/questions/8839117/postgresql-date-query-performance-problems
  * `
    select party,date,count(word1) from wordchoice_tokens where token1
    = 'climat' and token2 = 'chang' group by party,date order by party, date;
    `

* results for:
    * (X) 3 separate queries of: select date, party, sum(CountInString(html, $1))
      as freq, string_agg(id, ',') from hansards where searchable @@
      to_tsquery('''refugee''') group by date, party
      * 2363ms 
    * (?) results from cloudant and then work through them?
      * any faster than postgres?
    * (X) cloudant with facets
      * can match keyword with keyword analyser
      * can't do grouping
    * get matches and run regex in node.js
    * (?) create an index of words and phrases
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
    * (X) elastic search
      * can do phrases and facets
      * CAN'T count frequencies when doing facets (??)
      * http://stackoverflow.com/questions/13217849/elasticsearch-return-term-frequency-of-a-single-field
    * (X) mongo
      * regexs and map reduce are out
      * http://docs.mongodb.org/manual/release-notes/2.4/
        * db.collection.runCommand( "text", { search: "asylum seeker"} )
      * needs latest version + no grouping??
    * xaipan
    * writing it for openau
    * use websockets
      * stream back results
        * get length
        * then work through them
    
* cache results (by complete or by word?)
