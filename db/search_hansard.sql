-- TODO move to trigger??
update hansards set partied = (party not in ('CWM', 'DPRES', 'Speaker', 'President', 'PRES', 'SPK', 'Deputy')) where partied is null;
update hansards set stripped_html = regexp_replace(html, '<(\w+)\s+.*?>', ' ', 'g') where stripped_html is null;
update hansards set party = m.party from member m where  speaker_id = m.member_id and hansards.party = '';
