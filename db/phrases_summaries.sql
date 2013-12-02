begin;

DROP TABLE IF EXISTS phrases_summaries;
CREATE TABLE phrases_summaries (
  text varchar(200) NOT NULL,
  stem varchar(200),
  year integer NOT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_summaries(text, stem, year, frequency, words) select text, stem, extract(year from phrases.date), sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, text, stem;

create index ps_text_idx on phrases_summaries (text);
create index ps_stem_idx on phrases_summaries (stem);
create index ps_year_idx on phrases_summaries (year);

DROP TABLE IF EXISTS phrases_party_summaries;
CREATE TABLE phrases_party_summaries (
  text varchar(200) NOT NULL,
  stem varchar(200),
  year integer NOT NULL,
  party varchar(100) DEFAULT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_party_summaries(text, stem, year, party, frequency, words) select text, stem, extract(year from phrases.date), member.party, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, member.party, text, stem ;

create index ppts_text_idx on phrases_party_summaries (text);
create index ppts_stem_idx on phrases_party_summaries (stem);
create index ppts_party on phrases_party_summaries (party);
create index ppts_year_idx on phrases_party_summaries (year);

DROP TABLE IF EXISTS phrases_speaker_ids_summaries;
CREATE TABLE phrases_speaker_ids_summaries (
  text varchar(200) NOT NULL,
  stem varchar(200),
  year integer NOT NULL,
  speaker_id integer DEFAULT NULL,
  frequency integer DEFAULT 0,
  words integer DEFAULT 0
);

insert into phrases_speaker_ids_summaries(text, stem, year, speaker_id, frequency, words) select text, stem, extract(year from phrases.date), speaker_id, sum(frequency) as frequency, count(words) as words from 
phrases inner join hansards on hansards.id = phrases.hansard_id inner join member on member.member_id = hansards.speaker_id group by phrases.date, speaker_id, text, stem ;

create index pss_text_idx on phrases_speaker_ids_summaries (text);
create index pss_stem_idx on phrases_speaker_ids_summaries (stem);
create index pss_speaker_id on phrases_speaker_ids_summaries (speaker_id);
create index pss_year_idx on phrases_speaker_ids_summaries (year);

DROP TABLE IF EXISTS phrases_person_ids_summaries;

commit;
