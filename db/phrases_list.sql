begin;

DROP TABLE IF EXISTS phrases_list;
CREATE TABLE phrases_list (
  year varchar(9),
  lastupdate timestamp without time zone DEFAULT now() NOT NULL,
  data text NOT NULL
);

create index pl_year_idx on phrases_list (year);


DROP TABLE IF EXISTS phrases_party_list;
CREATE TABLE phrases_party_list (
  year varchar(9),
  party varchar(100) DEFAULT NULL,
  lastupdate timestamp without time zone DEFAULT now() NOT NULL,
  data text NOT NULL
);

create index phl_party on phrases_party_list (party);
create index phl_year_idx on phrases_party_list (year);
create index phl_party_year_idx on phrases_party_list (party, year);

DROP TABLE IF EXISTS phrases_speaker_ids_list;
CREATE TABLE phrases_speaker_ids_list (
  year varchar(9),
  speaker_id integer DEFAULT NULL,
  lastupdate timestamp without time zone DEFAULT now() NOT NULL,
  data text NOT NULL
);

create index psl_speaker_id on phrases_speaker_ids_list (speaker_id);
create index psl_year_idx on phrases_speaker_ids_list (year);
create index psl_speaker_id_year_idx on phrases_speaker_ids_list (speaker_id, year);

commit;
