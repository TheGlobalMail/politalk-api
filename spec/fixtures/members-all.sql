--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

DROP INDEX public.party_idx;
DROP INDEX public.house_idx;
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
    lastupdate timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: -
--

COPY member (member_id, house, first_name, last_name, constituency, party, entered_house, left_house, entered_reason, left_reason, person_id, title, lastupdate) FROM stdin;
1	1	Tony	Abbott	Warringah	Liberal Party	1994-03-26	9999-12-31	by_election	still_in_office	10001		2012-10-17 05:32:08
3	1	Dick	Adams	Lyons	Australian Labor Party	1993-03-13	9999-12-31	general_election	still_in_office	10004		2012-10-17 05:32:08
4	1	Albert	Adermann	Fairfax	National Party	1984-12-01	1990-02-19	general_election	retired	10006		2012-10-17 05:32:08
5	1	Albert	Adermann	Fisher	National Party	1972-12-02	1984-12-01	general_election		10006		2012-10-17 05:32:08
6	1	Anthony	Albanese	Grayndler	Australian Labor Party	1996-03-02	9999-12-31	general_election	still_in_office	10007		2012-10-17 05:32:08
7	1	Kenneth	Aldred	Bruce	Liberal Party	1983-05-28	1990-03-24	by_election		10008		2012-10-17 05:32:08
8	1	Kenneth	Aldred	Deakin	Liberal Party	1990-03-24	1996-01-29	general_election	retired	10008		2012-10-17 05:32:08
9	1	Kenneth	Aldred	Henty	Liberal Party	1975-12-13	1980-10-18	general_election		10008		2012-10-17 05:32:08
10	1	John	Anderson	Gwydir	National Party	1989-04-15	2007-10-17	by_election	retired	10011		2012-10-17 05:32:08
11	1	Peter	Andren	Calare	Independent	1996-03-02	2007-10-17	general_election	retired	10012		2012-10-17 05:32:08
12	1	John	Andrew	Wakefield	Liberal Party	1983-03-05	1998-11-10	general_election	changed_party	10013		2012-10-17 05:32:08
13	1	Kevin	Andrews	Menzies	Liberal Party	1991-05-11	9999-12-31	by_election	still_in_office	10014		2012-10-17 05:32:08
14	1	John	Anthony	Richmond	National Party	1957-09-14	1984-01-18	by_election	resigned	10015		2012-10-17 05:32:08
15	1	Larry	Anthony	Richmond	National Party	1996-03-02	2004-10-09	general_election		10016		2012-10-17 05:32:08
16	1	John	Armitage	Chifley	Australian Labor Party	1969-10-25	1983-02-04	general_election	retired	10018		2012-10-17 05:32:08
17	1	John	Armitage	Mitchell	Australian Labor Party	1961-12-09	1963-11-30	general_election		10018		2012-10-17 05:32:08
18	1	Rodney	Atkinson	Isaacs	Liberal Party	1990-03-24	1996-03-02	general_election		10019		2012-10-17 05:32:08
19	1	Fran	Bailey	McEwen	Liberal Party	1990-03-24	1993-03-13	general_election		10021		2012-10-17 05:32:08
20	1	Fran	Bailey	McEwen	Liberal Party	1996-03-02	2010-08-21	general_election	retired	10021		2012-10-17 05:32:08
21	1	Marshall	Baillieu	La Trobe	Liberal Party	1975-12-13	1980-10-18	general_election		10022		2012-10-17 05:32:08
22	1	Bruce	Baird	Cook	Liberal Party	1998-10-03	2007-10-17	general_election	retired	10023		2012-10-17 05:32:08
23	1	Mark	Baker	Braddon	Liberal Party	2004-10-09	2007-11-24	general_election		10024		2012-10-17 05:32:08
24	1	Peter	Baldwin	Sydney	Australian Labor Party	1983-03-05	1998-08-31	general_election	retired	10025		2012-10-17 05:32:08
25	1	Bob	Baldwin	Paterson	Liberal Party	1996-03-02	1998-10-03	general_election		10026		2012-10-17 05:32:08
26	1	Bob	Baldwin	Paterson	Liberal Party	2001-11-10	9999-12-31	general_election	still_in_office	10026		2012-10-17 05:32:08
27	1	Phillip	Barresi	Deakin	Liberal Party	1996-03-02	2007-11-24	general_election		10028		2012-10-17 05:32:08
28	1	Kerry	Bartlett	Macquarie	Liberal Party	1996-03-02	2007-11-24	general_election		10030		2012-10-17 05:32:08
29	1	Michael	Baume	Macarthur	Liberal Party	1975-12-13	1983-03-05	general_election		10031		2012-10-17 05:32:08
30	1	Julian	Beale	Bruce	Liberal Party	1990-03-24	1996-03-02	general_election		10034		2012-10-17 05:32:08
31	1	Julian	Beale	Deakin	Liberal Party	1984-12-01	1990-03-24	general_election		10034		2012-10-17 05:32:08
32	1	Kim	Beazley	Brand	Australian Labor Party	1996-03-02	2007-10-17	general_election	retired	10035		2012-10-17 05:32:08
33	1	Kim	Beazley	Swan	Australian Labor Party	1980-10-18	1996-03-02	general_election		10035		2012-10-17 05:32:08
34	1	David	Beddall	Fadden	Australian Labor Party	1983-03-05	1984-12-01	general_election		10036		2012-10-17 05:32:08
35	1	David	Beddall	Rankin	Australian Labor Party	1984-12-01	1998-08-31	general_election	retired	10036		2012-10-17 05:32:08
36	1	Arch	Bevis	Brisbane	Australian Labor Party	1990-03-24	2010-08-21	general_election		10039		2012-10-17 05:32:08
37	1	James	Bidgood	Dawson	Australian Labor Party	2007-11-24	2010-08-21	general_election	retired	10040		2012-10-17 05:32:08
38	1	Bruce	Billson	Dunkley	Liberal Party	1996-03-02	9999-12-31	general_election	still_in_office	10041		2012-10-17 05:32:08
39	1	Gordon	Bilney	Kingston	Australian Labor Party	1983-03-05	1996-03-02	general_election		10042		2012-10-17 05:32:08
40	1	Sharon	Bird	Cunningham	Australian Labor Party	2004-10-09	9999-12-31	general_election	still_in_office	10043		2012-10-17 05:32:08
41	1	Reginald	Birney	Phillip	Liberal Party	1975-12-13	1983-03-05	general_election		10045		2012-10-17 05:32:08
42	1	Bronwyn	Bishop	Mackellar	Liberal Party	1994-03-26	9999-12-31	by_election	still_in_office	10046	Mrs	2012-10-17 05:32:08
43	1	Julie	Bishop	Curtin	Liberal Party	1998-10-03	9999-12-31	general_election	still_in_office	10047	Ms	2012-10-17 05:32:08
44	1	Cecil	Blanchard	Moore	Australian Labor Party	1983-03-05	1990-03-24	general_election		10052		2012-10-17 05:32:08
45	1	Neal	Blewett	Bonython	Australian Labor Party	1977-12-10	1994-02-11	general_election	resigned	10053		2012-10-17 05:32:08
46	1	Charles	Blunt	Richmond	National Party	1984-02-18	1990-03-24	by_election		10054		2012-10-17 05:32:08
47	1	John	Bourchier	Bendigo	Liberal Party	1972-12-02	1983-03-05	general_election		10058		2012-10-17 05:32:08
48	1	Chris	Bowen	Prospect	Australian Labor Party	2004-10-09	2010-08-21	general_election		10060		2012-10-17 05:32:08
49	1	Lionel	Bowen	Kingsford Smith	Australian Labor Party	1969-10-25	1990-02-19	general_election	retired	10061		2012-10-17 05:32:08
50	1	David	Bradbury	Lindsay	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10063		2012-10-17 05:32:08
51	1	James	Bradfield	Barton	Liberal Party	1975-12-13	1983-03-05	general_election		10064		2012-10-17 05:32:08
52	1	John	Bradford	McPherson	Christian Democratic Party	1990-03-24	1998-10-03	general_election		10065		2012-10-17 05:32:08
53	1	Raymond	Braithwaite	Dawson	National Party	1975-12-13	1996-01-29	general_election	retired	10066		2012-10-17 05:32:08
54	1	Laurence	Brereton	Kingsford Smith	Australian Labor Party	1990-03-24	2004-08-31	general_election	retired	10068		2012-10-17 05:32:08
55	1	Russell	Broadbent	Corinella	Liberal Party	1990-03-24	1993-03-13	general_election		10069		2012-10-17 05:32:08
56	1	Russell	Broadbent	McMillan	Liberal Party	1996-03-02	1998-10-03	general_election		10069		2012-10-17 05:32:08
57	1	Russell	Broadbent	McMillan	Liberal Party	2004-10-09	9999-12-31	general_election	still_in_office	10069		2012-10-17 05:32:08
58	1	Mal	Brough	Longman	Liberal Party	1996-03-02	2007-11-24	general_election		10070		2012-10-17 05:32:08
59	1	John	Brown	Parramatta	Australian Labor Party	1977-12-10	1990-02-19	general_election	retired	10072		2012-10-17 05:32:08
60	1	Joseph	Brown	Indi	ANTI-SOC	1906-12-12	1910-04-13	general_election		10073		2012-10-17 05:32:08
62	1	Robert	Brown	Charlton	Australian Labor Party	1984-12-01	1998-08-31	general_election	retired	10074		2012-10-17 05:32:08
63	1	Robert	Brown	Hunter	Australian Labor Party	1980-10-18	1984-12-01	general_election		10074		2012-10-17 05:32:08
64	1	John	Brumby	Bendigo	Australian Labor Party	1983-03-05	1990-03-24	general_election		10076		2012-10-17 05:32:08
65	1	Gordon	Bryant	Wills	Australian Labor Party	1955-12-10	1980-09-19	general_election	retired	10077		2012-10-17 05:32:08
66	1	Melville	Bungey	Canning	Liberal Party	1974-05-18	1983-03-05	general_election		10079		2012-10-17 05:32:08
67	1	Anna	Burke	Chisholm	Australian Labor Party	1998-10-03	2008-02-11	general_election	changed_party	10080	Ms	2012-10-17 05:32:08
68	1	Anna	Burke	Chisholm	CWM	2008-02-12	9999-12-31	changed_party	still_in_office	10080	Ms	2012-10-17 05:32:08
69	1	Tony	Burke	Watson	Australian Labor Party	2004-10-09	9999-12-31	general_election	still_in_office	10081	Mr	2012-10-17 05:32:08
70	1	William	Burns	Isaacs	Liberal Party	1977-12-10	1980-10-18	general_election		10083		2012-10-17 05:32:08
71	1	Maxwell	Burr	Lyons	Liberal Party	1984-12-01	1993-02-08	general_election	retired	10084		2012-10-17 05:32:08
72	1	Maxwell	Burr	Wilmot	Liberal Party	1975-12-13	1984-12-01	general_election		10084		2012-10-17 05:32:08
73	1	Mark	Butler	Port Adelaide	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10086		2012-10-17 05:32:08
74	1	Anthony	Byrne	Holt	Australian Labor Party	1999-11-06	9999-12-31	by_election	still_in_office	10088		2012-10-17 05:32:08
76	1	Alan	Cadman	Mitchell	Liberal Party	1974-05-18	2007-10-17	general_election	retired	10089		2012-10-17 05:32:08
77	1	Stephen	Calder	Northern Territory	National Country Party	1966-11-26	1980-09-19	general_election	retired	10090		2012-10-17 05:32:08
78	1	Clyde	Cameron	Hindmarsh	Australian Labor Party	1949-12-10	1980-09-19	general_election	retired	10092		2012-10-17 05:32:08
79	1	Donald	Cameron	Fadden	Liberal Party	1977-12-10	1983-03-05	general_election		10093		2012-10-17 05:32:08
80	1	Donald	Cameron	Griffith	Liberal Party	1966-11-26	1977-12-10	general_election		10093		2012-10-17 05:32:08
81	1	Donald	Cameron	Moreton	Liberal Party	1983-11-05	1990-03-24	by_election		10093		2012-10-17 05:32:08
82	1	Eoin	Cameron	Stirling	Liberal Party	1993-03-13	1998-10-03	general_election		10094		2012-10-17 05:32:08
83	1	Ewen	Cameron	Indi	Liberal Party	1977-12-10	1993-02-08	general_election	retired	10095		2012-10-17 05:32:08
84	1	Ian	Cameron	Maranoa	National Party	1980-10-18	1990-02-19	general_election	retired	10096		2012-10-17 05:32:08
85	1	Ross	Cameron	Parramatta	Liberal Party	1996-03-02	2004-10-09	general_election		10097		2012-10-17 05:32:08
86	1	Graeme	Campbell	Kalgoorlie	Independent	1980-10-18	1998-10-03	general_election		10099		2012-10-17 05:32:08
87	1	Jodie	Campbell	Bass	Australian Labor Party	2007-11-24	2010-08-21	general_election	retired	10101		2012-10-17 05:32:08
88	1	James	Carlton	Mackellar	Liberal Party	1977-12-10	1994-01-14	general_election	resigned	10102		2012-10-17 05:32:08
89	1	Moses	Cass	Maribyrnong	Australian Labor Party	1969-10-25	1983-02-04	general_election	retired	10105		2012-10-17 05:32:08
90	1	Robert	Catley	Adelaide	Australian Labor Party	1990-03-24	1993-03-13	general_election		10106		2012-10-17 05:32:08
91	1	James	Catts	Cook	Australian Labor Party	1906-12-12	1922-12-16	general_election		10107		2012-10-17 05:32:08
92	1	Ian	Causley	Page	National Party	1996-03-02	2002-02-11	general_election	changed_party	10108		2012-10-17 05:32:08
93	1	Ian	Causley	Page	CWM	2002-02-11	2007-10-17	changed_party	retired	10108		2012-10-17 05:32:08
94	1	Nick	Champion	Wakefield	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10111		2012-10-17 05:32:08
95	1	Frederick	Chaney	Pearce	Liberal Party	1990-03-24	1993-02-08	general_election	retired	10112		2012-10-17 05:32:08
96	1	Grant	Chapman	Kingston	Liberal Party	1975-12-13	1983-03-05	general_election		10113		2012-10-17 05:32:08
97	1	David	Charles	Isaacs	Australian Labor Party	1980-10-18	1990-02-19	general_election	retired	10114		2012-10-17 05:32:08
98	1	Robert	Charles	La Trobe	Liberal Party	1990-03-24	2004-08-31	general_election	retired	10115		2012-10-17 05:32:08
99	1	Joan	Child	Henty	Australian Labor Party	1980-10-18	1986-02-11	general_election	changed_party	10697		2012-10-17 05:32:08
100	1	Richard	Charlesworth	Perth	Australian Labor Party	1983-03-05	1993-02-08	general_election	retired	10116		2012-10-17 05:32:08
101	1	Darren	Cheeseman	Corangamite	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10117		2012-10-17 05:32:08
102	1	Robert	Chynoweth	Dunkley	Australian Labor Party	1984-12-01	1990-03-24	general_election		10121		2012-10-17 05:32:08
103	1	Robert	Chynoweth	Dunkley	Australian Labor Party	1993-03-13	1996-03-02	general_election		10121		2012-10-17 05:32:08
104	1	Robert	Chynoweth	Flinders	Australian Labor Party	1983-03-05	1984-12-01	general_election		10121		2012-10-17 05:32:08
105	1	Steven	Ciobo	Moncrieff	Liberal Party	2001-11-10	9999-12-31	general_election	still_in_office	10122		2012-10-17 05:32:08
106	1	Jason	Clare	Blaxland	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10123		2012-10-17 05:32:08
107	1	Philip	Cleary	Wills	Independent	1992-04-11	1992-11-25	by_election	declared_void	10124		2012-10-17 05:32:08
108	1	Philip	Cleary	Wills	Independent	1993-03-13	1996-03-02	general_election		10124		2012-10-17 05:32:08
109	1	Peter	Cleeland	McEwen	Australian Labor Party	1984-12-01	1990-03-24	general_election		10125		2012-10-17 05:32:08
110	1	Peter	Cleeland	McEwen	Australian Labor Party	1993-03-13	1996-03-02	general_election		10125		2012-10-17 05:32:08
111	1	John	Cobb	Calare	National Party	2007-11-24	9999-12-31	general_election	still_in_office	10127		2012-10-17 05:32:08
112	1	Michael	Cobb	Parkes	National Party	1984-12-01	1998-08-31	general_election	retired	10128		2012-10-17 05:32:08
113	1	Barry	Cohen	Robertson	Australian Labor Party	1969-10-25	1990-02-19	general_election	retired	10129		2012-10-17 05:32:08
114	1	William	Coleman	Wentworth	Liberal Party	1981-04-11	1987-06-05	by_election	retired	10133		2012-10-17 05:32:08
115	1	Julie	Collins	Franklin	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10136		2012-10-17 05:32:08
116	1	Greg	Combet	Charlton	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10139		2012-10-17 05:32:08
117	1	David	Connolly	Bradfield	Liberal Party	1974-05-18	1996-01-29	general_election	retired	10140		2012-10-17 05:32:08
118	1	Bryan	Conquest	Hinkler	National Party	1984-12-01	1987-07-11	general_election		10141		2012-10-17 05:32:08
119	1	James	Corbett	Maranoa	National Country Party	1966-11-26	1980-09-19	general_election	retired	10146		2012-10-17 05:32:08
120	1	Ann	Corcoran	Isaacs	Australian Labor Party	2000-08-12	2007-10-17	by_election	retired	10147		2012-10-17 05:32:08
121	1	Peter	Costello	Higgins	Liberal Party	1990-03-24	2009-10-19	general_election	resigned	10149		2012-10-17 05:32:08
122	1	John	Cotter	Kalgoorlie	Liberal Party	1975-12-13	1980-10-18	general_election		10150		2012-10-17 05:32:08
123	1	Mark	Coulton	Parkes	National Party	2007-11-24	9999-12-31	general_election	still_in_office	10152		2012-10-17 05:32:08
124	1	Brian	Courtice	Hinkler	Australian Labor Party	1987-07-11	1993-03-13	general_election		10153		2012-10-17 05:32:08
125	1	David	Cowan	Lyne	National Party	1980-10-18	1993-02-08	general_election	retired	10154		2012-10-17 05:32:08
126	1	David	Cox	Kingston	Australian Labor Party	1998-10-03	2004-10-09	general_election		10155		2012-10-17 05:32:08
127	1	Mary	Crawford	Forde	Australian Labor Party	1987-07-11	1996-03-02	general_election		10157		2012-10-17 05:32:08
128	1	Simon	Crean	Hotham	Australian Labor Party	1990-03-24	9999-12-31	general_election	still_in_office	10158		2012-10-17 05:32:08
130	1	Janice	Crosio	Prospect	Australian Labor Party	1990-03-24	2004-08-31	general_election	retired	10160		2012-10-17 05:32:08
131	1	Barry	Cunningham	McMillan	Australian Labor Party	1980-10-18	1990-03-24	general_election		10163		2012-10-17 05:32:08
132	1	Barry	Cunningham	McMillan	Australian Labor Party	1993-03-13	1996-03-02	general_election		10163		2012-10-17 05:32:08
133	1	Yvette	D'Ath	Petrie	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10164		2012-10-17 05:32:08
134	1	Michael	Danby	Melbourne Ports	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10165		2012-10-17 05:32:08
135	1	Steven	Dargavel	Fraser	Australian Labor Party	1997-02-01	1998-08-31	by_election	retired	10166		2012-10-17 05:32:08
136	1	John	Dawkins	Fremantle	Australian Labor Party	1977-12-10	1994-02-04	general_election	resigned	10698		2012-10-17 05:32:08
137	1	Elaine	Darling	Lilley	Australian Labor Party	1980-10-18	1993-02-08	general_election	retired	10167		2012-10-17 05:32:08
138	1	Margaret	Deahm	Macquarie	Australian Labor Party	1993-03-13	1996-03-02	general_election		10169		2012-10-17 05:32:08
139	1	Arthur	Dean	Herbert	Liberal Party	1977-12-10	1983-03-05	general_election		10170		2012-10-17 05:32:08
140	1	Bob	Debus	Macquarie	Australian Labor Party	2007-11-24	2010-08-21	general_election	retired	10171		2012-10-17 05:32:08
142	1	James	Dobie	Cook	Liberal Party	1975-12-13	1996-01-29	general_election	retired	10176		2012-10-17 05:32:08
143	1	James	Dobie	Cook	Liberal Party	1969-10-25	1972-12-02	general_election		10176		2012-10-17 05:32:08
144	1	James	Dobie	Hughes	Liberal Party	1966-11-26	1969-10-25	general_election		10176		2012-10-17 05:32:08
145	1	Peter	Dodd	Leichhardt	Australian Labor Party	1993-03-13	1996-03-02	general_election		10177		2012-10-17 05:32:08
146	1	Nicholas	Dondas	Northern Territory	Country Liberal Party	1996-03-02	1998-10-03	general_election		10178		2012-10-17 05:32:08
147	1	Alexander	Downer	Mayo	Liberal Party	1984-12-01	2008-07-14	general_election	resigned	10179		2012-10-17 05:32:08
148	1	Trish	Draper	Makin	Liberal Party	1996-03-02	2007-10-17	general_election	retired	10180		2012-10-17 05:32:08
149	1	Mark	Dreyfus	Isaacs	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10181		2012-10-17 05:32:08
150	1	Peter	Drummond	Forrest	Liberal Party	1972-12-02	1987-06-05	general_election	retired	10182		2012-10-17 05:32:08
151	1	Stephen	Dubois	St George	Australian Labor Party	1984-12-01	1993-02-08	general_election	retired	10183		2012-10-17 05:32:08
152	1	Michael	Duffy	Holt	Australian Labor Party	1980-10-18	1996-01-29	general_election	retired	10184		2012-10-17 05:32:08
153	1	Peter	Duncan	Makin	Australian Labor Party	1984-12-01	1996-03-02	general_election		10185		2012-10-17 05:32:08
154	1	Peter	Dutton	Dickson	Liberal Party	2001-11-10	9999-12-31	general_election	still_in_office	10188		2012-10-17 05:32:08
155	1	Mary	Easson	Lowe	Australian Labor Party	1993-03-13	1996-03-02	general_election		10189		2012-10-17 05:32:08
156	1	Graham	Edwards	Cowan	Australian Labor Party	1998-10-03	2007-10-17	general_election	retired	10190		2012-10-17 05:32:08
157	1	Harold	Edwards	Berowra	Liberal Party	1972-12-02	1993-02-08	general_election	retired	10191		2012-10-17 05:32:08
158	1	Ronald	Edwards	Stirling	Australian Labor Party	1983-03-05	1993-03-13	general_election		10192		2012-10-17 05:32:08
159	1	Robert	Ellicott	Wentworth	Liberal Party	1974-05-18	1981-02-17	general_election	resigned	10194		2012-10-17 05:32:08
160	1	Justine	Elliot	Richmond	Australian Labor Party	2004-10-09	9999-12-31	general_election	still_in_office	10195		2012-10-17 05:32:08
161	1	Robert	Elliott	Parramatta	Australian Labor Party	1990-03-24	1996-03-02	general_election		10196		2012-10-17 05:32:08
162	1	Annette	Ellis	Canberra	Australian Labor Party	1998-10-03	2010-08-21	general_election	retired	10197		2012-10-17 05:32:08
163	1	Kate	Ellis	Adelaide	Australian Labor Party	2004-10-09	9999-12-31	general_election	still_in_office	10198		2012-10-17 05:32:08
164	1	Kay	Elson	Forde	Liberal Party	1996-03-02	2007-10-17	general_election	retired	10200		2012-10-17 05:32:08
165	1	Craig	Emerson	Rankin	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10202		2012-10-17 05:32:08
166	1	Warren	Entsch	Leichhardt	Liberal Party	1996-03-02	2007-10-17	general_election	retired	10203		2012-10-17 05:32:08
167	1	Gareth	Evans	Holt	Australian Labor Party	1996-03-02	1999-09-30	general_election	resigned	10205		2012-10-17 05:32:08
168	1	Martyn	Evans	Bonython	Australian Labor Party	1994-03-19	2004-10-09	by_election		10207		2012-10-17 05:32:08
169	1	Richard	Evans	Capricornia	Australian Labor Party	1977-12-10	1984-10-26	general_election	retired	10208		2012-10-17 05:32:08
170	1	Richard	Evans	Cowan	Liberal Party	1993-03-13	1998-10-03	general_election		10208		2012-10-17 05:32:08
171	1	Paul	Everingham	Northern Territory	Liberal Party	1984-12-01	1987-06-05	general_election	retired	10209		2012-10-17 05:32:08
172	1	John	Fahey	Macarthur	Liberal Party	1996-03-02	2001-10-08	general_election	retired	10210		2012-10-17 05:32:08
173	1	Peter	Falconer	Casey	Liberal Party	1975-12-13	1983-03-05	general_election		10211		2012-10-17 05:32:08
174	1	Pat	Farmer	Macarthur	Liberal Party	2001-11-10	2010-08-21	general_election	retired	10212		2012-10-17 05:32:08
175	1	Wendy	Fatin	Brand	Australian Labor Party	1984-12-01	1996-01-29	general_election	retired	10213		2012-10-17 05:32:08
176	1	Wendy	Fatin	Canning	Australian Labor Party	1983-03-05	1984-12-01	general_election		10213		2012-10-17 05:32:08
177	1	David	Fawcett	Wakefield	Liberal Party	2004-10-09	2007-11-24	general_election		10215		2012-10-17 05:32:08
178	1	Laurie	Ferguson	Reid	Australian Labor Party	1990-03-24	2010-08-21	general_election		10217		2012-10-17 05:32:08
179	1	Martin	Ferguson	Batman	Australian Labor Party	1996-03-02	9999-12-31	general_election	still_in_office	10218		2012-10-17 05:32:08
180	1	Michael	Ferguson	Bass	Liberal Party	2004-10-09	2007-11-24	general_election		10219		2012-10-17 05:32:08
181	1	Wallace	Fife	Farrer	Liberal Party	1975-12-13	1984-12-01	general_election		10223		2012-10-17 05:32:08
182	1	Wallace	Fife	Hume	Liberal Party	1984-12-01	1993-02-08	general_election	retired	10223		2012-10-17 05:32:08
183	1	Paul	Filing	Moore	Independent	1990-03-24	1998-10-03	general_election		10225		2012-10-17 05:32:08
184	1	Tim	Fischer	Farrer	National Party	1984-12-01	2001-10-08	general_election	retired	10226		2012-10-17 05:32:08
185	1	Peter	Fisher	Mallee	National Party	1972-12-02	1993-02-08	general_election	retired	10228		2012-10-17 05:32:08
186	1	Eric	Fitzgibbon	Hunter	Australian Labor Party	1984-12-01	1996-01-29	general_election	retired	10229		2012-10-17 05:32:08
187	1	Joel	Fitzgibbon	Hunter	Australian Labor Party	1996-03-02	9999-12-31	general_election	still_in_office	10230		2012-10-17 05:32:08
188	1	John	Fitzpatrick	Darling	Australian Labor Party	1969-10-25	1977-12-10	general_election		10231		2012-10-17 05:32:08
189	1	John	Fitzpatrick	Riverina	Australian Labor Party	1977-12-10	1980-09-19	general_election	retired	10231		2012-10-17 05:32:08
190	1	Frank	Ford	Dunkley	Liberal Party	1990-03-24	1993-03-13	general_election		10232		2012-10-17 05:32:08
191	1	John	Forrest	Mallee	National Party	1993-03-13	9999-12-31	general_election	still_in_office	10234		2012-10-17 05:32:08
192	1	Ross	Free	Lindsay	Australian Labor Party	1984-12-01	1996-03-02	general_election		10236		2012-10-17 05:32:08
193	1	Ross	Free	Macquarie	Australian Labor Party	1980-10-18	1984-12-01	general_election		10236		2012-10-17 05:32:08
194	1	Kenneth	Fry	Fraser	Australian Labor Party	1974-05-18	1984-10-26	general_election	retired	10237		2012-10-17 05:32:08
195	1	Chris	Gallus	Hawker	Liberal Party	1990-03-24	1993-03-13	general_election		10238		2012-10-17 05:32:08
196	1	Chris	Gallus	Hindmarsh	Liberal Party	1993-03-13	2004-08-31	general_election	retired	10238		2012-10-17 05:32:08
197	1	Teresa	Gambaro	Petrie	Liberal Party	1996-03-02	2007-11-24	general_election		10239		2012-10-17 05:32:08
198	1	Ransley	Garland	Curtin	Liberal Party	1969-04-19	1981-01-22	by_election	resigned	10240		2012-10-17 05:32:08
199	1	Peter	Garrett	Kingsford Smith	Australian Labor Party	2004-10-09	9999-12-31	general_election	still_in_office	10241		2012-10-17 05:32:08
200	1	Joanna	Gash	Gilmore	Liberal Party	1996-03-02	9999-12-31	general_election	still_in_office	10242		2012-10-17 05:32:08
201	1	John	Gayler	Leichhardt	Australian Labor Party	1983-03-05	1993-02-08	general_election	retired	10243		2012-10-17 05:32:08
202	1	George	Gear	Canning	Australian Labor Party	1984-12-01	1996-03-02	general_election		10244		2012-10-17 05:32:08
203	1	George	Gear	Tangney	Australian Labor Party	1983-03-05	1984-12-01	general_election		10244		2012-10-17 05:32:08
204	1	Steve	Georganas	Hindmarsh	Australian Labor Party	2004-10-09	9999-12-31	general_election	still_in_office	10245		2012-10-17 05:32:08
205	1	Jennie	George	Throsby	Australian Labor Party	2001-11-10	2010-08-21	general_election	retired	10246		2012-10-17 05:32:08
206	1	Petro	Georgiou	Kooyong	Liberal Party	1994-11-19	2010-08-21	by_election	retired	10248		2012-10-17 05:32:08
207	1	Jane	Gerick	Canning	Australian Labor Party	1998-10-03	2001-11-10	general_election		10249		2012-10-17 05:32:08
208	1	Steve	Gibbons	Bendigo	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10250		2012-10-17 05:32:08
209	1	Garrie	Gibson	Moreton	Australian Labor Party	1990-03-24	1996-03-02	general_election		10253		2012-10-17 05:32:08
210	1	Geoffrey	Giles	Angas	Liberal Party	1964-06-20	1977-12-10	by_election		10255		2012-10-17 05:32:08
211	1	Geoffrey	Giles	Wakefield	Liberal Party	1977-12-10	1983-02-04	general_election	retired	10255		2012-10-17 05:32:08
212	1	Julia	Gillard	Lalor	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10257		2012-10-17 05:32:08
213	1	Reginald	Gillard	Macquarie	Liberal Party	1975-12-13	1980-10-18	general_election		10258		2012-10-17 05:32:08
214	1	Bruce	Goodluck	Franklin	Liberal Party	1975-12-13	1993-02-08	general_election	retired	10259		2012-10-17 05:32:08
215	1	Russell	Gorman	Chifley	Australian Labor Party	1983-03-05	1984-12-01	general_election		10260		2012-10-17 05:32:08
216	1	Russell	Gorman	Greenway	Australian Labor Party	1984-12-01	1996-01-29	general_election	retired	10260		2012-10-17 05:32:08
217	1	Ted	Grace	Fowler	Australian Labor Party	1984-12-01	1998-08-31	general_election	retired	10261		2012-10-17 05:32:08
218	1	Elizabeth	Grace	Lilley	Liberal Party	1996-03-02	1998-10-03	general_election		10262		2012-10-17 05:32:08
219	1	Bruce	Graham	North Sydney	Liberal Party	1966-11-26	1980-09-19	general_election	retired	10263		2012-10-17 05:32:08
220	1	Bruce	Graham	St George	Liberal Party	1949-12-10	1954-05-29	general_election		10263		2012-10-17 05:32:08
221	1	Bruce	Graham	St George	Liberal Party	1955-12-10	1958-11-22	general_election		10263		2012-10-17 05:32:08
222	1	Gary	Gray	Brand	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10264		2012-10-17 05:32:08
223	1	Sharon	Grierson	Newcastle	Australian Labor Party	2001-11-10	9999-12-31	general_election	still_in_office	10266		2012-10-17 05:32:08
224	1	Alan	Griffin	Bruce	Australian Labor Party	1996-03-02	9999-12-31	general_election	still_in_office	10267		2012-10-17 05:32:08
225	1	Alan	Griffin	Corinella	Australian Labor Party	1993-03-13	1996-03-02	general_election		10267		2012-10-17 05:32:08
226	1	Alan	Griffiths	Maribyrnong	Australian Labor Party	1983-03-05	1996-01-29	general_election	retired	10268		2012-10-17 05:32:08
227	1	Raymond	Groom	Braddon	Liberal Party	1975-12-13	1984-10-26	general_election	retired	10270		2012-10-17 05:32:08
228	1	Barry	Haase	Kalgoorlie	Liberal Party	1998-10-03	2010-08-21	general_election		10272		2012-10-17 05:32:08
229	1	Damian	Hale	Solomon	Australian Labor Party	2007-11-24	2010-08-21	general_election		10274		2012-10-17 05:32:08
230	1	Jill	Hall	Shortland	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10275		2012-10-17 05:32:08
231	1	Raymond	Hall	Boothby	Liberal Party	1981-02-21	1996-01-29	by_election	retired	10276		2012-10-17 05:32:08
232	1	Robert	Halverson	Casey	Liberal Party	1984-12-01	1996-04-30	general_election	changed_party	10277		2012-10-17 05:32:08
233	1	Gerard	Hand	Melbourne	Australian Labor Party	1983-03-05	1993-02-08	general_election	retired	10279		2012-10-17 05:32:08
234	1	Pauline	Hanson	Oxley	Pauline Hanson's One Nation Party	1996-03-02	1998-10-03	general_election		10280		2012-10-17 05:32:08
235	1	Gary	Hardgrave	Moreton	Liberal Party	1996-03-02	2007-11-24	general_election		10281		2012-10-17 05:32:08
236	1	Graham	Harris	Chisholm	Liberal Party	1980-10-18	1983-03-05	general_election		10283		2012-10-17 05:32:08
237	1	Luke	Hartsuyker	Cowper	National Party	2001-11-10	9999-12-31	general_election	still_in_office	10285		2012-10-17 05:32:08
238	1	Elizabeth	Harvey	Hawker	Australian Labor Party	1987-07-11	1990-03-24	general_election		10286		2012-10-17 05:32:08
239	1	John	Haslem	Canberra	Liberal Party	1975-12-13	1980-10-18	general_election		10287		2012-10-17 05:32:08
240	1	Michael	Hatton	Blaxland	Australian Labor Party	1996-06-15	2007-10-17	by_election	retired	10288		2012-10-17 05:32:08
241	1	Christopher	Haviland	Macarthur	Australian Labor Party	1993-03-13	1996-01-29	general_election	retired	10289		2012-10-17 05:32:08
242	1	Alex	Hawke	Mitchell	Liberal Party	2007-11-24	9999-12-31	general_election	still_in_office	10290		2012-10-17 05:32:08
243	1	Robert	Hawke	Wills	Australian Labor Party	1980-10-18	1992-02-20	general_election	resigned	10291		2012-10-17 05:32:08
244	1	David	Hawker	Wannon	Liberal Party	1983-05-07	2004-11-15	by_election	changed_party	10292		2012-10-17 05:32:08
245	1	David	Hawker	Wannon	SPK	2004-11-16	2007-10-17	changed_party	changed_party	10292		2012-10-17 05:32:08
246	1	David	Hawker	Wannon	Liberal Party	2007-10-17	2010-08-21	changed_party	retired	10292		2012-10-17 05:32:08
247	1	William	Hayden	Oxley	Australian Labor Party	1961-12-09	1988-08-17	general_election	resigned	10293		2012-10-17 05:32:08
248	1	Chris	Hayes	Werriwa	Australian Labor Party	2005-03-19	2010-08-21	by_election		10294		2012-10-17 05:32:08
249	1	Stuart	Henry	Hasluck	Liberal Party	2004-10-09	2007-11-24	general_election		10298		2012-10-17 05:32:08
250	1	Marjorie	Henzell	Capricornia	Australian Labor Party	1993-03-13	1996-03-02	general_election		10299		2012-10-17 05:32:08
251	1	John	Hewson	Wentworth	Liberal Party	1987-07-11	1995-02-28	general_election	resigned	10301		2012-10-17 05:32:08
252	1	Noel	Hicks	Riverina	National Party	1993-03-13	1998-08-31	general_election	retired	10302		2012-10-17 05:32:08
253	1	Noel	Hicks	Riverina	National Party	1980-10-18	1984-12-01	general_election		10302		2012-10-17 05:32:08
254	1	Noel	Hicks	Riverina-Darling	National Party	1984-12-01	1993-03-13	general_election		10302		2012-10-17 05:32:08
255	1	Kelly	Hoare	Charlton	Australian Labor Party	1998-10-03	2007-10-17	general_election	retired	10305		2012-10-17 05:32:08
256	1	Joe	Hockey	North Sydney	Liberal Party	1996-03-02	9999-12-31	general_election	still_in_office	10306		2012-10-17 05:32:08
257	1	John	Hodges	Petrie	Liberal Party	1974-05-18	1983-03-05	general_election		10307		2012-10-17 05:32:08
258	1	John	Hodges	Petrie	Liberal Party	1984-12-01	1987-07-11	general_election		10307		2012-10-17 05:32:08
259	1	Michael	Hodgman	Denison	Liberal Party	1975-12-13	1987-07-11	general_election		10308		2012-10-17 05:32:08
260	1	Allan	Holding	Melbourne Ports	Australian Labor Party	1977-12-10	1998-08-31	general_election	retired	10310		2012-10-17 05:32:08
261	1	Colin	Hollis	Macarthur	Australian Labor Party	1983-03-05	1984-12-01	general_election		10311		2012-10-17 05:32:08
262	1	Colin	Hollis	Throsby	Australian Labor Party	1984-12-01	2001-10-08	general_election	retired	10311		2012-10-17 05:32:08
263	1	Bob	Horne	Paterson	Australian Labor Party	1993-03-13	1996-03-02	general_election		10312		2012-10-17 05:32:08
264	1	Bob	Horne	Paterson	Australian Labor Party	1998-10-03	2001-11-10	general_election		10312		2012-10-17 05:32:08
265	1	John	Howard	Bennelong	Liberal Party	1974-05-18	2007-11-24	general_election		10313		2012-10-17 05:32:08
266	1	Brian	Howe	Batman	Australian Labor Party	1977-12-10	1996-01-29	general_election	retired	10314		2012-10-17 05:32:08
267	1	Kay	Hull	Riverina	National Party	1998-10-03	2010-08-21	general_election	retired	10315		2012-10-17 05:32:08
268	1	Rob	Hulls	Kennedy	Australian Labor Party	1990-03-24	1993-03-13	general_election		10316		2012-10-17 05:32:08
269	1	Benjamin	Humphreys	Griffith	Australian Labor Party	1977-12-10	1996-01-29	general_election	retired	10317		2012-10-17 05:32:08
270	1	Greg	Hunt	Flinders	Liberal Party	2001-11-10	9999-12-31	general_election	still_in_office	10319		2012-10-17 05:32:08
271	1	Ralph	Hunt	Gwydir	National Party	1969-06-07	1989-02-24	by_election	resigned	10320		2012-10-17 05:32:08
272	1	Christopher	Hurford	Adelaide	Australian Labor Party	1969-10-25	1987-12-31	general_election	resigned	10321		2012-10-17 05:32:08
273	1	John	Hyde	Moore	Liberal Party	1974-05-18	1983-03-05	general_election		10324		2012-10-17 05:32:08
274	1	Urquhart	Innes	Melbourne	Australian Labor Party	1972-12-02	1983-02-04	general_election	retired	10325		2012-10-17 05:32:08
275	1	Steve	Irons	Swan	Liberal Party	2007-11-24	9999-12-31	general_election	still_in_office	10326		2012-10-17 05:32:08
276	1	Julia	Irwin	Fowler	Australian Labor Party	1998-10-03	2010-08-21	general_election	retired	10327		2012-10-17 05:32:08
277	1	Sharryn	Jackson	Hasluck	Australian Labor Party	2001-11-10	2004-10-09	general_election		10328		2012-10-17 05:32:08
278	1	Sharryn	Jackson	Hasluck	Australian Labor Party	2007-11-24	2010-08-21	general_election		10328		2012-10-17 05:32:08
279	1	Ralph	Jacobi	Hawker	Australian Labor Party	1969-10-25	1987-06-05	general_election	retired	10329		2012-10-17 05:32:08
280	1	Carolyn	Jakobsen	Cowan	Australian Labor Party	1984-12-01	1993-03-13	general_election		10330		2012-10-17 05:32:08
281	1	Albert	James	Hunter	Australian Labor Party	1960-04-09	1980-09-19	by_election	retired	10331		2012-10-17 05:32:08
282	1	Alan	Jarman	Deakin	Liberal Party	1966-11-26	1983-03-05	general_election		10332		2012-10-17 05:32:08
283	1	Susan	Jeanes	Kingston	Liberal Party	1996-03-02	1998-10-03	general_election		10333		2012-10-17 05:32:08
284	1	Henry	Jenkins	Scullin	Australian Labor Party	1969-10-25	1983-04-21	general_election	changed_party	10334		2012-10-17 05:32:08
285	1	Harry	Jenkins	Scullin	Australian Labor Party	1986-02-08	1993-05-04	by_election	changed_party	10335		2012-10-17 05:32:08
286	1	Harry	Jenkins	Scullin	CWM	1993-05-04	1996-01-29	changed_party	changed_party	10335		2012-10-17 05:32:08
287	1	Harry	Jenkins	Scullin	Australian Labor Party	1996-01-29	2008-02-11	changed_party	changed_party	10335		2012-10-17 05:32:08
288	1	Harry	Jenkins	Scullin	SPK	2008-02-12	2011-11-24	changed_party	changed_party	10335		2012-10-17 05:32:08
289	1	Dennis	Jensen	Tangney	Liberal Party	2004-10-09	9999-12-31	general_election	still_in_office	10337		2012-10-17 05:32:08
290	1	Gary	Johns	Petrie	Australian Labor Party	1987-07-11	1996-03-02	general_election		10339		2012-10-17 05:32:08
291	1	Leonard	Johnson	Burke	Australian Labor Party	1969-10-25	1980-09-19	general_election	retired	10340		2012-10-17 05:32:08
292	1	Leslie	Johnson	Hughes	Australian Labor Party	1955-12-10	1966-11-26	general_election		10341		2012-10-17 05:32:08
293	1	Leslie	Johnson	Hughes	Australian Labor Party	1969-10-25	1983-12-19	general_election	resigned	10341		2012-10-17 05:32:08
294	1	Michael	Johnson	Ryan	Liberal Party	2001-11-10	2010-08-21	general_election	changed_party	10342		2012-10-17 05:32:08
295	1	Peter	Johnson	Brisbane	Liberal Party	1975-12-13	1980-10-18	general_election		10343		2012-10-17 05:32:08
296	1	James	Johnston	Hotham	Liberal Party	1977-12-10	1980-10-18	general_election		10345		2012-10-17 05:32:08
297	1	Ricky	Johnston	Canning	Liberal Party	1996-03-02	1998-10-03	general_election		10346		2012-10-17 05:32:08
298	1	Barry	Jones	Lalor	Australian Labor Party	1977-12-10	1998-08-31	general_election	retired	10347		2012-10-17 05:32:08
299	1	Charles	Jones	Newcastle	Australian Labor Party	1958-11-22	1983-02-04	general_election	retired	10348		2012-10-17 05:32:08
300	1	David	Jull	Bowman	Liberal Party	1975-12-13	1983-03-05	general_election		10351		2012-10-17 05:32:08
301	1	David	Jull	Fadden	Liberal Party	1984-12-01	2007-10-17	general_election	retired	10351		2012-10-17 05:32:08
302	1	Bob	Katter	Kennedy	Independent	1993-03-13	9999-12-31	general_election	still_in_office	10352		2012-10-17 05:32:08
303	1	Robert	Katter	Kennedy	National Party	1966-11-26	1990-02-19	general_election	retired	10353		2012-10-17 05:32:08
304	1	Paul	Keating	Blaxland	Australian Labor Party	1969-10-25	1996-04-23	general_election	resigned	10354		2012-10-17 05:32:08
305	1	Michael	Keenan	Stirling	Liberal Party	2004-10-09	9999-12-31	general_election	still_in_office	10356		2012-10-17 05:32:08
306	1	De-Anne	Kelly	Dawson	National Party	1996-03-02	2007-11-24	general_election		10357		2012-10-17 05:32:08
307	1	Jackie	Kelly	Lindsay	Liberal Party	1996-10-19	2007-10-17	by_election	retired	10358		2012-10-17 05:32:08
308	1	Jackie	Kelly	Lindsay	Liberal Party	1996-03-02	1996-09-11	general_election	declared_void	10358		2012-10-17 05:32:08
309	1	Mike	Kelly	Eden-Monaro	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10359		2012-10-17 05:32:08
310	1	Roslyn	Kelly	Canberra	Australian Labor Party	1980-10-18	1995-01-30	general_election	resigned	10360		2012-10-17 05:32:08
311	1	David	Kemp	Goldstein	Liberal Party	1990-03-24	2004-08-31	general_election	retired	10362		2012-10-17 05:32:08
312	1	Leonard	Keogh	Bowman	Australian Labor Party	1983-03-05	1987-06-05	general_election	retired	10699		2012-10-17 05:32:08
313	1	Lewis	Kent	Hotham	Australian Labor Party	1980-10-18	1990-03-24	general_election		10363		2012-10-17 05:32:08
314	1	John	Kerin	Werriwa	Australian Labor Party	1978-09-23	1993-12-22	by_election	resigned	10700		2012-10-17 05:32:08
315	1	Cheryl	Kernot	Dickson	Australian Labor Party	1998-10-03	2001-11-10	general_election		10364		2012-10-17 05:32:08
316	1	Duncan	Kerr	Denison	Australian Labor Party	1987-07-11	2010-08-21	general_election	retired	10365		2012-10-17 05:32:08
317	1	Denis	Killen	Moreton	Liberal Party	1955-12-10	1983-08-15	general_election	resigned	10367		2012-10-17 05:32:08
318	1	Catherine	King	Ballarat	Australian Labor Party	2001-11-10	9999-12-31	general_election	still_in_office	10368	Ms	2012-10-17 05:32:08
319	1	Peter	King	Wentworth	Independent	2001-11-10	2004-10-09	general_election		10369	Mr	2012-10-17 05:32:08
320	1	Richard	Klugman	Prospect	Australian Labor Party	1969-10-25	1990-02-19	general_election	retired	10371		2012-10-17 05:32:08
321	1	Peter	Knott	Gilmore	Australian Labor Party	1993-03-13	1996-03-02	general_election		10373		2012-10-17 05:32:08
322	1	Antony	Lamb	La Trobe	Australian Labor Party	1972-12-02	1975-12-13	general_election		10376		2012-10-17 05:32:08
323	1	Antony	Lamb	Streeton	Australian Labor Party	1984-12-01	1990-03-24	general_election		10376		2012-10-17 05:32:08
324	1	Andrew	Laming	Bowman	Liberal Party	2004-10-09	9999-12-31	general_election	still_in_office	10377		2012-10-17 05:32:08
325	1	John	Langmore	Fraser	Australian Labor Party	1984-12-01	1996-12-06	general_election	resigned	10378		2012-10-17 05:32:08
326	1	Mark	Latham	Werriwa	Australian Labor Party	1994-01-29	2005-01-21	by_election	resigned	10379		2012-10-17 05:32:08
327	1	Michael	Lavarch	Dickson	Australian Labor Party	1993-04-17	1996-03-02	general_election		10381		2012-10-17 05:32:08
328	1	Michael	Lavarch	Fisher	Australian Labor Party	1987-07-11	1993-03-13	general_election		10381		2012-10-17 05:32:08
329	1	Anthony	Lawler	Parkes	National Party	1998-10-03	2001-10-08	general_election	retired	10382		2012-10-17 05:32:08
330	1	Carmen	Lawrence	Fremantle	Australian Labor Party	1994-03-12	2007-10-17	by_election	retired	10383		2012-10-17 05:32:08
331	1	Michael	Lee	Dobell	Australian Labor Party	1984-12-01	2001-11-10	general_election		10384		2012-10-17 05:32:08
332	1	Sussan	Ley	Farrer	Liberal Party	2001-11-10	9999-12-31	general_election	still_in_office	10387		2012-10-17 05:32:08
333	1	Louis	Lieberman	Indi	Liberal Party	1993-03-13	2001-10-08	general_election	retired	10388		2012-10-17 05:32:08
334	1	Eamon	Lindsay	Herbert	Australian Labor Party	1983-03-05	1996-03-02	general_election		10390		2012-10-17 05:32:08
335	1	Peter	Lindsay	Herbert	Liberal Party	1996-03-02	2010-08-21	general_election	retired	10391		2012-10-17 05:32:08
336	1	Kirsten	Livermore	Capricornia	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10392		2012-10-17 05:32:08
337	1	Bruce	Lloyd	Murray	National Party	1971-03-20	1996-01-29	by_election	retired	10393		2012-10-17 05:32:08
338	1	Jim	Lloyd	Robertson	Liberal Party	1996-03-02	2007-11-24	general_election		10394		2012-10-17 05:32:08
339	1	Philip	Lucock	Lyne	National Country Party	1952-03-22	1980-09-19	by_election	retired	10396		2012-10-17 05:32:08
340	1	Stephen	Lusher	Hume	National Party	1974-05-18	1984-12-01	general_election		10399		2012-10-17 05:32:08
341	1	Phillip	Lynch	Flinders	Liberal Party	1966-11-26	1982-10-22	general_election	resigned	10400		2012-10-17 05:32:08
342	1	Ian	Macfarlane	Groom	Liberal Party	1998-10-03	9999-12-31	general_election	still_in_office	10403		2012-10-17 05:32:08
343	1	Edward	Mack	North Sydney	Independent	1990-03-24	1996-01-29	general_election	retired	10405		2012-10-17 05:32:08
344	1	Michael	Mackellar	Warringah	Liberal Party	1969-10-25	1994-02-18	general_election	resigned	10407		2012-10-17 05:32:08
345	1	Alexander	Mackenzie	Calare	National Party	1975-12-13	1983-03-05	general_election		10408		2012-10-17 05:32:08
346	1	Jenny	Macklin	Jagajaga	Australian Labor Party	1996-03-02	9999-12-31	general_election	still_in_office	10409		2012-10-17 05:32:08
347	1	Ian	Macphee	Balaclava	Liberal Party	1974-05-18	1984-12-01	general_election		10411		2012-10-17 05:32:08
348	1	Ian	Macphee	Goldstein	Liberal Party	1984-12-01	1990-02-19	general_election	retired	10411		2012-10-17 05:32:08
349	1	Michael	Maher	Lowe	Australian Labor Party	1982-03-13	1987-07-11	by_election		10413		2012-10-17 05:32:08
350	1	Paul	Marek	Capricornia	National Party	1996-03-02	1998-10-03	general_election		10414		2012-10-17 05:32:08
351	1	Nola	Marino	Forrest	Liberal Party	2007-11-24	9999-12-31	general_election	still_in_office	10416		2012-10-17 05:32:08
352	1	Louise	Markus	Greenway	Liberal Party	2004-10-09	2010-08-21	general_election		10417		2012-10-17 05:32:08
353	1	Richard	Marles	Corio	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10418		2012-10-17 05:32:08
354	1	Stephen	Martin	Cunningham	Australian Labor Party	1993-03-13	1993-05-04	general_election	changed_party	10420		2012-10-17 05:32:08
355	1	Stephen	Martin	Macarthur	Australian Labor Party	1984-12-01	1993-03-13	general_election		10420		2012-10-17 05:32:08
356	1	Vincent	Martin	Banks	Australian Labor Party	1969-10-25	1980-09-19	general_election	retired	10421		2012-10-17 05:32:08
357	1	John	Martyr	Swan	Liberal Party	1975-12-13	1980-10-18	general_election		10422		2012-10-17 05:32:08
358	1	Margaret	May	McPherson	Liberal Party	1998-10-03	2010-08-21	general_election	retired	10426		2012-10-17 05:32:08
359	1	Helen	Mayer	Chisholm	Australian Labor Party	1983-03-05	1987-07-11	general_election		10427		2012-10-17 05:32:08
360	1	Stewart	McArthur	Corangamite	Liberal Party	1984-02-18	2007-11-24	by_election		10428		2012-10-17 05:32:08
361	1	Robert	McClelland	Barton	Australian Labor Party	1996-03-02	9999-12-31	general_election	still_in_office	10431		2012-10-17 05:32:08
362	1	Graeme	McDougall	Griffith	Liberal Party	1996-03-02	1998-10-03	general_election		10432		2012-10-17 05:32:08
363	1	Jann	McFarlane	Stirling	Australian Labor Party	1998-10-03	2004-10-09	general_election		10434		2012-10-17 05:32:08
364	1	Peter	McGauran	Gippsland	National Party	1983-03-05	2008-04-09	general_election	retired	10436		2012-10-17 05:32:08
365	1	Jeannette	McHugh	Grayndler	Australian Labor Party	1993-03-13	1996-01-29	general_election	retired	10437		2012-10-17 05:32:08
366	1	Jeannette	McHugh	Phillip	Australian Labor Party	1983-03-05	1993-03-13	general_election		10437		2012-10-17 05:32:08
367	1	Maxine	McKew	Bennelong	Australian Labor Party	2007-11-24	2010-08-21	general_election		10439		2012-10-17 05:32:08
368	1	Ian	McLachlan	Barker	Liberal Party	1990-03-24	1998-08-31	general_election	retired	10441		2012-10-17 05:32:08
369	1	Ross	McLean	Perth	Liberal Party	1975-12-13	1983-03-05	general_election		10444		2012-10-17 05:32:08
370	1	John	McLeay	Boothby	Liberal Party	1966-11-26	1981-01-22	general_election	resigned	10445		2012-10-17 05:32:08
371	1	Leo	McLeay	Grayndler	Australian Labor Party	1979-06-23	1989-08-29	by_election	changed_party	10446		2012-10-17 05:32:08
372	1	Leo	McLeay	Watson	SPK	1993-03-13	1993-05-04	general_election	changed_party	10446		2012-10-17 05:32:08
373	1	James	McMahon	Sydney	Australian Labor Party	1975-12-13	1983-02-04	general_election	retired	10448		2012-10-17 05:32:08
374	1	William	McMahon	Lowe	Liberal Party	1949-12-10	1982-01-04	general_election	resigned	10449		2012-10-17 05:32:08
375	1	Bob	McMullan	Fraser	Australian Labor Party	1998-10-03	2010-08-21	general_election	retired	10450		2012-10-17 05:32:08
376	1	Daniel	McVeigh	Darling Downs	National Party	1972-12-02	1984-12-01	general_election		10451		2012-10-17 05:32:08
377	1	Daniel	McVeigh	Groom	National Party	1984-12-01	1988-02-29	general_election	resigned	10451		2012-10-17 05:32:08
378	1	Daryl	Melham	Banks	Australian Labor Party	1990-03-24	9999-12-31	general_election	still_in_office	10452		2012-10-17 05:32:08
379	1	John	Mildren	Ballarat	Australian Labor Party	1980-10-18	1990-03-24	general_election		10455		2012-10-17 05:32:08
380	1	Chris	Miles	Braddon	Liberal Party	1984-12-01	1998-10-03	general_election		10456		2012-10-17 05:32:08
381	1	Percival	Millar	Wide Bay	National Party	1974-05-18	1990-02-19	general_election	retired	10457		2012-10-17 05:32:08
382	1	Peter	Milton	La Trobe	Australian Labor Party	1980-10-18	1990-03-24	general_election		10459		2012-10-17 05:32:08
383	1	Sophie	Mirabella	Indi	Liberal Party	2001-11-10	9999-12-31	general_election	still_in_office	10461		2012-10-17 05:32:08
384	1	John	Moore	Ryan	Liberal Party	1975-12-13	2001-02-05	general_election	resigned	10464		2012-10-17 05:32:08
385	1	Allan	Morris	Newcastle	Australian Labor Party	1983-03-05	2001-10-08	general_election	retired	10465		2012-10-17 05:32:08
386	1	Peter	Morris	Shortland	Australian Labor Party	1972-12-02	1998-08-31	general_election	retired	10467		2012-10-17 05:32:08
387	1	William	Morrison	St George	Australian Labor Party	1980-10-18	1984-10-26	general_election	retired	10701		2012-10-17 05:32:08
388	1	Scott	Morrison	Cook	Liberal Party	2007-11-24	9999-12-31	general_election	still_in_office	10468		2012-10-17 05:32:08
389	1	Frank	Mossfield	Greenway	Australian Labor Party	1996-03-02	2004-08-31	general_election	retired	10469		2012-10-17 05:32:08
390	1	John	Mountford	Banks	Australian Labor Party	1980-10-18	1990-02-19	general_election	retired	10470		2012-10-17 05:32:08
391	1	Judi	Moylan	Pearce	Liberal Party	1993-03-13	9999-12-31	general_election	still_in_office	10471		2012-10-17 05:32:08
392	1	John	Murphy	Lowe	Australian Labor Party	1998-10-03	2010-08-21	general_election		10473		2012-10-17 05:32:08
393	1	Stephen	Mutch	Cook	Liberal Party	1996-03-02	1998-08-31	general_election	retired	10476		2012-10-17 05:32:08
394	1	Gary	Nairn	Eden-Monaro	Liberal Party	1996-03-02	2007-11-24	general_election		10477		2012-10-17 05:32:08
395	1	Belinda	Neal	Robertson	Australian Labor Party	2007-11-24	2010-08-21	general_election	retired	10479		2012-10-17 05:32:08
396	1	Garry	Nehl	Cowper	National Party	1984-12-01	1996-04-30	general_election	changed_party	10481		2012-10-17 05:32:08
397	1	Garry	Nehl	Cowper	CWM	1996-04-30	2001-10-08	changed_party	retired	10481		2012-10-17 05:32:08
398	1	Maurice	Neil	St George	Liberal Party	1975-12-13	1980-10-18	general_election		10482		2012-10-17 05:32:08
399	1	Brendan	Nelson	Bradfield	Liberal Party	1996-03-02	2009-10-19	general_election	resigned	10483		2012-10-17 05:32:08
400	1	Shayne	Neumann	Blair	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10485		2012-10-17 05:32:08
401	1	Paul	Neville	Hinkler	National Party	1993-03-13	9999-12-31	general_election	still_in_office	10486		2012-10-17 05:32:08
402	1	Neville	Newell	Richmond	Australian Labor Party	1990-03-24	1996-03-02	general_election		10487		2012-10-17 05:32:08
403	1	Kevin	Newman	Bass	Liberal Party	1975-06-28	1984-10-26	by_election	retired	10489		2012-10-17 05:32:08
404	1	Peter	Nixon	Gippsland	National Party	1961-12-09	1983-02-04	general_election	retired	10490		2012-10-17 05:32:08
405	1	Peter	Nugent	Aston	Liberal Party	1990-03-24	2001-04-24	general_election	died	10491		2012-10-17 05:32:08
406	1	Michelle	O'Byrne	Bass	Australian Labor Party	1998-10-03	2004-10-09	general_election		10494		2012-10-17 05:32:08
407	1	Brendan	O'Connor	Burke	Australian Labor Party	2001-11-10	2004-10-09	general_election		10496		2012-10-17 05:32:08
408	1	Brendan	O'Connor	Gorton	Australian Labor Party	2004-10-09	9999-12-31	general_election	still_in_office	10496		2012-10-17 05:32:08
409	1	Gavan	O'Connor	Corio	Australian Labor Party	1993-03-13	2007-11-24	general_election		10497		2012-10-17 05:32:08
410	1	Frank	O'Keefe	Paterson	National Party	1969-10-25	1984-10-26	general_election	retired	10498		2012-10-17 05:32:08
411	1	Neil	O'Keefe	Burke	Australian Labor Party	1984-12-01	2001-10-08	general_election	retired	10499		2012-10-17 05:32:08
412	1	Lloyd	O'Neil	Grey	Australian Labor Party	1983-03-05	1993-02-08	general_election	retired	10500		2012-10-17 05:32:08
413	1	Michael	Organ	Cunningham	Australian Greens	2002-10-19	2004-10-09	by_election		10502		2012-10-17 05:32:08
414	1	Julie	Owens	Parramatta	Australian Labor Party	2004-10-09	9999-12-31	general_election	still_in_office	10503		2012-10-17 05:32:08
415	1	Melissa	Parke	Fremantle	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10506		2012-10-17 05:32:08
416	1	Andrew	Peacock	Kooyong	Liberal Party	1966-04-02	1994-09-17	by_election	resigned	10510		2012-10-17 05:32:08
417	1	Chris	Pearce	Aston	Liberal Party	2001-07-14	2010-08-21	by_election	retired	10511		2012-10-17 05:32:08
418	1	Graham	Perrett	Moreton	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10512		2012-10-17 05:32:08
419	1	Tanya	Plibersek	Sydney	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10513		2012-10-17 05:32:08
420	1	Reginald	Pollard	Ballarat	Australian Labor Party	1937-10-23	1949-12-10	general_election		10514		2012-10-17 05:32:08
421	1	Reginald	Pollard	Lalor	Australian Labor Party	1949-12-10	1966-11-26	general_election		10514		2012-10-17 05:32:08
422	1	James	Porter	Barker	Liberal Party	1975-12-13	1990-02-19	general_election	retired	10516		2012-10-17 05:32:08
423	1	Michael	Pratt	Adelaide	Liberal Party	1988-02-06	1990-03-24	by_election		10518		2012-10-17 05:32:08
424	1	Roger	Price	Chifley	Australian Labor Party	1984-12-01	2010-08-21	general_election	retired	10519		2012-10-17 05:32:08
425	1	Geoff	Prosser	Forrest	Liberal Party	1987-07-11	2007-10-17	general_election	retired	10521		2012-10-17 05:32:08
426	1	Gary	Punch	Barton	Australian Labor Party	1983-03-05	1996-01-29	general_election	retired	10522		2012-10-17 05:32:08
427	1	Christopher	Pyne	Sturt	Liberal Party	1993-03-13	9999-12-31	general_election	still_in_office	10524		2012-10-17 05:32:08
428	1	Harry	Quick	Franklin	Independent	1993-03-13	2007-10-17	general_election	retired	10525		2012-10-17 05:32:08
429	1	Brett	Raguse	Forde	Australian Labor Party	2007-11-24	2010-08-21	general_election		10528		2012-10-17 05:32:08
430	1	Rowan	Ramsey	Grey	Liberal Party	2007-11-24	9999-12-31	general_election	still_in_office	10529		2012-10-17 05:32:08
431	1	Don	Randall	Canning	Liberal Party	2001-11-10	9999-12-31	general_election	still_in_office	10530		2012-10-17 05:32:08
432	1	Don	Randall	Swan	Liberal Party	1996-03-02	1998-10-03	general_election		10530		2012-10-17 05:32:08
433	1	Kerry	Rea	Bonner	Australian Labor Party	2007-11-24	2010-08-21	general_election		10532		2012-10-17 05:32:08
434	1	John	Reeves	Northern Territory	Australian Labor Party	1983-03-05	1984-12-01	general_election		10533		2012-10-17 05:32:08
435	1	Nicholas	Reid	Bendigo	Liberal Party	1990-03-24	1998-08-31	general_election	retired	10535		2012-10-17 05:32:08
436	1	Peter	Reith	Flinders	Liberal Party	1984-12-01	2001-10-08	general_election	retired	10536		2012-10-17 05:32:08
437	1	Peter	Reith	Flinders	Liberal Party	1982-12-04	1983-03-05	by_election		10536		2012-10-17 05:32:08
438	1	Kym	Richardson	Kingston	Liberal Party	2004-10-09	2007-11-24	general_election		10539		2012-10-17 05:32:08
439	1	John	Riggall	McMillan	Liberal Party	1990-03-24	1993-03-13	general_election		10541		2012-10-17 05:32:08
440	1	Bernie	Ripoll	Oxley	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10542		2012-10-17 05:32:08
441	1	Amanda	Rishworth	Kingston	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10543		2012-10-17 05:32:08
442	1	Andrew	Robb	Goldstein	Liberal Party	2004-10-09	9999-12-31	general_election	still_in_office	10544		2012-10-17 05:32:08
443	1	Stuart	Robert	Fadden	Liberal Party	2007-11-24	9999-12-31	general_election	still_in_office	10545		2012-10-17 05:32:08
444	1	Eric	Robinson	McPherson	Liberal Party	1972-12-02	1981-01-07	general_election	died	10547		2012-10-17 05:32:08
445	1	Ian	Robinson	Cowper	National Party	1963-11-30	1984-12-01	general_election		10548		2012-10-17 05:32:08
446	1	Ian	Robinson	Page	National Party	1984-12-01	1990-03-24	general_election		10548		2012-10-17 05:32:08
447	1	Allan	Rocher	Curtin	Independent	1981-02-21	1998-10-03	by_election		10549		2012-10-17 05:32:08
448	1	Michael	Ronaldson	Ballarat	Liberal Party	1990-03-24	2001-10-08	general_election	retired	10550		2012-10-17 05:32:08
449	1	Nicola	Roxon	Gellibrand	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10551		2012-10-17 05:32:08
450	1	Kevin	Rudd	Griffith	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10552		2012-10-17 05:32:08
451	1	Philip	Ruddock	Berowra	Liberal Party	1993-03-13	9999-12-31	general_election	still_in_office	10553		2012-10-17 05:32:08
452	1	Philip	Ruddock	Dundas	Liberal Party	1975-12-13	1993-03-13	general_election		10553		2012-10-17 05:32:08
453	1	Philip	Ruddock	Parramatta	Liberal Party	1973-09-22	1975-12-13	by_election		10553		2012-10-17 05:32:08
454	1	Janelle	Saffin	Page	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10555		2012-10-17 05:32:08
455	1	Murray	Sainsbury	Eden-Monaro	Liberal Party	1975-12-13	1983-03-05	general_election		10556		2012-10-17 05:32:08
456	1	John	Saunderson	Aston	Australian Labor Party	1984-12-01	1990-03-24	general_election		10559		2012-10-17 05:32:08
457	1	John	Saunderson	Deakin	Australian Labor Party	1983-03-05	1984-12-01	general_election		10559		2012-10-17 05:32:08
458	1	Rod	Sawford	Port Adelaide	Australian Labor Party	1988-03-26	2007-10-17	by_election	retired	10560		2012-10-17 05:32:08
459	1	Gordon	Scholes	Corio	Australian Labor Party	1967-07-22	1993-02-08	by_election	retired	10562		2012-10-17 05:32:08
460	1	Alby	Schultz	Hume	Liberal Party	1998-10-03	9999-12-31	general_election	still_in_office	10563		2012-10-17 05:32:08
461	1	Con	Sciacca	Bowman	Australian Labor Party	1998-10-03	2004-10-09	general_election		10564		2012-10-17 05:32:08
462	1	Con	Sciacca	Bowman	Australian Labor Party	1987-07-11	1996-03-02	general_election		10564		2012-10-17 05:32:08
463	1	Bruce	Scott	Maranoa	National Party	1990-03-24	9999-12-31	general_election	still_in_office	10565		2012-10-17 05:32:08
464	1	John	Scott	Hindmarsh	Australian Labor Party	1980-10-18	1993-02-08	general_election	retired	10567		2012-10-17 05:32:08
465	1	Leslie	Scott	Oxley	Australian Labor Party	1988-10-08	1996-03-02	by_election		10568		2012-10-17 05:32:08
466	1	Patrick	Secker	Barker	Liberal Party	1998-10-03	9999-12-31	general_election	still_in_office	10570		2012-10-17 05:32:08
467	1	Bob	Sercombe	Maribyrnong	Australian Labor Party	1996-03-02	2007-10-17	general_election	retired	10571		2012-10-17 05:32:08
468	1	Peter	Shack	Tangney	Liberal Party	1984-12-01	1993-02-08	general_election	retired	10572		2012-10-17 05:32:08
469	1	Peter	Shack	Tangney	Liberal Party	1977-12-10	1983-03-05	general_election		10572		2012-10-17 05:32:08
470	1	John	Sharp	Gilmore	National Party	1984-12-01	1993-03-13	general_election		10573		2012-10-17 05:32:08
471	1	John	Sharp	Hume	National Party	1993-03-13	1998-08-31	general_election	retired	10573		2012-10-17 05:32:08
472	1	George	Shaw	Dawson	National Country Party	1963-11-30	1966-01-09	general_election	died	10574		2012-10-17 05:32:08
473	1	Roger	Shipton	Higgins	Liberal Party	1975-12-13	1990-02-19	general_election	retired	10577		2012-10-17 05:32:08
474	1	Jim	Short	Ballarat	Liberal Party	1975-12-13	1980-10-18	general_election		10578		2012-10-17 05:32:08
475	1	Leonie	Short	Ryan	Australian Labor Party	2001-03-17	2001-11-10	by_election		10579		2012-10-17 05:32:08
476	1	Bill	Shorten	Maribyrnong	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10580		2012-10-17 05:32:08
477	1	Sid	Sidebottom	Braddon	Australian Labor Party	1998-10-03	2004-10-09	general_election		10583		2012-10-17 05:32:08
478	1	Sid	Sidebottom	Braddon	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10583		2012-10-17 05:32:08
479	1	David	Simmons	Calare	Australian Labor Party	1983-03-05	1996-01-29	general_election	retired	10586		2012-10-17 05:32:08
480	1	Barry	Simon	McMillan	Liberal Party	1975-12-13	1980-10-18	general_election		10587		2012-10-17 05:32:08
481	1	Luke	Simpkins	Cowan	Liberal Party	2007-11-24	9999-12-31	general_election	still_in_office	10588		2012-10-17 05:32:08
482	1	Ian	Sinclair	New England	National Party	1963-11-30	1998-03-04	general_election	changed_party	10589		2012-10-17 05:32:08
483	1	Peter	Slipper	Fisher	National Party	1984-12-01	1987-07-11	general_election		10590		2012-10-17 05:32:08
484	1	Peter	Slipper	Fisher	Liberal Party	1993-03-13	2011-11-24	general_election	changed_party	10590		2012-10-17 05:32:08
485	1	Anthony	Smith	Dickson	Independent	1996-03-02	1998-10-03	general_election		10591		2012-10-17 05:32:08
486	1	Tony	Smith	Casey	Liberal Party	2001-11-10	9999-12-31	general_election	still_in_office	10592		2012-10-17 05:32:08
487	1	Silvia	Smith	Bass	Australian Labor Party	1993-03-13	1996-03-02	general_election		10593		2012-10-17 05:32:08
488	1	Stephen	Smith	Perth	Australian Labor Party	1993-03-13	9999-12-31	general_election	still_in_office	10594		2012-10-17 05:32:08
489	1	Warwick	Smith	Bass	Liberal Party	1996-03-02	1998-10-03	general_election		10595		2012-10-17 05:32:08
490	1	Warwick	Smith	Bass	Liberal Party	1984-12-01	1993-03-13	general_election		10595		2012-10-17 05:32:08
491	1	Brendan	Smyth	Canberra	Liberal Party	1995-03-25	1996-03-02	by_election		10596		2012-10-17 05:32:08
492	1	Billy	Snedden	Bruce	Liberal Party	1955-12-10	1976-02-17	general_election	changed_party	10597		2012-10-17 05:32:08
493	1	James	Snow	Eden-Monaro	Australian Labor Party	1983-03-05	1996-03-02	general_election		10598		2012-10-17 05:32:08
494	1	Warren	Snowdon	Lingiari	Australian Labor Party	2001-11-10	9999-12-31	general_election	still_in_office	10599		2012-10-17 05:32:08
495	1	Warren	Snowdon	Northern Territory	Australian Labor Party	1987-07-11	1996-03-02	general_election		10599		2012-10-17 05:32:08
496	1	Warren	Snowdon	Northern Territory	Australian Labor Party	1998-10-03	2001-11-10	general_election		10599		2012-10-17 05:32:08
497	1	Alex	Somlyay	Fairfax	Liberal Party	1990-03-24	9999-12-31	general_election	still_in_office	10600		2012-10-17 05:32:08
498	1	Andrew	Southcott	Boothby	Liberal Party	1996-03-02	9999-12-31	general_election	still_in_office	10601		2012-10-17 05:32:08
499	1	John	Spender	North Sydney	Liberal Party	1980-10-18	1990-03-24	general_election		10603		2012-10-17 05:32:08
500	1	Clair	St	New England	National Party	1998-10-03	2001-11-10	general_election		10605		2012-10-17 05:32:08
501	1	Anthony	Staley	Chisholm	Liberal Party	1970-09-19	1980-09-19	by_election	retired	10606		2012-10-17 05:32:08
502	1	Peter	Staples	Diamond Valley	Australian Labor Party	1983-03-05	1984-12-01	general_election		10607		2012-10-17 05:32:08
503	1	Peter	Staples	Jagajaga	Australian Labor Party	1984-12-01	1996-01-29	general_election	retired	10607		2012-10-17 05:32:08
504	1	Alan	Steedman	Casey	Australian Labor Party	1983-03-05	1984-12-01	general_election		10608		2012-10-17 05:32:08
505	1	Sharman	Stone	Murray	Liberal Party	1996-03-02	9999-12-31	general_election	still_in_office	10612		2012-10-17 05:32:08
506	1	Anthony	Street	Corangamite	Liberal Party	1966-11-26	1984-01-18	general_election	resigned	10614		2012-10-17 05:32:08
507	1	Jon	Sullivan	Longman	Australian Labor Party	2007-11-24	2010-08-21	general_election		10615		2012-10-17 05:32:08
508	1	Kathy	Sullivan	Moncrieff	Liberal Party	1984-12-01	2001-10-08	general_election	retired	10616		2012-10-17 05:32:08
509	1	Wayne	Swan	Lilley	Australian Labor Party	1993-03-13	1996-03-02	general_election		10617		2012-10-17 05:32:08
510	1	Wayne	Swan	Lilley	Australian Labor Party	1998-10-03	9999-12-31	general_election	still_in_office	10617		2012-10-17 05:32:08
511	1	Mike	Symon	Deakin	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10618		2012-10-17 05:32:08
512	1	Grant	Tambling	Northern Territory	National Party	1980-10-18	1983-03-05	general_election		10620		2012-10-17 05:32:08
513	1	Lindsay	Tanner	Melbourne	Australian Labor Party	1993-03-13	2010-08-21	general_election	retired	10621		2012-10-17 05:32:08
514	1	William	Taylor	Groom	Liberal Party	1988-04-09	1998-08-31	by_election	retired	10623		2012-10-17 05:32:08
515	1	Andrew	Theophanous	Burke	Australian Labor Party	1980-10-18	1984-12-01	general_election		10626		2012-10-17 05:32:08
516	1	Andrew	Theophanous	Calwell	Independent	1984-12-01	2001-11-10	general_election		10626		2012-10-17 05:32:08
517	1	Cameron	Thompson	Blair	Liberal Party	1998-10-03	2007-11-24	general_election		10628		2012-10-17 05:32:08
518	1	Andrew	Thomson	Wentworth	Liberal Party	1995-04-08	2001-10-08	by_election	retired	10629		2012-10-17 05:32:08
519	1	Craig	Thomson	Dobell	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10630		2012-10-17 05:32:08
520	1	David	Thomson	Leichhardt	National Party	1975-12-13	1983-03-05	general_election		10631		2012-10-17 05:32:08
521	1	Kelvin	Thomson	Wills	Australian Labor Party	1996-03-02	9999-12-31	general_election	still_in_office	10632		2012-10-17 05:32:08
522	1	Ken	Ticehurst	Dobell	Liberal Party	2001-11-10	2007-11-24	general_election		10633		2012-10-17 05:32:08
523	1	Robert	Tickner	Hughes	Australian Labor Party	1984-02-18	1996-03-02	by_election		10634		2012-10-17 05:32:08
524	1	Dave	Tollner	Solomon	Country Liberal Party	2001-11-10	2007-11-24	general_election		10636		2012-10-17 05:32:08
525	1	Chris	Trevor	Flynn	Australian Labor Party	2007-11-24	2010-08-21	general_election		10638		2012-10-17 05:32:08
526	1	Warren	Truss	Wide Bay	National Party	1990-03-24	9999-12-31	general_election	still_in_office	10641		2012-10-17 05:32:08
527	1	Wilson	Tuckey	O'Connor	Liberal Party	1980-10-18	2010-08-21	general_election		10642		2012-10-17 05:32:08
528	1	Malcolm	Turnbull	Wentworth	Liberal Party	2004-10-09	9999-12-31	general_election	still_in_office	10643		2012-10-17 05:32:08
529	1	Jim	Turnour	Leichhardt	Australian Labor Party	2007-11-24	2010-08-21	general_election		10644		2012-10-17 05:32:08
530	1	Thomas	Uren	Reid	Australian Labor Party	1958-11-22	1990-02-19	general_election	retired	10645		2012-10-17 05:32:08
531	1	Mark	Vaile	Lyne	National Party	1993-03-13	2008-07-30	general_election	resigned	10646		2012-10-17 05:32:08
532	1	Danna	Vale	Hughes	Liberal Party	1996-03-02	2010-08-21	general_election	retired	10647		2012-10-17 05:32:08
533	1	Maria	Vamvakinou	Calwell	Australian Labor Party	2001-11-10	9999-12-31	general_election	still_in_office	10649		2012-10-17 05:32:08
534	1	Ross	Vasta	Bonner	Liberal Party	2004-10-09	2007-11-24	general_election		10651		2012-10-17 05:32:08
535	1	Robert	Viner	Stirling	Liberal Party	1972-12-02	1983-03-05	general_election		10653		2012-10-17 05:32:08
536	1	Barry	Wakelin	Grey	Liberal Party	1993-03-13	2007-10-17	general_election	retired	10654		2012-10-17 05:32:08
537	1	Francis	Walker	Robertson	Australian Labor Party	1990-03-24	1996-03-02	general_election		10655		2012-10-17 05:32:08
538	1	Laurie	Wallis	Grey	Australian Labor Party	1969-10-25	1983-02-04	general_election	retired	10656		2012-10-17 05:32:08
539	1	Mal	Washer	Moore	Liberal Party	1998-10-03	9999-12-31	general_election	still_in_office	10659		2012-10-17 05:32:08
540	1	David	Watson	Forde	Liberal Party	1984-12-01	1987-07-11	general_election		10660		2012-10-17 05:32:08
541	1	Alasdair	Webster	Macquarie	Liberal Party	1984-12-01	1993-03-13	general_election		10663		2012-10-17 05:32:08
542	1	Deane	Wells	Petrie	Australian Labor Party	1983-03-05	1984-12-01	general_election		10665		2012-10-17 05:32:08
543	1	Andrea	West	Bowman	Liberal Party	1996-03-02	1998-10-03	general_election		10666		2012-10-17 05:32:08
544	1	Stewart	West	Cunningham	Australian Labor Party	1977-10-15	1993-02-08	by_election	retired	10667		2012-10-17 05:32:08
545	1	Peter	White	McPherson	Liberal Party	1981-02-21	1990-02-19	by_election	retired	10671		2012-10-17 05:32:08
546	1	Kim	Wilkie	Swan	Australian Labor Party	1998-10-03	2007-11-24	general_election		10672		2012-10-17 05:32:08
547	1	Daryl	Williams	Tangney	Liberal Party	1993-03-13	2004-08-31	general_election	retired	10673		2012-10-17 05:32:08
548	1	Ralph	Willis	Gellibrand	Australian Labor Party	1972-12-02	1998-08-31	general_election	retired	10674		2012-10-17 05:32:08
549	1	Ian	Wilson	Sturt	Liberal Party	1972-12-02	1993-02-08	general_election	retired	10702		2012-10-17 05:32:08
550	1	Gregory	Wilton	Isaacs	Australian Labor Party	1996-03-02	2000-06-14	general_election	died	10675		2012-10-17 05:32:08
551	1	Tony	Windsor	New England	Independent	2001-11-10	9999-12-31	general_election	still_in_office	10676		2012-10-17 05:32:08
552	1	Jason	Wood	La Trobe	Liberal Party	2004-10-09	2010-08-21	general_election		10679		2012-10-17 05:32:08
553	1	Harry	Woods	Page	Australian Labor Party	1990-03-24	1996-03-02	general_election		10682		2012-10-17 05:32:08
554	1	Bob	Woods	Lowe	Liberal Party	1987-07-11	1993-03-13	general_election		10683		2012-10-17 05:32:08
555	1	Michael	Wooldridge	Casey	Liberal Party	1998-10-03	2001-10-08	general_election	retired	10684		2012-10-17 05:32:08
556	1	Michael	Wooldridge	Chisholm	Liberal Party	1987-07-11	1998-10-03	general_election		10684		2012-10-17 05:32:08
557	1	Trish	Worth	Adelaide	Liberal Party	1993-03-13	2004-10-09	general_election		10685		2012-10-17 05:32:08
558	1	Keith	Wright	Capricornia	Independent	1984-12-01	1993-03-13	general_election		10688		2012-10-17 05:32:08
559	1	William	Yates	Holt	Liberal Party	1975-12-13	1980-10-18	general_election		10689		2012-10-17 05:32:08
560	1	Michael	Young	Port Adelaide	Australian Labor Party	1974-05-18	1988-02-08	general_election	resigned	10691		2012-10-17 05:32:08
561	1	Christian	Zahra	McMillan	Australian Labor Party	1998-10-03	2004-10-09	general_election		10692		2012-10-17 05:32:08
562	1	Paul	Zammit	Lowe	Independent	1996-03-02	1998-10-03	general_election		10694		2012-10-17 05:32:08
563	1	Tony	Zappia	Makin	Australian Labor Party	2007-11-24	9999-12-31	general_election	still_in_office	10695		2012-10-17 05:32:08
564	1	Bob	McMullan	Canberra	Australian Labor Party	1996-03-02	1998-10-03	general_election		10450		2012-10-17 05:32:08
565	1	Annette	Ellis	Namadgi	Australian Labor Party	1996-03-02	1998-10-03	general_election		10197		2012-10-17 05:32:08
566	1	John	Cobb	Parkes	National Party	2001-11-10	2007-11-24	general_election		10127		2012-10-17 05:32:08
567	1	Darren	Chester	Gippsland	National Party	2008-06-28	9999-12-31	by_election	still_in_office	10703		2012-10-17 05:32:08
568	1	Neil	Brown	Menzies	Liberal Party	1969-10-25	1972-12-02	general_election		10718		2012-10-17 05:32:08
569	1	Neil	Brown	Diamond Valley	Liberal Party	1975-12-13	1983-03-05	general_election		10718		2012-10-17 05:32:08
570	1	Neil	Brown	Menzies	Liberal Party	1984-12-01	1991-02-25	general_election	resigned	10718		2012-10-17 05:32:08
571	1	Manfred	Cross	Brisbane	Australian Labor Party	1961-12-09	1975-12-13	general_election		10719		2012-10-17 05:32:08
572	1	Manfred	Cross	Brisbane	Australian Labor Party	1980-10-18	1990-02-19	general_election	retired	10719		2012-10-17 05:32:08
573	1	Billy	Snedden	Bruce	SPK	1976-02-17	1983-04-21	changed_party	resigned	10597		2012-10-17 05:32:08
574	1	Henry	Jenkins	Scullin	SPK	1983-04-21	1985-12-20	changed_party	resigned	10334		2012-10-17 05:32:08
575	1	Joan	Child	Henty	SPK	1986-02-11	1989-08-29	changed_party	changed_party	10697		2012-10-17 05:32:08
576	1	Joan	Child	Henty	Australian Labor Party	1989-08-29	1990-02-19	changed_party	retired	10697		2012-10-17 05:32:08
577	1	Leo	McLeay	Grayndler	SPK	1989-08-29	1993-03-13	changed_party		10446		2012-10-17 05:32:08
578	1	Leo	McLeay	Watson	Australian Labor Party	1993-05-04	2004-08-31	changed_party	retired	10446		2012-10-17 05:32:08
579	1	Stephen	Martin	Cunningham	SPK	1993-05-04	1996-04-30	changed_party	changed_party	10420		2012-10-17 05:32:08
580	1	Stephen	Martin	Cunningham	Australian Labor Party	1996-04-30	2002-08-16	changed_party	resigned	10420		2012-10-17 05:32:08
581	1	Robert	Halverson	Casey	SPK	1996-04-30	1998-03-04	changed_party	changed_party	10277		2012-10-17 05:32:08
582	1	Robert	Halverson	Casey	Liberal Party	1998-03-04	1998-08-31	changed_party	retired	10277		2012-10-17 05:32:08
583	1	Ian	Sinclair	New England	SPK	1998-03-04	1998-08-31	changed_party	retired	10589		2012-10-17 05:32:08
584	1	John	Andrew	Wakefield	SPK	1998-11-10	2004-08-31	changed_party	retired	10013		2012-10-17 05:32:08
585	1	Robert	Oakeshott	Lyne	Independent	2008-09-06	9999-12-31	by_election	still_in_office	10720		2012-10-17 05:32:08
586	1	Jamie	Briggs	Mayo	Liberal Party	2008-09-06	9999-12-31	by_election	still_in_office	10721		2012-10-17 05:32:08
587	1	Paul	Fletcher	Bradfield	Liberal Party	2009-12-05	9999-12-31	by_election	still_in_office	10723		2012-10-17 05:32:08
588	1	Kelly	O'Dwyer	Higgins	Liberal Party	2009-12-05	9999-12-31	by_election	still_in_office	10724		2012-10-17 05:32:08
589	1	John	Alexander	Bennelong	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10725		2012-10-17 05:32:08
590	1	George	Christensen	Dawson	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10726		2012-10-17 05:32:08
591	1	Andrew	Wilkie	Denison	Independent	2010-08-21	9999-12-31	general_election	still_in_office	10727		2012-10-17 05:32:08
592	1	Ken	O'Dowd	Flynn	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10728		2012-10-17 05:32:08
593	1	Bert	Van Manen	Forde	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10729		2012-10-17 05:32:08
594	1	Ken	Wyatt	Hasluck	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10730		2012-10-17 05:32:08
595	1	Laura	Smyth	La Trobe	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10731		2012-10-17 05:32:08
596	1	Warren	Entsch	Leichhardt	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10203		2012-10-17 05:32:08
597	1	Wyatt	Roy	Longman	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10732		2012-10-17 05:32:08
598	1	Louise	Markus	Macquarie	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10417		2012-10-17 05:32:08
599	1	Rob	Mitchell	McEwen	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10733		2012-10-17 05:32:08
600	1	Adam	Bandt	Melbourne	Australian Greens	2010-08-21	9999-12-31	general_election	still_in_office	10734		2012-10-17 05:32:08
601	1	Tony	Crook	O'Connor	National Party	2010-08-21	9999-12-31	general_election	still_in_office	10735		2012-10-17 05:32:08
602	1	Natasha	Griggs	Solomon	Country Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10736		2012-10-17 05:32:08
603	1	Geoff	Lyons	Bass	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10737		2012-10-17 05:32:08
604	1	Gai	Brodtmann	Canberra	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10738		2012-10-17 05:32:08
605	1	Russell	Matheson	Macarthur	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10739		2012-10-17 05:32:08
606	1	Stephen	Jones	Throsby	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10740		2012-10-17 05:32:08
607	1	Josh	Frydenberg	Kooyong	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10741		2012-10-17 05:32:08
608	1	Dan	Tehan	Wannon	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10742		2012-10-17 05:32:08
609	1	Michael	McCormack	Riverina	National Party	2010-08-21	9999-12-31	general_election	still_in_office	10743		2012-10-17 05:32:08
610	1	Chris	Hayes	Fowler	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10294		2012-10-17 05:32:08
611	1	Ewen	Jones	Herbert	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10744		2012-10-17 05:32:08
612	1	Karen	Andrews	McPherson	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10745		2012-10-17 05:32:08
613	1	Andrew	Leigh	Fraser	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10746		2012-10-17 05:32:08
614	1	Deborah	O'Neill	Robertson	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10747		2012-10-17 05:32:08
615	1	Alan	Tudge	Aston	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10748		2012-10-17 05:32:08
616	1	Ed	Husic	Chifley	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10749		2012-10-17 05:32:08
617	1	Craig	Kelly	Hughes	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10750		2012-10-17 05:32:08
618	1	Michelle	Rowland	Greenway	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10751		2012-10-17 05:32:08
619	1	Laurie	Ferguson	Werriwa	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10217		2012-10-17 05:32:08
620	1	John	Murphy	Reid	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10473		2012-10-17 05:32:08
622	1	Barry	Haase	Durack	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10272		2012-10-17 05:32:08
623	1	Chris	Bowen	McMahon	Australian Labor Party	2010-08-21	9999-12-31	general_election	still_in_office	10060		2012-10-17 05:32:08
624	1	Scott	Buchholz	Wright	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10752		2012-10-17 05:32:08
625	1	Jane	Prentice	Ryan	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10753		2012-10-17 05:32:08
626	1	Ross	Vasta	Bonner	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10651		2012-10-17 05:32:08
627	1	Teresa	Gambaro	Brisbane	Liberal Party	2010-08-21	9999-12-31	general_election	still_in_office	10239		2012-10-17 05:32:08
628	1	Harry	Jenkins	Scullin	Australian Labor Party	2011-11-24	9999-12-31	changed_party	still_in_office	10335		2012-10-17 05:32:08
629	1	Peter	Slipper	Fisher	SPK	2011-11-24	9999-12-31	general_election	still_in_office	10590		2012-10-17 05:32:08
100001	2	Eric	Abetz	Tasmania	Liberal Party	1994-02-22	9999-12-31		still_in_office	10003		2012-10-17 05:32:08
100002	2	Judith	Adams	WA	Liberal Party	2005-07-01	2012-03-31	general_election	died	10005		2012-10-17 05:32:08
100003	2	Lyn	Allison	Victoria	Australian Democrats	1996-07-01	2008-06-30	general_election		10009		2012-10-17 05:32:08
100004	2	Richard	Alston	Victoria	Liberal Party	1986-05-07	2004-02-10		resigned	10010		2012-10-17 05:32:08
100005	2	Brian	Archer	Tasmania	Liberal Party	1975-12-13	1994-01-31	general_election	resigned	10017		2012-10-17 05:32:08
100006	2	Terrence	Aulich	Tasmania	Australian Labor Party	1984-12-01	1993-06-30	general_election		10020		2012-10-17 05:32:08
100007	2	Guy	Barnett	Tasmania	Liberal Party	2002-02-26	9999-12-31		still_in_office	10027		2012-10-17 05:32:08
100008	2	Andrew	Bartlett	Queensland	Australian Democrats	1997-10-30	2008-06-30			10029		2012-10-17 05:32:08
100009	2	Michael	Baume	NSW	Liberal Party	1985-07-01	1996-09-09	general_election	resigned	10031		2012-10-17 05:32:08
100010	2	Peter	Baume	NSW	Liberal Party	1974-05-18	1991-01-28	general_election	resigned	10032		2012-10-17 05:32:08
100011	2	Michael	Beahan	WA	Australian Labor Party	1987-07-11	1994-02-01	general_election	changed_party	10033		2012-10-17 05:32:08
100012	2	Robert	Bell	Tasmania	Australian Democrats	1990-03-07	1996-06-30			10037		2012-10-17 05:32:08
100013	2	Cory	Bernardi	SA	Liberal Party	2006-05-04	9999-12-31		still_in_office	10038		2012-10-17 05:32:08
100014	2	Simon	Birmingham	SA	Liberal Party	2007-05-03	9999-12-31		still_in_office	10044		2012-10-17 05:32:08
100015	2	Bronwyn	Bishop	NSW	Liberal Party	1987-07-11	1994-02-24	general_election	resigned	10046	Mrs	2012-10-17 05:32:08
100016	2	Mark	Bishop	WA	Australian Labor Party	1996-07-01	9999-12-31	general_election	still_in_office	10048		2012-10-17 05:32:08
100017	2	Reginald	Bishop	SA	Australian Labor Party	1962-07-01	1981-06-30	general_election	retired	10049		2012-10-17 05:32:08
100018	2	Florence	Bjelke-Petersen	Queensland	National Party	1981-03-12	1993-06-30		retired	10050	Lady	2012-10-17 05:32:08
100019	2	John	Black	Queensland	Australian Labor Party	1984-12-01	1990-06-30	general_election		10051		2012-10-17 05:32:08
100020	2	Nick	Bolkus	SA	Australian Labor Party	1981-07-01	2005-06-30	general_election	retired	10055		2012-10-17 05:32:08
100021	2	Neville	Bonner	Queensland	Independent	1971-06-11	1983-02-04			10056		2012-10-17 05:32:08
100022	2	Ron	Boswell	Queensland	National Party	1983-03-05	9999-12-31	general_election	still_in_office	10057		2012-10-17 05:32:08
100023	2	Vicki	Bourne	NSW	Australian Democrats	1990-07-01	2002-06-30	general_election		10059		2012-10-17 05:32:08
100024	2	Sue	Boyce	Queensland	Liberal Party	2007-04-19	9999-12-31		still_in_office	10062		2012-10-17 05:32:08
100025	2	George	Brandis	Queensland	Liberal Party	2000-05-16	9999-12-31		still_in_office	10067		2012-10-17 05:32:08
100026	2	Carol	Brown	Tasmania	Australian Labor Party	2005-08-25	9999-12-31		still_in_office	10071		2012-10-17 05:32:08
100027	2	Bob	Brown	Tasmania	Australian Greens	1996-07-01	2012-06-15	general_election	resigned	10696		2012-10-17 05:32:08
100028	2	David	Brownhill	NSW	National Party	1984-12-01	2000-04-14	general_election	resigned	10075		2012-10-17 05:32:08
100029	2	Geoffrey	Buckland	SA	Australian Labor Party	2000-09-14	2005-06-30		retired	10078		2012-10-17 05:32:08
100030	2	Bryant	Burns	Queensland	Australian Labor Party	1987-07-11	1996-06-30	general_election	retired	10082		2012-10-17 05:32:08
100031	2	David	Bushby	Tasmania	Liberal Party	2007-08-30	9999-12-31		still_in_office	10085		2012-10-17 05:32:08
100032	2	John	Button	Victoria	Australian Labor Party	1974-05-18	1993-03-31	general_election	resigned	10087		2012-10-17 05:32:08
100033	2	Paul	Calvert	Tasmania	Liberal Party	1987-07-11	2002-08-19	general_election	changed_party	10091		2012-10-17 05:32:08
100034	2	George	Campbell	NSW	Australian Labor Party	1997-09-17	2008-06-30		retired	10098		2012-10-17 05:32:08
100035	2	Ian	Campbell	WA	Liberal Party	1990-05-16	2007-05-31		resigned	10100		2012-10-17 05:32:08
100036	2	Kim	Carr	Victoria	Australian Labor Party	1993-04-28	9999-12-31		still_in_office	10103		2012-10-17 05:32:08
100037	2	John	Carrick	NSW	Liberal Party	1971-07-01	1987-06-05	general_election	retired	10104		2012-10-17 05:32:08
100038	2	James	Cavanagh	SA	Australian Labor Party	1962-07-01	1981-06-30	general_election	retired	10109		2012-10-17 05:32:08
100039	2	Christabel	Chamarette	WA	Australian Greens	1992-03-12	1996-06-30			10110		2012-10-17 05:32:08
100040	2	Frederick	Chaney	WA	Liberal Party	1974-05-18	1990-02-27	general_election	resigned	10112		2012-10-17 05:32:08
100041	2	Grant	Chapman	SA	Liberal Party	1987-07-11	2008-06-30	general_election		10113		2012-10-17 05:32:08
100042	2	John	Cherry	Queensland	Australian Democrats	2001-07-31	2005-06-30			10118		2012-10-17 05:32:08
100043	2	Bruce	Childs	NSW	Australian Labor Party	1981-07-01	1997-09-10	general_election	resigned	10119		2012-10-17 05:32:08
100044	2	Donald	Chipp	Victoria	Australian Democrats	1978-07-01	1986-08-18	general_election	resigned	10120		2012-10-17 05:32:08
100045	2	John	Coates	Tasmania	Australian Labor Party	1981-07-01	1996-08-20	general_election	resigned	10126		2012-10-17 05:32:08
100046	2	Samuel	Cohen	Victoria	Australian Labor Party	1962-07-01	1969-10-07	general_election	died	10130		2012-10-17 05:32:08
100047	2	Richard	Colbeck	Tasmania	Liberal Party	2002-02-04	9999-12-31		still_in_office	10131		2012-10-17 05:32:08
100048	2	Ruth	Coleman	WA	Australian Labor Party	1974-05-18	1987-06-05	general_election	retired	10132		2012-10-17 05:32:08
100049	2	Stanley	Collard	Queensland	National Party	1975-12-13	1987-06-05	general_election	retired	10134		2012-10-17 05:32:08
100050	2	Jacinta	Collins	Victoria	Australian Labor Party	1995-05-03	2005-06-30			10135		2012-10-17 05:32:08
100051	2	Robert	Collins	NT	Australian Labor Party	1987-07-11	1998-03-30	general_election	resigned	10137		2012-10-17 05:32:08
100052	2	Malcolm	Colston	Queensland	Independent	1975-12-13	1999-06-30	general_election	retired	10138		2012-10-17 05:32:08
100053	2	Stephen	Conroy	Victoria	Australian Labor Party	1996-04-30	9999-12-31		still_in_office	10142		2012-10-17 05:32:08
100054	2	Peter	Cook	WA	Australian Labor Party	1983-03-05	2005-06-30	general_election	retired	10143		2012-10-17 05:32:08
100055	2	Helen	Coonan	NSW	Liberal Party	1996-07-01	2011-08-22	general_election	resigned	10144		2012-10-17 05:32:08
100056	2	Bernard	Cooney	Victoria	Australian Labor Party	1984-12-01	2002-06-30	general_election	retired	10145		2012-10-17 05:32:08
100057	2	Mathias	Cormann	WA	Liberal Party	2007-06-19	9999-12-31		still_in_office	10148		2012-10-17 05:32:08
100058	2	John	Coulter	SA	Australian Democrats	1987-07-11	1995-11-20	general_election	resigned	10151		2012-10-17 05:32:08
100059	2	Arthur	Crane	WA	Liberal Party	1990-07-01	2002-06-30	general_election		10156		2012-10-17 05:32:08
100060	2	Noel	Crichton-Browne	WA	Independent Liberal	1981-07-01	1996-06-30	general_election	retired	10159		2012-10-17 05:32:08
100061	2	Trish	Crossin	NT	Australian Labor Party	1998-06-16	9999-12-31		still_in_office	10161		2012-10-17 05:32:08
100062	2	Rosemary	Crowley	SA	Australian Labor Party	1983-03-05	2002-06-30	general_election	retired	10162		2012-10-17 05:32:08
100063	2	Gordon	Davidson	SA	Liberal Party	1962-02-08	1962-06-30	general_election		10168		2012-10-17 05:32:08
100064	2	Gordon	Davidson	SA	Liberal Party	1965-07-01	1981-06-30	general_election	retired	10168		2012-10-17 05:32:08
100065	2	Gordon	Davidson	SA	Liberal Party	1961-09-28	1961-12-08			10168		2012-10-17 05:32:08
100066	2	Kay	Denman	Tasmania	Australian Labor Party	1993-08-24	2005-06-30		retired	10172		2012-10-17 05:32:08
100067	2	John	Devereux	Tasmania	Independent	1987-07-11	1996-02-07	general_election	resigned	10173		2012-10-17 05:32:08
100068	2	Arthur	Devlin	Tasmania	Australian Labor Party	1984-12-01	1990-06-30	general_election	retired	10174		2012-10-17 05:32:08
100069	2	Patricia	Dunn	NSW	Independent	1988-07-21	1990-06-30	general_election		10186		2012-10-17 05:32:08
100070	2	Peter	Durack	WA	Liberal Party	1971-07-01	1993-06-30	general_election	retired	10187		2012-10-17 05:32:08
100071	2	Alan	Eggleston	WA	Liberal Party	1996-07-01	9999-12-31	general_election	still_in_office	10193		2012-10-17 05:32:08
100072	2	Chris	Ellison	WA	Liberal Party	1993-07-01	2009-01-30	general_election	resigned	10199		2012-10-17 05:32:08
100073	2	Ronald	Elstob	SA	Australian Labor Party	1978-07-01	1987-06-05	general_election	retired	10201		2012-10-17 05:32:08
100074	2	Chris	Evans	WA	Australian Labor Party	1993-07-01	9999-12-31	general_election	still_in_office	10204		2012-10-17 05:32:08
100075	2	Gareth	Evans	Victoria	Australian Labor Party	1978-07-01	1996-02-06	general_election	resigned	10205		2012-10-17 05:32:08
100076	2	John	Evans	WA	Australian Democrats	1983-03-05	1985-06-30	general_election		10206		2012-10-17 05:32:08
100077	2	John	Faulkner	NSW	Australian Labor Party	1989-04-04	9999-12-31		still_in_office	10214		2012-10-17 05:32:08
100078	2	Alan	Ferguson	SA	Liberal Party	1992-05-26	2007-08-14		changed_party	10216		2012-10-17 05:32:08
100079	2	Jeannie	Ferris	SA	Liberal Party	1996-07-01	1996-07-12	general_election		10220		2012-10-17 05:32:08
100080	2	Jeannie	Ferris	SA	Liberal Party	1996-07-24	2007-04-02		died	10220		2012-10-17 05:32:08
100081	2	Steve	Fielding	Victoria	Family First Party	2005-07-01	9999-12-31	general_election	still_in_office	10221		2012-10-17 05:32:08
100082	2	Concetta	Fierravanti-Wells	NSW	Liberal Party	2005-05-05	9999-12-31		still_in_office	10222		2012-10-17 05:32:08
100083	2	Mitch	Fifield	Victoria	Liberal Party	2004-03-31	9999-12-31		still_in_office	10224		2012-10-17 05:32:08
100084	2	Mary	Fisher	SA	Liberal Party	2007-06-06	2012-08-14		resigned	10227		2012-10-17 05:32:08
100085	2	Dominic	Foreman	SA	Australian Labor Party	1981-07-01	1997-09-15	general_election	resigned	10233		2012-10-17 05:32:08
100086	2	Michael	Forshaw	NSW	Australian Labor Party	1994-05-10	9999-12-31		still_in_office	10235		2012-10-17 05:32:08
100087	2	George	Georges	Queensland	Independent	1968-07-01	1987-06-05	general_election		10247		2012-10-17 05:32:08
100088	2	Brenda	Gibbs	Queensland	Australian Labor Party	1996-07-01	2002-06-30	general_election		10251		2012-10-17 05:32:08
100089	2	Brian	Gibson	Tasmania	Liberal Party	1993-07-01	2002-02-22	general_election	resigned	10252		2012-10-17 05:32:08
100090	2	Arthur	Gietzelt	NSW	Australian Labor Party	1971-07-01	1989-02-27	general_election	resigned	10254		2012-10-17 05:32:08
100091	2	Patricia	Giles	WA	Australian Labor Party	1981-07-01	1993-06-30	general_election	retired	10256		2012-10-17 05:32:08
100092	2	Brian	Greig	WA	Australian Democrats	1999-07-01	2005-05-30	general_election		10265		2012-10-17 05:32:08
100093	2	Donald	Grimes	Tasmania	Australian Labor Party	1974-05-18	1987-04-02	general_election	resigned	10269		2012-10-17 05:32:08
100094	2	Margaret	Guilfoyle	Victoria	Liberal Party	1971-07-01	1987-06-05	general_election	retired	10271		2012-10-17 05:32:08
100095	2	Janine	Haines	SA	Australian Democrats	1981-07-01	1990-03-01	general_election	resigned	10273		2012-10-17 05:32:08
100096	2	Janine	Haines	SA	Australian Democrats	1977-12-14	1978-06-30			10273		2012-10-17 05:32:08
100097	2	David	Hamer	Victoria	Liberal Party	1978-07-01	1990-06-30	general_election	retired	10278		2012-10-17 05:32:08
100098	2	Brian	Harradine	Tasmania	Independent	1975-12-13	2005-06-30	general_election	retired	10282		2012-10-17 05:32:08
100099	2	Leonard	Harris	Queensland	Pauline Hanson's One Nation Party	1999-07-02	2005-06-30	general_election		10284		2012-10-17 05:32:08
100100	2	Jean	Hearn	Tasmania	Australian Labor Party	1980-10-15	1985-06-30		retired	10295		2012-10-17 05:32:08
100101	2	Bill	Heffernan	NSW	Liberal Party	1996-09-18	9999-12-31		still_in_office	10296		2012-10-17 05:32:08
100102	2	Albion	Hendrickson	Victoria	Australian Labor Party	1947-07-01	1971-06-30	general_election	retired	10297		2012-10-17 05:32:08
100103	2	John	Herron	Queensland	Liberal Party	1990-07-01	2002-09-05	general_election	resigned	10300		2012-10-17 05:32:08
100104	2	Heather	Hill	Queensland	Pauline Hanson's One Nation Party	1998-11-18	1999-09-23	general_election	disqualified	10303		2012-10-17 05:32:08
100105	2	Robert	Hill	SA	Liberal Party	1981-07-01	2006-03-15	general_election	resigned	10304		2012-10-17 05:32:08
100106	2	John	Hogg	Queensland	Australian Labor Party	1996-07-01	2002-08-19	general_election	changed_party	10309		2012-10-17 05:32:08
100107	2	Gary	Humphries	ACT	Liberal Party	2003-02-18	9999-12-31		still_in_office	10318		2012-10-17 05:32:08
100108	2	Annette	Hurley	SA	Australian Labor Party	2005-07-01	9999-12-31	general_election	still_in_office	10322		2012-10-17 05:32:08
100109	2	Steve	Hutchins	NSW	Australian Labor Party	1998-10-14	9999-12-31		still_in_office	10323		2012-10-17 05:32:08
100110	2	Jean	Jenkins	WA	Australian Democrats	1987-07-11	1990-06-30	general_election		10336		2012-10-17 05:32:08
100111	2	Donald	Jessop	SA	Independent	1971-07-01	1987-06-05	general_election		10338		2012-10-17 05:32:08
100112	2	David	Johnston	WA	Liberal Party	2002-07-01	9999-12-31	general_election	still_in_office	10344		2012-10-17 05:32:08
100113	2	Gerry	Jones	Queensland	Australian Labor Party	1981-07-01	1996-06-30	general_election	retired	10349		2012-10-17 05:32:08
100114	2	Barnaby	Joyce	Queensland	National Party	2005-07-01	9999-12-31	general_election	still_in_office	10350		2012-10-17 05:32:08
100115	2	James	Keeffe	Queensland	Australian Labor Party	1965-07-01	1983-02-04	general_election	retired	10355		2012-10-17 05:32:08
100116	2	Rod	Kemp	Victoria	Liberal Party	1990-07-01	2008-06-30	general_election	retired	10361		2012-10-17 05:32:08
100117	2	Cheryl	Kernot	Queensland	Australian Democrats	1990-07-01	1997-10-15	general_election	resigned	10364		2012-10-17 05:32:08
100118	2	Bernard	Kilgariff	NT	Liberal Party	1975-12-13	1987-06-05	general_election	retired	10366		2012-10-17 05:32:08
100119	2	Linda	Kirk	SA	Australian Labor Party	2002-07-01	2008-06-30	general_election	retired	10370		2012-10-17 05:32:08
100120	2	John	Knight	ACT	Liberal Party	1975-12-13	1981-03-04	general_election	died	10372		2012-10-17 05:32:08
100121	2	Susan	Knowles	WA	Liberal Party	1984-12-01	2005-06-30	general_election	retired	10374		2012-10-17 05:32:08
100122	2	Milivoj	Lajovic	NSW	Liberal Party	1975-12-13	1985-06-30	general_election	retired	10375		2012-10-17 05:32:08
100123	2	Condor	Laucke	SA	Liberal Party	1967-11-02	1976-02-17		changed_party	10380		2012-10-17 05:32:08
100124	2	Meg	Lees	SA	Independent	1990-04-04	2005-06-30			10385		2012-10-17 05:32:08
100125	2	Austin	Lewis	Victoria	Liberal Party	1976-12-17	1993-06-30		retired	10386		2012-10-17 05:32:08
100126	2	Ross	Lightfoot	WA	Liberal Party	1997-05-19	2008-06-30		retired	10389		2012-10-17 05:32:08
100127	2	Stephen	Loosley	NSW	Australian Labor Party	1990-07-01	1995-05-19	general_election	resigned	10395		2012-10-17 05:32:08
100128	2	Joe	Ludwig	Queensland	Australian Labor Party	1999-07-01	9999-12-31	general_election	still_in_office	10397		2012-10-17 05:32:08
100129	2	Kate	Lundy	ACT	Australian Labor Party	1996-03-02	9999-12-31	general_election	still_in_office	10398		2012-10-17 05:32:08
100130	2	Ian	Macdonald	Queensland	Liberal Party	1990-07-01	9999-12-31	general_election	still_in_office	10401		2012-10-17 05:32:08
100131	2	Sandy	Macdonald	NSW	National Party	1993-07-01	1999-06-30	general_election		10402		2012-10-17 05:32:08
100132	2	Sandy	Macdonald	NSW	National Party	2000-05-04	2008-06-30		retired	10402		2012-10-17 05:32:08
100133	2	David	Macgibbon	Queensland	Liberal Party	1978-07-01	1999-06-30	general_election		10404		2012-10-17 05:32:08
100134	2	Sue	Mackay	Tasmania	Australian Labor Party	1996-03-08	2005-07-29		resigned	10406		2012-10-17 05:32:08
100135	2	Michael	Macklin	Queensland	Australian Democrats	1981-07-01	1990-06-30	general_election	retired	10410		2012-10-17 05:32:08
100136	2	Graham	Maguire	SA	Australian Labor Party	1983-03-05	1993-06-30	general_election		10412		2012-10-17 05:32:08
100137	2	Diane	Margetts	WA	Australian Greens	1993-07-01	1999-06-30	general_election		10415		2012-10-17 05:32:08
100138	2	Gavin	Marshall	Victoria	Australian Labor Party	2002-07-01	9999-12-31	general_election	still_in_office	10419		2012-10-17 05:32:08
100139	2	John	Martyr	WA	Liberal Party	1981-03-11	1983-02-04			10422		2012-10-17 05:32:08
100140	2	Brett	Mason	Queensland	Liberal Party	1999-07-01	9999-12-31	general_election	still_in_office	10423		2012-10-17 05:32:08
100141	2	Colin	Mason	NSW	Australian Democrats	1978-07-01	1987-06-05	general_election	retired	10424		2012-10-17 05:32:08
100142	2	Charles	Maunsell	Queensland	National Country Party	1968-07-01	1981-06-30	general_election		10425		2012-10-17 05:32:08
100143	2	Ronald	McAuliffe	Queensland	Australian Labor Party	1971-07-01	1981-06-30	general_election	retired	10429		2012-10-17 05:32:08
100144	2	Douglas	McClelland	NSW	Australian Labor Party	1962-07-01	1983-04-21	general_election	changed_party	10430		2012-10-17 05:32:08
100145	2	Anne	McEwen	SA	Australian Labor Party	2005-07-01	9999-12-31	general_election	still_in_office	10433		2012-10-17 05:32:08
100146	2	Julian	McGauran	Victoria	National Party	1987-07-11	1990-06-30	general_election		10435		2012-10-17 05:32:08
100147	2	Julian	McGauran	Victoria	National Party	1993-07-01	9999-12-31	general_election	still_in_office	10435		2012-10-17 05:32:08
100148	2	Gordon	McIntosh	WA	Australian Labor Party	1974-05-18	1987-06-05	general_election	retired	10438		2012-10-17 05:32:08
100149	2	Jim	McKiernan	WA	Australian Labor Party	1984-12-01	2002-06-30	general_election	retired	10440		2012-10-17 05:32:08
100150	2	Geoffrey	McLaren	SA	Australian Labor Party	1971-07-01	1983-02-04	general_election	retired	10442		2012-10-17 05:32:08
100151	2	Paul	McLean	NSW	Australian Democrats	1987-07-11	1991-08-23	general_election	resigned	10443		2012-10-17 05:32:08
100152	2	Jan	McLucas	Queensland	Australian Labor Party	1999-07-01	9999-12-31	general_election	still_in_office	10447		2012-10-17 05:32:08
100153	2	Bob	McMullan	ACT	Australian Labor Party	1988-02-16	1996-02-06		resigned	10450		2012-10-17 05:32:08
100154	2	Jean	Melzer	Victoria	Australian Labor Party	1974-05-18	1981-06-30	general_election		10453		2012-10-17 05:32:08
100155	2	Anthony	Messner	SA	Liberal Party	1975-12-13	1990-04-17	general_election	resigned	10454		2012-10-17 05:32:08
100156	2	Christine	Milne	Tasmania	Australian Greens	2005-07-01	9999-12-31	general_election	still_in_office	10458		2012-10-17 05:32:08
100157	2	Nick	Minchin	SA	Liberal Party	1993-07-01	9999-12-31	general_election	still_in_office	10460		2012-10-17 05:32:08
100158	2	Alan	Missen	Victoria	Liberal Party	1974-05-18	1986-03-30	general_election	died	10462		2012-10-17 05:32:08
100159	2	Claire	Moore	Queensland	Australian Labor Party	2002-07-01	9999-12-31	general_election	still_in_office	10463		2012-10-17 05:32:08
100160	2	John	Morris	NSW	Australian Labor Party	1985-07-01	1990-06-30	general_election	retired	10466		2012-10-17 05:32:08
100161	2	James	Mulvihill	NSW	Australian Labor Party	1965-07-01	1983-02-04	general_election	retired	10472		2012-10-17 05:32:08
100162	2	Shayne	Murphy	Tasmania	Independent	1993-07-01	2005-06-30	general_election		10474		2012-10-17 05:32:08
100163	2	Andrew	Murray	WA	Australian Democrats	1996-07-01	2008-06-30	general_election	retired	10475		2012-10-17 05:32:08
100164	2	Fiona	Nash	NSW	National Party	2005-07-01	9999-12-31	general_election	still_in_office	10478		2012-10-17 05:32:08
100165	2	Belinda	Neal	NSW	Australian Labor Party	1994-03-08	1998-09-03		resigned	10479		2012-10-17 05:32:08
100166	2	Laurence	Neal	Victoria	National Country Party	1980-03-11	1981-06-30			10480		2012-10-17 05:32:08
100167	2	Kerry	Nettle	NSW	Australian Greens	2002-07-01	2008-06-30	general_election		10484		2012-10-17 05:32:08
100168	2	Jocelyn	Newman	Tasmania	Liberal Party	1986-03-13	2002-02-01		resigned	10488		2012-10-17 05:32:08
100169	2	Kerry	O'Brien	Tasmania	Australian Labor Party	1996-09-05	9999-12-31		still_in_office	10492		2012-10-17 05:32:08
100170	2	Justin	O'Byrne	Tasmania	Australian Labor Party	1947-07-01	1981-06-30	general_election	retired	10493		2012-10-17 05:32:08
100171	2	William	O'Chee	Queensland	National Party	1990-05-08	1999-06-30			10495		2012-10-17 05:32:08
100172	2	John	Olsen	SA	Liberal Party	1990-05-07	1992-05-04		resigned	10501		2012-10-17 05:32:08
100173	2	John	Panizza	WA	Liberal Party	1987-07-11	1997-01-31	general_election	died	10504		2012-10-17 05:32:08
100174	2	Warwick	Parer	Queensland	Liberal Party	1984-11-22	2000-02-11		resigned	10505		2012-10-17 05:32:08
100175	2	Stephen	Parry	Tasmania	Liberal Party	2005-07-01	9999-12-31	general_election	still_in_office	10507		2012-10-17 05:32:08
100176	2	Kay	Patterson	Victoria	Liberal Party	1987-07-11	2008-06-30	general_election	retired	10508		2012-10-17 05:32:08
100177	2	Marise	Payne	NSW	Liberal Party	1997-04-09	9999-12-31		still_in_office	10509		2012-10-17 05:32:08
100178	2	Helen	Polley	Tasmania	Australian Labor Party	2005-07-01	9999-12-31	general_election	still_in_office	10515		2012-10-17 05:32:08
100179	2	Janet	Powell	Victoria	Independent	1986-08-26	1993-06-30			10517		2012-10-17 05:32:08
100180	2	Cyril	Primmer	Victoria	Australian Labor Party	1971-07-01	1985-06-30	general_election	retired	10520		2012-10-17 05:32:08
100181	2	Christopher	Puplick	NSW	Liberal Party	1978-07-26	1981-06-30	general_election		10523		2012-10-17 05:32:08
100182	2	Christopher	Puplick	NSW	Liberal Party	1984-12-01	1990-06-30	general_election		10523		2012-10-17 05:32:08
100183	2	John	Quirke	SA	Australian Labor Party	1997-09-18	2000-08-15		resigned	10526		2012-10-17 05:32:08
100184	2	Peter	Rae	Tasmania	Liberal Party	1968-07-01	1986-01-16	general_election	resigned	10527		2012-10-17 05:32:08
100185	2	Robert	Ray	Victoria	Australian Labor Party	1981-07-01	2008-05-05	general_election	retired	10531		2012-10-17 05:32:08
100186	2	Margaret	Reid	ACT	Liberal Party	1981-05-05	1996-08-20		changed_party	10534		2012-10-17 05:32:08
100187	2	Margaret	Reynolds	Queensland	Australian Labor Party	1983-03-05	1999-06-30	general_election	retired	10537		2012-10-17 05:32:08
100188	2	Graham	Richardson	NSW	Australian Labor Party	1983-03-05	1994-03-25	general_election	resigned	10538		2012-10-17 05:32:08
100189	2	Aden	Ridgeway	NSW	Australian Democrats	1999-07-01	2005-06-30	general_election		10540		2012-10-17 05:32:08
100190	2	Edward	Robertson	NT	Australian Labor Party	1975-12-13	1987-06-05	general_election	retired	10546		2012-10-17 05:32:08
100191	2	Allan	Rocher	WA	Liberal Party	1978-07-01	1981-02-10	general_election	resigned	10549		2012-10-17 05:32:08
100192	2	Michael	Ronaldson	Victoria	Liberal Party	2005-07-01	9999-12-31	general_election	still_in_office	10550		2012-10-17 05:32:08
100193	2	Susan	Ryan	ACT	Australian Labor Party	1975-12-13	1988-01-29	general_election	resigned	10554		2012-10-17 05:32:08
100194	2	Norman	Sanders	Tasmania	Australian Democrats	1985-07-01	1990-03-01	general_election	resigned	10557		2012-10-17 05:32:08
100195	2	Santo	Santoro	Queensland	Liberal Party	2002-10-29	2007-04-11		resigned	10558		2012-10-17 05:32:08
100196	2	Chris	Schacht	SA	Australian Labor Party	1987-07-11	2002-06-30	general_election		10561		2012-10-17 05:32:08
100197	2	Douglas	Scott	NSW	National Party	1970-08-06	1970-11-20			10566		2012-10-17 05:32:08
100198	2	Douglas	Scott	NSW	National Party	1974-05-18	1985-06-30	general_election	retired	10566		2012-10-17 05:32:08
100199	2	Nigel	Scullion	NT	Country Liberal Party	2001-11-10	9999-12-31	general_election	still_in_office	10569		2012-10-17 05:32:08
100200	2	Glenister	Sheil	Queensland	National Country Party	1984-12-01	1990-06-30	general_election		10575		2012-10-17 05:32:08
100201	2	Glenister	Sheil	Queensland	National Country Party	1974-05-18	1981-02-06	general_election	resigned	10575		2012-10-17 05:32:08
100202	2	Nick	Sherry	Tasmania	Australian Labor Party	1990-07-01	2012-06-01	general_election	resigned	10576		2012-10-17 05:32:08
100203	2	Jim	Short	Victoria	Liberal Party	1984-12-01	1997-05-12	general_election	resigned	10578		2012-10-17 05:32:08
100204	2	Kerry	Sibraa	NSW	Australian Labor Party	1978-08-09	1987-02-17		changed_party	10581		2012-10-17 05:32:08
100205	2	Kerry	Sibraa	NSW	Australian Labor Party	1975-12-13	1978-06-30	general_election		10581		2012-10-17 05:32:08
100206	2	John	Siddons	Victoria	Unite Australia Party	1981-07-01	1983-02-04	general_election		10582		2012-10-17 05:32:08
100207	2	John	Siddons	Victoria	Unite Australia Party	1985-07-01	1987-06-05	general_election		10582		2012-10-17 05:32:08
100208	2	Rachel	Siewert	WA	Australian Greens	2005-07-01	9999-12-31	general_election	still_in_office	10584		2012-10-17 05:32:08
100209	2	John	Sim	WA	Liberal Party	1964-11-26	1981-06-30		retired	10585		2012-10-17 05:32:08
100210	2	Karin	Sowada	NSW	Australian Democrats	1991-08-29	1993-06-30			10602		2012-10-17 05:32:08
100211	2	Sid	Spindler	Victoria	Australian Democrats	1990-07-01	1996-06-30	general_election	retired	10604		2012-10-17 05:32:08
100212	2	Ursula	Stephens	NSW	Australian Labor Party	2002-07-01	9999-12-31	general_election	still_in_office	10609		2012-10-17 05:32:08
100213	2	Glenn	Sterle	WA	Australian Labor Party	2005-07-01	9999-12-31	general_election	still_in_office	10610		2012-10-17 05:32:08
100214	2	John	Stone	Queensland	National Party	1987-07-11	1990-03-01	general_election	resigned	10611		2012-10-17 05:32:08
100215	2	Natasha	Stott Despoja	SA	Australian Democrats	1995-11-29	2008-06-30		retired	10613		2012-10-17 05:32:08
100216	2	Kathy	Sullivan	Queensland	Liberal Party	1974-05-18	1984-11-05	general_election	resigned	10616		2012-10-17 05:32:08
100217	2	Karen	Synon	Victoria	Liberal Party	1997-05-13	1999-06-30			10619		2012-10-17 05:32:08
100218	2	Grant	Tambling	NT	Country Liberal Party	1987-07-11	2001-11-09	general_election	retired	10620		2012-10-17 05:32:08
100219	2	Michael	Tate	Tasmania	Australian Labor Party	1978-07-01	1993-07-05	general_election	resigned	10622		2012-10-17 05:32:08
100220	2	Tsebin	Tchen	Victoria	Liberal Party	1999-07-01	2005-06-30	general_election	retired	10624		2012-10-17 05:32:08
100221	2	Baden	Teague	SA	Liberal Party	1978-07-01	1996-06-30	general_election	retired	10625		2012-10-17 05:32:08
100222	2	Andrew	Thomas	WA	Liberal Party	1975-12-13	1983-02-04	general_election		10627		2012-10-17 05:32:08
100223	2	John	Tierney	NSW	Liberal Party	1991-02-11	2005-04-14		resigned	10635		2012-10-17 05:32:08
100224	2	Michael	Townley	Tasmania	Independent	1971-07-01	1987-06-05	general_election	retired	10637		2012-10-17 05:32:08
100225	2	Judith	Troeth	Victoria	Liberal Party	1993-07-01	9999-12-31	general_election	still_in_office	10639		2012-10-17 05:32:08
100226	2	Russell	Trood	Queensland	Liberal Party	2005-07-01	9999-12-31	general_election	still_in_office	10640		2012-10-17 05:32:08
100227	2	Josephine	Vallentine	WA	Australian Greens	1985-07-01	1992-01-31	general_election	resigned	10648		2012-10-17 05:32:08
100228	2	Amanda	Vanstone	SA	Liberal Party	1984-12-01	2007-04-26	general_election	resigned	10650		2012-10-17 05:32:08
100229	2	David	Vigor	SA	Unite Australia Party	1984-12-01	1987-06-05	general_election		10652		2012-10-17 05:32:08
100230	2	Peter	Walsh	WA	Australian Labor Party	1974-05-18	1993-06-30	general_election	retired	10657		2012-10-17 05:32:08
100231	2	Mary	Walters	Tasmania	Liberal Party	1975-12-13	1993-06-30	general_election	retired	10658		2012-10-17 05:32:08
100232	2	John	Watson	Tasmania	Liberal Party	1978-07-01	2008-06-30	general_election	retired	10661		2012-10-17 05:32:08
100233	2	Ruth	Webber	WA	Australian Labor Party	2002-07-01	2008-06-30	general_election		10662		2012-10-17 05:32:08
100234	2	James	Webster	Victoria	National Country Party	1964-12-09	1980-01-28		resigned	10664		2012-10-17 05:32:08
100235	2	Suzanne	West	NSW	Australian Labor Party	1990-07-01	2002-06-30	general_election	retired	10668		2012-10-17 05:32:08
100236	2	Suzanne	West	NSW	Australian Labor Party	1987-02-11	1987-06-05			10668		2012-10-17 05:32:08
100237	2	John	Wheeldon	WA	Australian Labor Party	1965-07-01	1981-06-30	general_election	retired	10669		2012-10-17 05:32:08
100238	2	Thomas	Wheelwright	NSW	Australian Labor Party	1995-05-24	1996-06-30			10670		2012-10-17 05:32:08
100239	2	Reginald	Withers	WA	Liberal Party	1966-02-17	1966-11-25			10677		2012-10-17 05:32:08
100240	2	Reginald	Withers	WA	Liberal Party	1968-07-01	1987-06-05	general_election	retired	10677		2012-10-17 05:32:08
100241	2	Penny	Wong	SA	Australian Labor Party	2002-07-01	9999-12-31	general_election	still_in_office	10678		2012-10-17 05:32:08
100242	2	William	Wood	NSW	Nuclear Disarmament Party	1987-07-11	1988-05-12	general_election	disqualified	10680		2012-10-17 05:32:08
100243	2	John	Woodley	Queensland	Australian Democrats	1993-07-01	2001-07-27	general_election	resigned	10681		2012-10-17 05:32:08
100244	2	Bob	Woods	NSW	Liberal Party	1994-03-08	1997-03-07		resigned	10683		2012-10-17 05:32:08
100245	2	Dana	Wortley	SA	Australian Labor Party	2005-07-01	9999-12-31	general_election	still_in_office	10686		2012-10-17 05:32:08
100246	2	Kenneth	Wriedt	Tasmania	Australian Labor Party	1968-07-01	1980-09-25	general_election	resigned	10687		2012-10-17 05:32:08
100247	2	Harold	Young	SA	Liberal Party	1968-07-01	1981-08-18	general_election	changed_party	10690		2012-10-17 05:32:08
100248	2	Alice	Zakharov	Victoria	Australian Labor Party	1983-03-05	1995-03-06	general_election	died	10693		2012-10-17 05:32:08
100249	2	Mark	Arbib	NSW	Australian Labor Party	2008-07-01	2012-03-05	general_election	resigned	10704		2012-10-17 05:32:08
100250	2	Catryna	Bilyk	Tasmania	Australian Labor Party	2008-07-01	9999-12-31	general_election	still_in_office	10705		2012-10-17 05:32:08
100251	2	Doug	Cameron	NSW	Australian Labor Party	2008-07-01	9999-12-31	general_election	still_in_office	10706		2012-10-17 05:32:08
100252	2	Michaelia	Cash	WA	Liberal Party	2008-07-01	9999-12-31	general_election	still_in_office	10707		2012-10-17 05:32:08
100253	2	Don	Farrell	SA	Australian Labor Party	2008-07-01	9999-12-31	general_election	still_in_office	10708		2012-10-17 05:32:08
100254	2	David	Feeney	Victoria	Australian Labor Party	2008-07-01	9999-12-31	general_election	still_in_office	10709		2012-10-17 05:32:08
100255	2	Mark	Furner	Queensland	Australian Labor Party	2008-07-01	9999-12-31	general_election	still_in_office	10710		2012-10-17 05:32:08
100256	2	Sarah	Hanson-Young	SA	Australian Greens	2008-07-01	9999-12-31	general_election	still_in_office	10711		2012-10-17 05:32:08
100257	2	Helen	Kroger	Victoria	Liberal Party	2008-07-01	9999-12-31	general_election	still_in_office	10712		2012-10-17 05:32:08
100258	2	Scott	Ludlam	WA	Australian Greens	2008-07-01	9999-12-31	general_election	still_in_office	10713		2012-10-17 05:32:08
100259	2	Louise	Pratt	WA	Australian Labor Party	2008-07-01	9999-12-31	general_election	still_in_office	10714		2012-10-17 05:32:08
100260	2	Scott	Ryan	Victoria	Liberal Party	2008-07-01	9999-12-31	general_election	still_in_office	10715		2012-10-17 05:32:08
100261	2	John	Williams	NSW	National Party	2008-07-01	9999-12-31	general_election	still_in_office	10716		2012-10-17 05:32:08
100262	2	Nick	Xenophon	SA	Independent	2008-07-01	9999-12-31	general_election	still_in_office	10717		2012-10-17 05:32:08
100263	2	Alan	Ferguson	SA	PRES	2007-08-15	2008-08-25	changed_party	changed_party	10216		2012-10-17 05:32:08
100264	2	John	Hogg	Queensland	DPRES	2002-08-19	2008-08-25	changed_party	changed_party	10309		2012-10-17 05:32:08
100265	2	Jacinta	Collins	Victoria	Australian Labor Party	2008-05-08	9999-12-31	general_election	still_in_office	10135		2012-10-17 05:32:08
100266	2	Condor	Laucke	SA	PRES	1976-02-17	1981-06-30	changed_party	retired	10380		2012-10-17 05:32:08
100267	2	Harold	Young	SA	PRES	1981-08-18	1983-02-04	changed_party		10690		2012-10-17 05:32:08
100268	2	Douglas	McClelland	NSW	PRES	1983-04-21	1987-01-23	changed_party	resigned	10430		2012-10-17 05:32:08
100269	2	Kerry	Sibraa	NSW	PRES	1987-02-17	1987-06-05	changed_party	changed_party	10581		2012-10-17 05:32:08
100270	2	Kerry	Sibraa	NSW	Australian Labor Party	1987-06-05	1987-09-14	changed_party	changed_party	10581		2012-10-17 05:32:08
100271	2	Kerry	Sibraa	NSW	PRES	1987-09-14	1994-02-01	changed_party	resigned	10581		2012-10-17 05:32:08
100272	2	Michael	Beahan	WA	PRES	1994-02-01	1996-06-30	changed_party		10033		2012-10-17 05:32:08
100273	2	Margaret	Reid	ACT	PRES	1996-08-20	2002-08-18	changed_party	changed_party	10534		2012-10-17 05:32:08
100274	2	Margaret	Reid	ACT	Liberal Party	2002-08-18	2003-02-14	changed_party	resigned	10534		2012-10-17 05:32:08
100275	2	Paul	Calvert	Tasmania	PRES	2002-08-19	2007-08-14	changed_party	changed_party	10091		2012-10-17 05:32:08
100276	2	Paul	Calvert	Tasmania	Liberal Party	2007-08-15	2007-08-29	changed_party	resigned	10091		2012-10-17 05:32:08
100277	2	John	Hogg	Queensland	PRES	2008-08-26	9999-12-31	changed_party	still_in_office	10309		2012-10-17 05:32:08
100278	2	Alan	Ferguson	SA	DPRES	2008-08-26	9999-12-31	changed_party	still_in_office	10216		2012-10-17 05:32:08
100279	2	Christopher	Back	WA	Liberal Party	2009-03-11	9999-12-31	general_election	still_in_office	10722		2012-10-17 05:32:08
100285	2	Richard	Di Natale	Victoria	Australian Greens	2011-07-01	9999-12-31	general_election	still_in_office	10755		2012-10-17 05:32:08
100286	2	Sean	Edwards	SA	Liberal Party	2011-07-01	9999-12-31	general_election	still_in_office	10756		2012-10-17 05:32:08
100287	2	David	Fawcett	SA	Liberal Party	2011-07-01	9999-12-31	general_election	still_in_office	10215		2012-10-17 05:32:08
100288	2	Alex	Gallacher	SA	Australian Labor Party	2011-07-01	9999-12-31	general_election	still_in_office	10757		2012-10-17 05:32:08
100291	2	Bridget	McKenzie	Victoria	National Party	2011-07-01	9999-12-31	general_election	still_in_office	10758		2012-10-17 05:32:08
100292	2	John	Madigan	Victoria	Democratic Labor Party	2011-07-01	9999-12-31	general_election	still_in_office	10759		2012-10-17 05:32:08
100293	2	Lee	Rhiannon	NSW	Australian Greens	2011-07-01	9999-12-31	general_election	still_in_office	10760		2012-10-17 05:32:08
100295	2	Lisa	Singh	Tasmania	Australian Labor Party	2011-07-01	9999-12-31	general_election	still_in_office	10761	Hon.	2012-10-17 05:32:08
100296	2	Matt	Thistlethwaite	NSW	Australian Labor Party	2011-07-01	9999-12-31	general_election	still_in_office	10762		2012-10-17 05:32:08
100297	2	Anne	Urquhart	Tasmania	Australian Labor Party	2011-07-01	9999-12-31	general_election	still_in_office	10763		2012-10-17 05:32:08
100298	2	Larissa	Waters	Queensland	Australian Greens	2011-07-01	9999-12-31	general_election	still_in_office	10764		2012-10-17 05:32:08
100300	2	Penny	Wright	SA	Australian Greens	2011-07-01	9999-12-31	general_election	still_in_office	10765		2012-10-17 05:32:08
100301	2	Arthur	Sinodinos	NSW	Liberal Party	2011-10-31	9999-12-31		still_in_office	10766		2012-10-17 05:32:08
100302	2	Bob	Carr	NSW	Australian Labor Party	2012-03-06	9999-12-31	general_election	still_in_office	10767		2012-10-17 05:32:08
100303	2	Dean	Smith	WA	Liberal Party	2012-05-02	9999-12-31	general_election	still_in_office	10768		2012-10-17 05:32:08
100304	2	Lin	Thorp	Tasmania	Australian Labor Party	2012-06-20	9999-12-31	general_election	still_in_office	10769		2012-10-17 05:32:08
100305	2	Peter	Whish-Wilson	Tasmania	Australian Greens	2012-06-20	9999-12-31	general_election	still_in_office	10780		2012-10-17 05:32:08
100306	2	Anne	Ruston	SA	Liberal Party	2012-09-05	9999-12-31		still_in_office	10781		2012-10-17 05:32:08
\.


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

