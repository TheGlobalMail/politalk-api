CREATE OR REPLACE FUNCTION calculate_extra_hansards () RETURNS trigger AS '
BEGIN
  NEW.party = (select party from member m where  NEW.speaker_id = m.member_id limit 1) || '''';
  NEW.partied = (NEW.party not in (''CWM'', ''DPRES'', ''Speaker'', ''President'', ''PRES'', ''SPK'', ''Deputy'', ''Deputy-Speaker'', '''') and NEW.party is not null);
  NEW.stripped_html = regexp_replace(NEW.html, ''<.*?>'', '' '', ''g'');
  RETURN NEW;
END;
' LANGUAGE plpgsql;

DROP TRIGGER extra_hansards on hansards;
CREATE TRIGGER extra_hansards BEFORE INSERT OR UPDATE
ON hansards FOR EACH ROW
EXECUTE PROCEDURE calculate_extra_hansards ();
