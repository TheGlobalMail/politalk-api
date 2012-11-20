# Politalk API

There are currently two endpoints: `/api/members` and `/api/keywords`. Both
accept `from` and `to` parameters in the format `2012-10-01`. The default date
range is from 3 month ago to today.

The api supports CORS. We might add JSONp at some point.


## Todo

* get old data
* integration tests
* pull down members
* do olap for sparklines 

## Todd process

* Get list of xml files available
  * emits data: date and url
* Download an xml file
  * emits data: date and xml
* Parse xml file into objects with default attributes
  * emits data: list of objects
* Extra metadata
  * emits data: as list of objects
* Split data
  * emits data as objects
* Save data
  * save the data to the database
