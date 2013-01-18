--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

--DROP INDEX public.text_idx;
--DROP INDEX public.stem_idx;
--DROP INDEX public.speaker_idx;
--DROP INDEX public.searchable_idx;
--DROP INDEX public.pss_text_idx;
--DROP INDEX public.pss_stem_idx;
--DROP INDEX public.pss_speaker_id;
--DROP INDEX public.pss_date_idx;
--DROP INDEX public.psm_text_idx;
--DROP INDEX public.psm_speaker_id;
--DROP INDEX public.psm_date_idx;
--DROP INDEX public.ps_text_idx;
--DROP INDEX public.ps_stem_idx;
--DROP INDEX public.ps_date_idx;
--DROP INDEX public.pps_text_idx;
--DROP INDEX public.pps_stem_idx;
--DROP INDEX public.pps_person_id;
--DROP INDEX public.pps_date_idx;
--DROP INDEX public.pm_text_idx;
--DROP INDEX public.pm_date_idx;
--DROP INDEX public.phs_text_idx;
--DROP INDEX public.phs_stem_idx;
--DROP INDEX public.phs_party;
--DROP INDEX public.phs_house;
--DROP INDEX public.phs_date_idx;
--DROP INDEX public.phm_text_idx;
--DROP INDEX public.phm_party;
--DROP INDEX public.phm_house;
--DROP INDEX public.phm_date_idx;
--DROP INDEX public.party_idx;
--DROP INDEX public.partied_idx;
--DROP INDEX public.ms_speaker_id;
--DROP INDEX public.ms_durationx;
--DROP INDEX public.ms_datex;
--DROP INDEX public.house_idx;
--DROP INDEX public.hansard_idx;
--DROP INDEX public.duration_idx;
--DROP INDEX public.datex;
--DROP INDEX public.date_party_idx;
--DROP INDEX public.date_idx;
--ALTER TABLE ONLY public.member DROP CONSTRAINT member_pkey;
--ALTER TABLE ONLY public.hansards DROP CONSTRAINT hansards_pkey;
DROP TABLE IF EXISTS public.summaries;
DROP TABLE IF EXISTS public.phrases_summaries;
DROP TABLE IF EXISTS public.phrases_speaker_ids_summaries;
DROP TABLE IF EXISTS public.phrases_speaker_ids_months;
DROP TABLE IF EXISTS public.phrases_person_ids_summaries;
DROP TABLE IF EXISTS public.phrases_months;
DROP TABLE IF EXISTS public.phrases_houses_summaries;
DROP TABLE IF EXISTS public.phrases_houses_months;
DROP TABLE IF EXISTS public.phrases;
DROP TABLE IF EXISTS public.member_summaries;
DROP TABLE IF EXISTS public.member;
DROP TABLE IF EXISTS public.hansards;
DROP FUNCTION if exists public.countinstring(text, text, text);
DROP FUNCTION if exists public.countinstring(text, text);
-- DROP EXTENSION plpgsql;
-- DROP SCHEMA public;
-- DROP DATABASE politalk;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

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
    searchable tsvector,
    party character varying(100) DEFAULT ''::character varying NOT NULL,
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
-- Name: searchable_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX searchable_idx ON hansards USING gin (searchable);


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

drop trigger if exists tsvectorupdate ON public.hansards;;
-- CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON hansards FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(searchable, 'pg_catalog.english', stripped_html);
CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON hansards FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(searchable, 'pg_catalog.english', stripped_html);

--
-- PostgreSQL database dump complete
--

