DROP TABLE IF EXISTS hansards;
CREATE TABLE hansards (
  id varchar(26) DEFAULT NULL PRIMARY KEY,
  html text NOT NULL,
  date date NOT NULL,
  major boolean DEFAULT NULL,
  minor boolean DEFAULT NULL,
  major_id varchar(26) DEFAULT NULL,
  minor_id varchar(26) DEFAULT NULL,
  speaker varchar(100) DEFAULT NULL,
  speaker_id integer DEFAULT NULL,
  time timestamp DEFAULT NULL,
  time_of_day varchar(5) DEFAULT NULL,
  duration integer DEFAULT 0,
  talktype varchar(50) DEFAULT NULL,
  words integer DEFAULT NULL
);
CREATE INDEX date_idx ON hansards (date);
CREATE INDEX speaker_idx ON hansards (speaker_id);

DROP TABLE IF EXISTS phrases;
CREATE TABLE phrases (
  hansard_id varchar(26) DEFAULT NULL,
  text varchar(200) NOT NULL,
  frequency integer DEFAULT 0,
  date date NOT NULL
);
CREATE INDEX hansard_idx ON phrases (hansard_id);
CREATE INDEX datex ON phrases (date);
create index text_idx on phrases (text);
