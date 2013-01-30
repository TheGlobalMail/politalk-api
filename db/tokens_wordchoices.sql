drop table  if exists wordchoice_tokens_cluster_a;
CREATE TABLE wordchoice_tokens_cluster_a (
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

DROP TRIGGER if exists extra_wordchoice_tokens on wordchoice_tokens;
CREATE TRIGGER extra_wordchoice_tokens BEFORE INSERT OR UPDATE
ON wordchoice_tokens_cluster_a FOR EACH ROW
EXECUTE PROCEDURE calculate_extra_wordchoice_tokens ();

CREATE INDEX wta_party_date_idx ON wordchoice_tokens_cluster_a USING btree (party, date);
CREATE INDEX wta_token1_idx ON wordchoice_tokens_cluster_a USING btree (token1);
CREATE INDEX wta_token12_idx ON wordchoice_tokens_cluster_a USING btree (token1, token2);
CREATE INDEX wta_token123_idx ON wordchoice_tokens_cluster_a USING btree (token1, token2, token3);
CREATE INDEX wta_word1_idx ON wordchoice_tokens_cluster_a USING btree (word1);
CREATE INDEX wta_word12_idx ON wordchoice_tokens_cluster_a USING btree (word1, word2);
CREATE INDEX wta_word123_idx ON wordchoice_tokens_cluster_a USING btree (word1, word2, word3);
CREATE INDEX wta_week_idx ON wordchoice_tokens_cluster_a USING btree (week);
