/* DROP TABLE IF EXISTS `topics`; */
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
/*
CREATE TABLE `topics` (
  `id` int(11) DEFAULT NULL auto_increment PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `keywords` varchar(600) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into topics (id, name, keywords) values (1, 'Other', '');
insert into topics (id, name, keywords) values (2, 'Crime', 'crime');
insert into topics (id, name, keywords) values (3, 'Carbon tax', 'carbon,clean building,clean energy');
insert into topics (id, name, keywords) values (4, 'Asylum seekers', 'asylum,refugees');
insert into topics (id, name, keywords) values (5, 'Defence', 'defence,navy,intelligence and security,military,strategic reform');
insert into topics (id, name, keywords) values (6, 'Education', 'education,schools');
insert into topics (id, name, keywords) values (7, 'Community Services', 'community services,family payments,social security,medicare,social policy');
insert into topics (id, name, keywords) values (8, 'Health', 'health,dental,medicare,dementia,tobacco,aged care');
insert into topics (id, name, keywords) values (9, 'Environment', 'environment,sustainab,murray-darling,bushfires,reef,fisher,solar,water,anti-dumping,marine');
insert into topics (id, name, keywords) values (10, 'Parliament', 'deputy speaker,rearrangement,leave of absence,withdrawal');
insert into topics (id, name, keywords) values (11, 'Employment', 'workplace relations,employment,newstart allowance');
insert into topics (id, name, keywords) values (12, 'Economy', 'econom,prices,exports,budget,treasury,tax');
insert into topics (id, name, keywords) values (13, 'Foreign affairs', 'humanitarian,united states,indonesia,human rights,afganistan');
insert into topics (id, name, keywords) values (14, 'National Broadband Network', 'national broadband network');
insert into topics (id, name, keywords) values (16, 'Media', 'media,wikileaks');

ALTER TABLE hansard DROP COLUMN topic_id; 
ALTER TABLE hansard ADD COLUMN topic_id int(11) DEFAULT null; 
CREATE INDEX hansard_topic_id ON hansard (topic_id);

update hansard set topic_id = 1 where section_id <> 0 and subsection_id = 0;
*/

DROP TABLE IF EXISTS `keywords`;
CREATE TABLE `keywords` (
  `id` int(11) DEFAULT NULL auto_increment PRIMARY KEY,
  `results` text,
  `submitted` text,
  `extracted` date NOT NULL,
  `generated` date NOT NULL,
  KEY `extracted` (`extracted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
