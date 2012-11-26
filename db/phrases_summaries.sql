begin;

DROP TABLE IF EXISTS phrases_summaries;
CREATE TABLE phrases_summaries (
  text varchar(200) NOT NULL,
  date date NOT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_summaries(text, date, frequency, words) select text, phrases.date, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, text having sum(frequency) > 10;

create index ps_text_idx on phrases_summaries (text);
create index ps_date_idx on phrases_summaries (date);

DROP TABLE IF EXISTS phrases_houses_summaries;
CREATE TABLE phrases_houses_summaries (
  text varchar(200) NOT NULL,
  date date NOT NULL,
  house integer DEFAULT NULL,
  party varchar(100) DEFAULT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_houses_summaries(text, date, house, party, frequency, words) select text, phrases.date, house, party, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, house, party, text having sum(frequency) > 2;

create index phs_text_idx on phrases_houses_summaries (text);
create index phs_house on phrases_houses_summaries (house);
create index phs_party on phrases_houses_summaries (party);
create index phs_date_idx on phrases_houses_summaries (date);

DROP TABLE IF EXISTS phrases_speaker_ids_summaries;
CREATE TABLE phrases_speaker_ids_summaries (
  text varchar(200) NOT NULL,
  date date NOT NULL,
  speaker_id integer DEFAULT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_speaker_ids_summaries(text, date, speaker_id, frequency, words) select text, phrases.date, speaker_id, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, speaker_id, text having sum(frequency) > 2;

create index pss_text_idx on phrases_speaker_ids_summaries (text);
create index pss_speaker_id on phrases_speaker_ids_summaries (speaker_id);
create index pss_date_idx on phrases_speaker_ids_summaries (date);

commit;
