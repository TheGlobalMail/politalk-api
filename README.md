# Politalk API

There are currently two endpoints: `/api/members` and `/api/keywords`. Both
accept `from` and `to` parameters in the format `2012-10-01`. The default date
range is from 3 month ago to today.

The api supports CORS. We might add JSONp at some point.

## Todo

* integration tests
* do olap for sparklines 
