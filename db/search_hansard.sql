-- ALTER TABLE hansards ADD COLUMN stripped_html character varying;
-- ALTER TABLE hansards ADD COLUMN searchable tsvector;
-- ALTER TABLE hansards ADD COLUMN party character varying(100) DEFAULT ''::character varying NOT NULL;
-- CREATE INDEX searchable_idx ON hansards USING gin(searchable);
-- CREATE INDEX date_party_idx ON hansards(party, date);

-- ALTER TABLE hansards ADD COLUMN partied boolean;
-- CREATE INDEX partied_idx ON hansards USING hansards(partied);

-- update hansards set partied = (party not in ('CWM', 'DPRES', 'Speaker', 'President', 'PRES', 'SPK', 'Deputy')) where partied is null;

-- update hansards set stripped_html = regexp_replace(html, '<(\w+)\s+.*?>', ' ', 'g') where stripped_html is null;
-- UPDATE hansards SET searchable = to_tsvector('english', html) where searchable is null;
-- update hansards set party = m.party from member m where  speaker_id = m.member_id where party = '';

CREATE OR REPLACE FUNCTION CountInString(text,text)
  RETURNS integer AS $$
  SELECT(Length($1) - Length(RegExp_Replace($1, $2, '', 'ing'))) / Length($2) 
$$ LANGUAGE SQL IMMUTABLE;
