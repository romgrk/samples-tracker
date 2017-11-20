/*
 * tables.sql
 */

DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
    key varchar(100) primary key,
    value jsonb      not null
);
INSERT INTO settings VALUES
    ('alertDelay', '1209600000'), -- 14 days, in milliseconds
    ('whitelist',  '["rom7011@gmail.com"]') -- users allowed to login/signup
;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id    varchar(50) primary key,
    token text        not null,
    name  text        not null,
    email text        not null
);

DROP TABLE IF EXISTS samples;
CREATE TABLE samples (
    id          serial  primary key,
    template_id integer not null,
    tags        jsonb   not null,
    steps       jsonb   not null
);

DROP TABLE IF EXISTS samples;
CREATE TABLE samples (
    id          serial  primary key,
    name        text    not null,
    template_id integer not null,
    tags        jsonb   not null,
    created     date    not null,
    modified    date        null,
    steps       jsonb   not null
);
DROP TABLE IF EXISTS sample_comments;
CREATE TABLE sample_comments (
    id          serial  primary key,
    sample_id   integer not null,
    user_id     integer not null,
    date        date    not null,
    description text    not null
);

DROP TABLE IF EXISTS step_comments;
CREATE TABLE step_comments (
    id          serial  primary key,
    sample_id   integer not null,
    step_index  integer     null,
    user_id     integer not null,
    date        date    not null,
    description text    not null
);


DROP TABLE IF EXISTS templates;
CREATE TABLE templates (
    id          serial  primary key,
    name        text    not null,
    steps       jsonb   not null
);

/* steps (
    name         text not null,
    completionFn text null
); */
/* CREATE TYPE Status AS ENUM (
    'not_done',
    'done',
    'in_progress',
    'error',
    'on_hold'
);
*/
/* steps_data (
    id           serial  not null,
    index        integer not null,
    status       Status not null,
    completionFn text null,

    constraint "PKey" primary key ("id", "index")
); */

DROP TABLE IF EXISTS history;
CREATE TABLE history (
    id          serial  primary key,
    sample_id   integer not null,
    step_index  integer     null,
    user_id     integer not null,
    date        date    not null,
    description text    not null
);


DROP TABLE IF EXISTS files;
CREATE TABLE files (
    id          serial       primary key,
    sample_id   integer      not null,
    step_index  integer          null,
    mime        varchar(100) not null,
    name        text         not null
);

-- vim:et
