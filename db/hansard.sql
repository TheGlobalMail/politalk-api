DROP TABLE IF EXISTS hansards;
CREATE TABLE hansards (
  id varchar(26) DEFAULT NULL PRIMARY KEY,
  html text NOT NULL,
  date date NOT NULL,
  major boolean DEFAULT NULL,
  minor boolean DEFAULT NULL,
  major_id char(26) DEFAULT NULL,
  minor_id char(26) DEFAULT NULL,
  speaker varchar(100) DEFAULT NULL,
  speaker_id integer DEFAULT NULL,
  words integer DEFAULT NULL
);
CREATE INDEX date_idx ON hansards (date);
