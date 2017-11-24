/*
 * tables.sql
 */

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;



CREATE TYPE Status AS ENUM (
    'NOT_DONE',
    'DONE',
    'IN_PROGRESS',
    'ERROR',
    'ON_HOLD'
);


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
    tags        jsonb   not null,
    notes       text        null,
    created     date    not null,
    modified    date        null,
    completed   date        null
);

CREATE TABLE steps (
    id             serial  primary key,
    index          integer not null,
    sample_id      integer not null,
    status         Status  not null,
    name           text    not null,
    notes          text        null,
    "completionFn" integer     null
);

/* CREATE TABLE sample_comments (
    id          serial  primary key,
    sample_id   integer not null,
    user_id     integer not null,
    date        date    not null,
    description text    not null
); */

/* CREATE TABLE step_comments (
    id          serial  primary key,
    sample_id   integer not null,
    step_index  integer     null,
    user_id     integer not null,
    date        date    not null,
    description text    not null
); */


CREATE TABLE templates (
    id          serial  primary key,
    name        text    not null
);
CREATE TABLE template_steps (
    id             serial  primary key,
    template_id    integer not null,
    index          integer not null,
    name           text    not null,
    "completionFn" integer     null,
    unique (template_id, index)
);

INSERT INTO templates (name) VALUES ('experiment');
INSERT INTO template_steps (template_id, index, name, "completionFn") VALUES
    (1, 0, 'Extract', NULL),
    (1, 1, 'Pack', NULL),
    (1, 2, 'Analyze', 1),
    (1, 3, 'Compute', NULL),
    (1, 4, 'Report', NULL)
;
INSERT INTO templates (name) VALUES ('request');
INSERT INTO template_steps (template_id, index, name, "completionFn") VALUES
    (2, 0, 'Write', NULL),
    (2, 1, 'Review', NULL),
    (2, 2, 'Send', 1),
    (2, 3, 'Response', NULL),
    (2, 4, 'Read', NULL),
    (2, 5, 'Archive', NULL),
    (2, 6, 'Sleep', NULL)
;

CREATE TABLE completion_functions (
    id          serial  primary key,
    name        text    not null,
    code        text    not null
);
INSERT INTO completion_functions (name, code) VALUES (
'has-one-file',
'function(step, sample) {
    return step.files.length > 0
}'
);


CREATE TABLE history (
    id          serial  primary key,
    sample_id   integer not null,
    step_index  integer     null,
    user_id     integer not null,
    date        date    not null,
    description jsonb   not null
);


CREATE TABLE files (
    id          serial       primary key,
    sample_id   integer      not null,
    step_index  integer          null,
    mime        varchar(100) not null,
    name        text         not null
);

-- vim:et
