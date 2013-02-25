drop table  if exists wordchoice_tokens_cluster_ap;
CREATE TABLE wordchoice_tokens_cluster_ap (
    word1 varchar(100),
    token1 varchar(100),
    word2 varchar(100),
    token2 varchar(100),
    word3 varchar(100),
    token3 varchar(100),
    hansard_id character varying(26) DEFAULT NULL::character varying NOT NULL,
    party character varying(100) DEFAULT ''::character varying NOT NULL,
    date date NOT NULL,
    week varchar(7) NOT NULL
);

CREATE OR REPLACE FUNCTION calculate_extra_wordchoice_tokens () RETURNS trigger AS '
BEGIN
  NEW.week = extract(year from NEW.date) || ''-'' || lpad(extract(week from NEW.date)::text, 2, ''0'');
  RETURN NEW;
END;
' LANGUAGE plpgsql;

DROP TRIGGER if exists extra_wordchoice_tokens on wordchoice_tokens_cluster_ap;
CREATE TRIGGER extra_wordchoice_tokens BEFORE INSERT OR UPDATE
ON wordchoice_tokens_cluster_ap FOR EACH ROW
EXECUTE PROCEDURE calculate_extra_wordchoice_tokens ();

CREATE INDEX wtap_party_date_idx ON wordchoice_tokens_cluster_ap USING btree (party, date);
CREATE INDEX wtap_token1_idx ON wordchoice_tokens_cluster_ap USING btree (token1);
CREATE INDEX wtap_token12_idx ON wordchoice_tokens_cluster_ap USING btree (token1, token2);
CREATE INDEX wtap_token123_idx ON wordchoice_tokens_cluster_ap USING btree (token1, token2, token3);
CREATE INDEX wtap_word1_idx ON wordchoice_tokens_cluster_ap USING btree (word1);
CREATE INDEX wtap_word12_idx ON wordchoice_tokens_cluster_ap USING btree (word1, word2);
CREATE INDEX wtap_word123_idx ON wordchoice_tokens_cluster_ap USING btree (word1, word2, word3);
CREATE INDEX wtap_week_idx ON wordchoice_tokens_cluster_ap USING btree (week);

drop table  if exists wordchoice_tokens_cluster_po;
CREATE TABLE wordchoice_tokens_cluster_po (
    word1 varchar(100),
    token1 varchar(100),
    word2 varchar(100),
    token2 varchar(100),
    word3 varchar(100),
    token3 varchar(100),
    hansard_id character varying(26) DEFAULT NULL::character varying NOT NULL,
    party character varying(100) DEFAULT ''::character varying NOT NULL,
    date date NOT NULL,
    week varchar(7) NOT NULL
);

CREATE OR REPLACE FUNCTION calculate_extra_wordchoice_tokens () RETURNS trigger AS '
BEGIN
  NEW.week = extract(year from NEW.date) || ''-'' || lpad(extract(week from NEW.date)::text, 2, ''0'');
  RETURN NEW;
END;
' LANGUAGE plpgsql;

DROP TRIGGER if exists extra_wordchoice_tokens on wordchoice_tokens_cluster_po;
CREATE TRIGGER extra_wordchoice_tokens BEFORE INSERT OR UPDATE
ON wordchoice_tokens_cluster_po FOR EACH ROW
EXECUTE PROCEDURE calculate_extra_wordchoice_tokens ();

CREATE INDEX wtpo_party_date_idx ON wordchoice_tokens_cluster_po USING btree (party, date);
CREATE INDEX wtpo_token1_idx ON wordchoice_tokens_cluster_po USING btree (token1);
CREATE INDEX wtpo_token12_idx ON wordchoice_tokens_cluster_po USING btree (token1, token2);
CREATE INDEX wtpo_token123_idx ON wordchoice_tokens_cluster_po USING btree (token1, token2, token3);
CREATE INDEX wtpo_word1_idx ON wordchoice_tokens_cluster_po USING btree (word1);
CREATE INDEX wtpo_word12_idx ON wordchoice_tokens_cluster_po USING btree (word1, word2);
CREATE INDEX wtpo_word123_idx ON wordchoice_tokens_cluster_po USING btree (word1, word2, word3);
CREATE INDEX wtpo_week_idx ON wordchoice_tokens_cluster_po USING btree (week);
