DROP TABLE IF EXISTS phrases_months;
CREATE TABLE phrases_months (
  text varchar(200) NOT NULL,
  month date NOT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_months(text, month, frequency, words) select text, to_date(date_part('year', phrases.date) || '-' || date_part('month', phrases.date) || '-01', 'YYYY-MM-DD') as month, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by month, text having sum(frequency) > 10;

create index pm_text_idx on phrases_months (text);
create index pm_date_idx on phrases_months (month);

DROP TABLE IF EXISTS phrases_houses_months;
CREATE TABLE phrases_houses_months (
  text varchar(200) NOT NULL,
  month date NOT NULL,
  house integer DEFAULT NULL,
  party varchar(100) DEFAULT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_houses_months(text, month, house, party, frequency, words) select text, to_date(date_part('year', phrases.date) || '-' || date_part('month', phrases.date) || '-01', 'YYYY-MM-DD') as month, house, party, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by month, house, party, text having sum(frequency) > 10;

create index phm_text_idx on phrases_houses_months (text);
create index phm_house on phrases_houses_months (house);
create index phm_party on phrases_houses_months (party);
create index phm_date_idx on phrases_houses_months (month);

DROP TABLE IF EXISTS phrases_speaker_ids_months;
CREATE TABLE phrases_speaker_ids_months (
  text varchar(200) NOT NULL,
  month date NOT NULL,
  speaker_id integer DEFAULT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_speaker_ids_months(text, month, speaker_id, frequency, words) select text, to_date(date_part('year', phrases.date) || '-' || date_part('month', phrases.date) || '-01', 'YYYY-MM-DD') as month, speaker_id, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by month, speaker_id, text having sum(frequency) > 2;

create index psm_text_idx on phrases_speaker_ids_months (text);
create index psm_speaker_id on phrases_speaker_ids_months (speaker_id);
create index psm_date_idx on phrases_speaker_ids_months (month);
