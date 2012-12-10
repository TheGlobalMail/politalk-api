--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

ALTER TABLE ONLY public.member DROP CONSTRAINT member_pkey;
DROP TABLE public.member;
SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

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
-- Name: member_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY member
    ADD CONSTRAINT member_pkey PRIMARY KEY (member_id);


--
-- Name: house_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX house_idx ON member USING btree (house);


--
-- Name: party_idx; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX party_idx ON member USING btree (party);


--
-- PostgreSQL database dump complete
--


INSERT INTO  member (member_id, house, first_name, last_name, constituency, party, entered_house, left_house, entered_reason, left_reason, person_id, title)
      SELECT 265,1,'John','Howard','Bennelong','Liberal Party','1974-05-18','2007-11-24','general_election','',10313, '';

