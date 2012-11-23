DROP TABLE IF EXISTS member;
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
    lastupdate timestamp without time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY member
    ADD CONSTRAINT member_pkey PRIMARY KEY (member_id);
