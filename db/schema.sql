--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

DROP TABLE summaries;
DROP TABLE phrases;
DROP TABLE member;
DROP TABLE hansards;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
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
    words integer
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


CREATE TABLE phrases (
    hansard_id character varying(26) DEFAULT NULL::character varying,
    text character varying(200) NOT NULL,
    frequency integer DEFAULT 0,
    date date NOT NULL,
    stem character varying(200)
);

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

--
-- Name: party_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX party_idx ON member USING btree (party);


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
