begin;

DROP TABLE IF EXISTS phrases_summaries;
CREATE TABLE phrases_summaries (
  text varchar(200) NOT NULL,
  stem varchar(200),
  date date NOT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_summaries(text, stem, date, frequency, words) select text, stem, phrases.date, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, text, stem having sum(frequency) > 10;

create index ps_text_idx on phrases_summaries (text);
create index ps_stem_idx on phrases_summaries (stem);
create index ps_date_idx on phrases_summaries (date);

DROP TABLE IF EXISTS phrases_houses_summaries;
CREATE TABLE phrases_houses_summaries (
  text varchar(200) NOT NULL,
  stem varchar(200),
  date date NOT NULL,
  house integer DEFAULT NULL,
  party varchar(100) DEFAULT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_houses_summaries(text, stem, date, house, party, frequency, words) select text, stem, phrases.date, house, member.party, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, house, member.party, text, stem having sum(frequency) > 2;

create index phs_text_idx on phrases_houses_summaries (text);
create index phs_stem_idx on phrases_houses_summaries (stem);
create index phs_house on phrases_houses_summaries (house);
create index phs_party on phrases_houses_summaries (party);
create index phs_date_idx on phrases_houses_summaries (date);

DROP TABLE IF EXISTS phrases_speaker_ids_summaries;
CREATE TABLE phrases_speaker_ids_summaries (
  text varchar(200) NOT NULL,
  stem varchar(200),
  date date NOT NULL,
  speaker_id integer DEFAULT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_speaker_ids_summaries(text, stem, date, speaker_id, frequency, words) select text, stem, phrases.date, speaker_id, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, speaker_id, text, stem having sum(frequency) > 2;

create index pss_text_idx on phrases_speaker_ids_summaries (text);
create index pss_stem_idx on phrases_speaker_ids_summaries (stem);
create index pss_speaker_id on phrases_speaker_ids_summaries (speaker_id);
create index pss_date_idx on phrases_speaker_ids_summaries (date);

DROP TABLE IF EXISTS phrases_person_ids_summaries;
CREATE TABLE phrases_person_ids_summaries (
  text varchar(200) NOT NULL,
  stem varchar(200),
  date date NOT NULL,
  person_id integer DEFAULT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_person_ids_summaries(text, stem, date, person_id, frequency, words) select text, stem, phrases.date, member.person_id, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, member.person_id, text, stem having sum(frequency) > 2;

create index pps_text_idx on phrases_person_ids_summaries (text);
create index pps_stem_idx on phrases_person_ids_summaries (stem);
create index pps_person_id on phrases_person_ids_summaries (person_id);
create index pps_date_idx on phrases_person_ids_summaries (date);

commit;
