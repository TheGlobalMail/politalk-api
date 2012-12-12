begin;
DROP TABLE IF EXISTS summaries;
CREATE TABLE summaries (
  time timestamp DEFAULT NULL,
  keywords text DEFAULT NULL,
  members text DEFAULT NULL,
  dates text DEFAULT NULL,
  version integer
);
commit;
