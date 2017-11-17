/*
 * tables.sql
 */

CREATE TABLE users (
    id    varchar(50) primary key,
    token text        not null,
    name  text        not null,
    email text        not null
);

CREATE TABLE samples (
    id          serial  primary key,
    template_id integer not null,
    tags        jsonb   not null,
    steps       jsonb   not null
);

-- vim:et
