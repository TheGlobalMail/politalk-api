begin;

DROP TABLE IF EXISTS member_summaries;
CREATE TABLE member_summaries (
  duration integer NOT NULL,
  speaker character varying(200) DEFAULT NULL::character varying,
  first_name character varying(100) DEFAULT NULL::character varying,
  last_name character varying(255) DEFAULT ''::character varying NOT NULL,
  speaker_id integer DEFAULT 0 NOT NULL,
  image varchar(255) DEFAULT NULL,
  person_id integer DEFAULT 0 NOT NULL,
  house integer DEFAULT NULL,
  party varchar(100) DEFAULT NULL,
  interjections integer DEFAULT 0,
  speeches integer DEFAULT 0,
  words integer DEFAULT 0,
  total integer DEFAULT 0
);

insert into member_summaries(duration, speaker, first_name, last_name, speaker_id, 
  person_id, party, interjections, speeches, house, words, total, image)
select sum(duration) as duration, speaker, first_name, 
last_name, speaker_id, person_id, party, 
sum(case when (talktype='interjection') then 1 else 0 end) as interjections,
sum(case when (talktype='speech') then 1 else 0 end) as speeches,
house, sum(words) as words, count(*) as total, image from hansards
inner join member on member.member_id = speaker_id
group by speaker_id,speaker,person_id,party,house,first_name,last_name,image 
order by sum(duration) desc;

create index ms_durationx on member_summaries(duration);

commit;