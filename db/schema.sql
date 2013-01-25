--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

drop trigger if exists extra_wordchoice_tokens ON public.wordchoice_tokens;
drop trigger if exists extra_hansards ON public.hansards;
drop index if exists public.wt_word1_idx;
drop index if exists public.wt_word12_idx;
drop index if exists public.wt_word123_idx;
drop index if exists public.wt_week_idx;
drop index if exists public.wt_token1_idx;
drop index if exists public.wt_token12_idx;
drop index if exists public.wt_token123_idx;
drop index if exists public.wt_party_date_idx;
drop index if exists public.wt_lower_word1_idx;
drop index if exists public.wt_lower_word12_idx;
drop index if exists public.text_idx;
drop index if exists public.stem_idx;
drop index if exists public.speaker_idx;
drop index if exists public.pss_text_idx;
drop index if exists public.pss_stem_idx;
drop index if exists public.pss_speaker_id;
drop index if exists public.pss_date_idx;
drop index if exists public.psm_text_idx;
drop index if exists public.psm_speaker_id;
drop index if exists public.psm_date_idx;
drop index if exists public.ps_text_idx;
drop index if exists public.ps_stem_idx;
drop index if exists public.ps_date_idx;
drop index if exists public.pps_text_idx;
drop index if exists public.pps_stem_idx;
drop index if exists public.pps_person_id;
drop index if exists public.pps_date_idx;
drop index if exists public.pm_text_idx;
drop index if exists public.pm_date_idx;
drop index if exists public.phs_text_idx;
drop index if exists public.phs_stem_idx;
drop index if exists public.phs_party;
drop index if exists public.phs_house;
drop index if exists public.phs_date_idx;
drop index if exists public.phm_text_idx;
drop index if exists public.phm_party;
drop index if exists public.phm_house;
drop index if exists public.phm_date_idx;
drop index if exists public.party_idx;
drop index if exists public.partied_idx;
drop index if exists public.ms_speaker_id;
drop index if exists public.ms_durationx;
drop index if exists public.ms_datex;
drop index if exists public.house_idx;
drop index if exists public.hansard_idx;
drop index if exists public.duration_idx;
drop index if exists public.datex;
drop index if exists public.date_party_idx;
drop index if exists public.date_idx;
ALTER TABLE ONLY public.member DROP CONSTRAINT member_pkey;
ALTER TABLE ONLY public.hansards DROP CONSTRAINT hansards_pkey;
drop table if exists public.wordchoice_tokens;
drop table if exists public.summaries;
drop table if exists public.phrases_summaries;
drop table if exists public.phrases_speaker_ids_summaries;
drop table if exists public.phrases_speaker_ids_months;
drop table if exists public.phrases_person_ids_summaries;
drop table if exists public.phrases_months;
drop table if exists public.phrases_houses_summaries;
drop table if exists public.phrases_houses_months;
drop table if exists public.phrases;
drop table if exists public.member_summaries;
drop table if exists public.member;
drop table if exists public.hansards;
drop function if exists public.countinstring(text, text, text);
drop function if exists public.countinstring(text, text);
drop function if exists public.calculate_extra_wordchoice_tokens();
drop function if exists public.calculate_extra_hansards();
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

--
-- Name: calculate_extra_hansards(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION calculate_extra_hansards() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.party = (select party from member m where  NEW.speaker_id = m.member_id limit 1) || '';
  NEW.partied = (NEW.party not in ('CWM', 'DPRES', 'Speaker', 'President', 'PRES', 'SPK', 'Deputy', 'Deputy-Speaker', '') and NEW.party is not null);
  NEW.stripped_html = regexp_replace(NEW.html, '<.*?>', ' ', 'g');
  RETURN NEW;
END;
$$;


--
-- Name: calculate_extra_wordchoice_tokens(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION calculate_extra_wordchoice_tokens() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.week = extract(year from NEW.date) || '-' || lpad(extract(week from NEW.date)::text, 2, '0');
  RETURN NEW;
END;
$$;


--
-- Name: countinstring(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION countinstring(text, text) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$
  SELECT(Length($1) - Length(RegExp_Replace($1, $2, '', 'ing'))) / Length($2) 
$_$;


--
-- Name: countinstring(text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION countinstring(text, text, text) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$
 SELECT(Length($1) - Length(REGEXP_REPLACE($1, $2, 'im'))) / Length($3) ;
$_$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: hansards; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE hansards (
    id character varying(26) DEFAULT NULL::character varying NOT NULL,
    html text NOT NULL,
    date date NOT NULL,
    major boolean,
    minor boolean,
    major_id character varying(26) DEFAULT NULL::character varying,
    minor_id character varying(26) DEFAULT NULL::character varying,
    speaker character varying(100) DEFAULT NULL::character varying,
    speaker_id integer,
    "time" timestamp without time zone,
    time_of_day character varying(5) DEFAULT NULL::character varying,
    duration integer DEFAULT 0,
    talktype character varying(50) DEFAULT NULL::character varying,
    words integer,
    stripped_html character varying,
    party character varying(100) DEFAULT ''::character varying,
    partied boolean
);


--
-- Name: member; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE member (
    member_id integer DEFAULT 0 NOT NULL,
    house integer,
    first_name character varying(100) DEFAULT NULL::character varying,
    last_name character varying(255) DEFAULT ''::character varying NOT NULL,
    constituency character varying(100) DEFAULT ''::character varying NOT NULL,
    party character varying(100) DEFAULT ''::character varying NOT NULL,
    entered_house date DEFAULT '1000-01-01'::date NOT NULL,
    left_house date DEFAULT '9999-12-31'::date NOT NULL,
    entered_reason character varying(100),
    left_reason character varying(100),
    person_id integer DEFAULT 0 NOT NULL,
    title character varying(50) DEFAULT ''::character varying NOT NULL,
    lastupdate timestamp without time zone DEFAULT now() NOT NULL,
    image character varying(255)
);


--
-- Name: member_summaries; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE member_summaries (
    duration integer NOT NULL,
    speaker character varying(200) DEFAULT NULL::character varying,
    first_name character varying(100) DEFAULT NULL::character varying,
    last_name character varying(255) DEFAULT ''::character varying NOT NULL,
    speaker_id integer DEFAULT 0 NOT NULL,
    image character varying(255) DEFAULT NULL::character varying,
    entered_house date,
    left_house date,
    left_reason character varying(255) DEFAULT NULL::character varying,
    person_id integer DEFAULT 0 NOT NULL,
    house integer,
    party character varying(100) DEFAULT NULL::character varying,
    interjections integer DEFAULT 0,
    speeches integer DEFAULT 0,
    words integer DEFAULT 0,
    total integer DEFAULT 0,
    date date NOT NULL
);


--
-- Name: phrases; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phrases (
    hansard_id character varying(26) DEFAULT NULL::character varying,
    text character varying(200) NOT NULL,
    frequency integer DEFAULT 0,
    date date NOT NULL,
    stem character varying(200)
);


--
-- Name: phrases_houses_months; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phrases_houses_months (
    text character varying(200) NOT NULL,
    month date NOT NULL,
    house integer,
    party character varying(100) DEFAULT NULL::character varying,
    frequency integer DEFAULT 0,
    words integer DEFAULT 0
);


--
-- Name: phrases_houses_summaries; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phrases_houses_summaries (
    text character varying(200) NOT NULL,
    stem character varying(200),
    date date NOT NULL,
    house integer,
    party character varying(100) DEFAULT NULL::character varying,
    frequency integer DEFAULT 0,
    words integer DEFAULT 0
);


--
-- Name: phrases_months; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phrases_months (
    text character varying(200) NOT NULL,
    month date NOT NULL,
    frequency integer DEFAULT 0,
    words integer DEFAULT 0
);


--
-- Name: phrases_person_ids_summaries; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phrases_person_ids_summaries (
    text character varying(200) NOT NULL,
    stem character varying(200),
    date date NOT NULL,
    person_id integer,
    frequency integer DEFAULT 0,
    words integer DEFAULT 0
);


--
-- Name: phrases_speaker_ids_months; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phrases_speaker_ids_months (
    text character varying(200) NOT NULL,
    month date NOT NULL,
    speaker_id integer,
    frequency integer DEFAULT 0,
    words integer DEFAULT 0
);


--
-- Name: phrases_speaker_ids_summaries; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phrases_speaker_ids_summaries (
    text character varying(200) NOT NULL,
    stem character varying(200),
    date date NOT NULL,
    speaker_id integer,
    frequency integer DEFAULT 0,
    words integer DEFAULT 0
);


--
-- Name: phrases_summaries; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phrases_summaries (
    text character varying(200) NOT NULL,
    stem character varying(200),
    date date NOT NULL,
    frequency integer DEFAULT 0,
    words integer DEFAULT 0
);


--
-- Name: summaries; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE summaries (
    "time" timestamp without time zone,
    members text,
    keywords text,
    dates text,
    version integer DEFAULT 0
);


--
-- Name: wordchoice_tokens; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE wordchoice_tokens (
    word1 character varying(100),
    token1 character varying(100),
    word2 character varying(100),
    token2 character varying(100),
    word3 character varying(100),
    token3 character varying(100),
    hansard_id character varying(26) DEFAULT NULL::character varying NOT NULL,
    party character varying(100) DEFAULT ''::character varying NOT NULL,
    date date NOT NULL,
    week character varying(7)
);


--
-- Name: hansards_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY hansards
    ADD CONSTRAINT hansards_pkey PRIMARY KEY (id);


--
-- Name: member_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY member
    ADD CONSTRAINT member_pkey PRIMARY KEY (member_id);


--
-- Name: date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX date_idx ON hansards USING btree (date);


--
-- Name: date_party_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX date_party_idx ON hansards USING btree (party, date);


--
-- Name: datex; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX datex ON phrases USING btree (date);


--
-- Name: duration_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX duration_idx ON hansards USING btree (duration);


--
-- Name: hansard_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX hansard_idx ON phrases USING btree (hansard_id);


--
-- Name: house_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX house_idx ON member USING btree (house);


--
-- Name: ms_datex; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ms_datex ON member_summaries USING btree (date);


--
-- Name: ms_durationx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ms_durationx ON member_summaries USING btree (duration);


--
-- Name: ms_speaker_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ms_speaker_id ON member_summaries USING btree (speaker_id, speaker, person_id, party, house, first_name, last_name, image, entered_house, left_house, left_reason);


--
-- Name: partied_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX partied_idx ON hansards USING btree (partied);


--
-- Name: party_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX party_idx ON member USING btree (party);


--
-- Name: phm_date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX phm_date_idx ON phrases_houses_months USING btree (month);


--
-- Name: phm_house; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX phm_house ON phrases_houses_months USING btree (house);


--
-- Name: phm_party; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX phm_party ON phrases_houses_months USING btree (party);


--
-- Name: phm_text_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX phm_text_idx ON phrases_houses_months USING btree (text);


--
-- Name: phs_date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX phs_date_idx ON phrases_houses_summaries USING btree (date);


--
-- Name: phs_house; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX phs_house ON phrases_houses_summaries USING btree (house);


--
-- Name: phs_party; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX phs_party ON phrases_houses_summaries USING btree (party);


--
-- Name: phs_stem_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX phs_stem_idx ON phrases_houses_summaries USING btree (stem);


--
-- Name: phs_text_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX phs_text_idx ON phrases_houses_summaries USING btree (text);


--
-- Name: pm_date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pm_date_idx ON phrases_months USING btree (month);


--
-- Name: pm_text_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pm_text_idx ON phrases_months USING btree (text);


--
-- Name: pps_date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pps_date_idx ON phrases_person_ids_summaries USING btree (date);


--
-- Name: pps_person_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pps_person_id ON phrases_person_ids_summaries USING btree (person_id);


--
-- Name: pps_stem_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pps_stem_idx ON phrases_person_ids_summaries USING btree (stem);


--
-- Name: pps_text_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pps_text_idx ON phrases_person_ids_summaries USING btree (text);


--
-- Name: ps_date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ps_date_idx ON phrases_summaries USING btree (date);


--
-- Name: ps_stem_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ps_stem_idx ON phrases_summaries USING btree (stem);


--
-- Name: ps_text_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX ps_text_idx ON phrases_summaries USING btree (text);


--
-- Name: psm_date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX psm_date_idx ON phrases_speaker_ids_months USING btree (month);


--
-- Name: psm_speaker_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX psm_speaker_id ON phrases_speaker_ids_months USING btree (speaker_id);


--
-- Name: psm_text_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX psm_text_idx ON phrases_speaker_ids_months USING btree (text);


--
-- Name: pss_date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pss_date_idx ON phrases_speaker_ids_summaries USING btree (date);


--
-- Name: pss_speaker_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pss_speaker_id ON phrases_speaker_ids_summaries USING btree (speaker_id);


--
-- Name: pss_stem_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pss_stem_idx ON phrases_speaker_ids_summaries USING btree (stem);


--
-- Name: pss_text_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX pss_text_idx ON phrases_speaker_ids_summaries USING btree (text);


--
-- Name: speaker_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX speaker_idx ON hansards USING btree (speaker_id);


--
-- Name: stem_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX stem_idx ON phrases USING btree (stem);


--
-- Name: text_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX text_idx ON phrases USING btree (text);


--
-- Name: wt_lower_word12_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_lower_word12_idx ON wordchoice_tokens USING btree (lower((word1)::text), lower((word2)::text));


--
-- Name: wt_lower_word1_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_lower_word1_idx ON wordchoice_tokens USING btree (lower((word1)::text));


--
-- Name: wt_party_date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_party_date_idx ON wordchoice_tokens USING btree (party, date);


--
-- Name: wt_token123_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_token123_idx ON wordchoice_tokens USING btree (token1, token2, token3);


--
-- Name: wt_token12_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_token12_idx ON wordchoice_tokens USING btree (token1, token2);


--
-- Name: wt_token1_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_token1_idx ON wordchoice_tokens USING btree (token1);


--
-- Name: wt_week_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_week_idx ON wordchoice_tokens USING btree (week);


--
-- Name: wt_word123_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_word123_idx ON wordchoice_tokens USING btree (word1, word2, word3);


--
-- Name: wt_word12_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_word12_idx ON wordchoice_tokens USING btree (word1, word2);


--
-- Name: wt_word1_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX wt_word1_idx ON wordchoice_tokens USING btree (word1);


--
-- Name: extra_hansards; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER extra_hansards BEFORE INSERT OR UPDATE ON hansards FOR EACH ROW EXECUTE PROCEDURE calculate_extra_hansards();


--
-- Name: extra_wordchoice_tokens; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER extra_wordchoice_tokens BEFORE INSERT OR UPDATE ON wordchoice_tokens FOR EACH ROW EXECUTE PROCEDURE calculate_extra_wordchoice_tokens();


--
-- PostgreSQL database dump complete
--

