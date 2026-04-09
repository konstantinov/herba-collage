CREATE TABLE sessions (id text primery key, expires datetie, count int, comment text);
CREATE TABLE collages (id integer primary key,name text, sessionId text, data text, filename text, updated timestamp default current_timestamp);
CREATE TRIGGER collages_updated after update on collages for each row begin update collages set updated = current_timestamp where id = OLD.id; end;
CREATE INDEX session_date on collages (sessionId, updated);
CREATE TABLE weights (id integer primary key, collageId integer not null, data text, date date default current_date, unique(collageId, date));
CREATE INDEX weights_collage on weights (collageId);
CREATE TRIGGER delete_collage after delete on collages for each row begin delete from weights where collageId = OLD.id; end;
