begin;
DROP TABLE IF EXISTS summaries;
CREATE TABLE summaries (
  time timestamp DEFAULT NULL
);
insert into summaries (time) values (current_timestamp); 
commit;
