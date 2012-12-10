--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

ALTER TABLE ONLY public.hansards DROP CONSTRAINT hansards_pkey;
DROP TABLE public.phrases;
DROP TABLE public.hansards;
SET search_path = public, pg_catalog;

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
    totalWords integer
);


--
-- Name: phrases; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE phrases (
    hansard_id character varying(26) DEFAULT NULL::character varying,
    text character varying(200) NOT NULL,
    stem character varying(200) NOT NULL,
    frequency integer DEFAULT 0,
    date date NOT NULL
);


--
-- Name: hansards_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY hansards
    ADD CONSTRAINT hansards_pkey PRIMARY KEY (id);


--
-- Name: date_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX date_idx ON hansards USING btree (date);


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
-- Name: speaker_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX speaker_idx ON hansards USING btree (speaker_id);


--
-- Name: text_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX text_idx ON phrases USING btree (text);


--
-- PostgreSQL database dump complete
--
