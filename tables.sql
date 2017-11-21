/*
 * tables.sql
 */

DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS samples;
DROP TABLE IF EXISTS sample_comments;
DROP TABLE IF EXISTS step_comments;
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS steps;
DROP TABLE IF EXISTS history;
DROP TABLE IF EXISTS files;


CREATE TABLE settings (
    key varchar(100) primary key,
    value jsonb      not null
);
INSERT INTO settings VALUES
    ('alertDelay', '1209600000'), -- 14 days, in milliseconds
    ('whitelist',  '["rom7011@gmail.com"]') -- users allowed to login/signup
;

CREATE TABLE users (
    id    varchar(50) primary key,
    token text        not null,
    name  text        not null,
    email text        not null
);

CREATE TABLE samples (
    id          serial  primary key,
    name        text    not null,
    template_id integer not null,
    tags        jsonb   not null,
    created     date    not null,
    modified    date        null,
    steps       jsonb   not null
);
CREATE TABLE sample_comments (
    id          serial  primary key,
    sample_id   integer not null,
    user_id     integer not null,
    date        date    not null,
    description text    not null
);

CREATE TABLE step_comments (
    id          serial  primary key,
    sample_id   integer not null,
    step_index  integer     null,
    user_id     integer not null,
    date        date    not null,
    description text    not null
);


CREATE TABLE templates (
    id          serial  primary key,
    name        text    not null
);
CREATE TABLE steps (
    id             serial  primary key,
    template_id    integer not null,
    name           text    not null,
    "completionFn" text        null
);

INSERT INTO templates (name) VALUES ('Experiments');
INSERT INTO steps (template_id, name, "completionFn") VALUES
    (1, 'Extract', NULL),
    (1, 'Pack', NULL),
    (1, 'Analyze', 'function(step, sample) { return step.files.length > 0 }'),
    (1, 'Compute', NULL),
    (1, 'Report', NULL)
;
INSERT INTO templates (name) VALUES ('Requests');
INSERT INTO steps (template_id, name, "completionFn") VALUES
    (2, 'Write', NULL),
    (2, 'Review', NULL),
    (2, 'Send', 'function(step, sample) { return step.files.length > 0 }'),
    (2, 'Response', NULL),
    (2, 'Read', NULL),
    (2, 'Archive', NULL),
    (2, 'Sleep', NULL)
;

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

CREATE TABLE history (
    id          serial  primary key,
    sample_id   integer not null,
    step_index  integer     null,
    user_id     integer not null,
    date        date    not null,
    description text    not null
);


CREATE TABLE files (
    id          serial       primary key,
    sample_id   integer      not null,
    step_index  integer          null,
    mime        varchar(100) not null,
    name        text         not null
);

-- vim:et
