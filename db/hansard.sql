DROP TABLE IF EXISTS hansards;
CREATE TABLE hansards (
  id char(26) DEFAULT NULL PRIMARY KEY,
  html text NOT NULL,
  date date NOT NULL,
  major boolean NOT NULL,
  minor boolean NOT NULL,
  major_id char(26) DEFAULT NULL,
  minor_id char(26) DEFAULT NULL,
  speaker varchar(100) DEFAULT NULL,
  speaker_id integer DEFAULT NULL,
  created date NOT NULL
);
CREATE UNIQUE INDEX date_idx ON hansards (date);
