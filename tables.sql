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
    'ON_HOLD',
    'SKIP'
);


CREATE TABLE settings (
    key varchar(100) primary key,
    value jsonb      not null
);
INSERT INTO settings VALUES
    ('alertDelay', '"2 weeks"'),                -- postgres interval
    ('alertEmails',  '["rom7011@gmail.com"]'),  -- emails alerted when step is overdue
    ('whitelist',  '["rom7011@gmail.com","david.bujold@mail.mcgill.ca"]'),    -- users allowed to login/signup
    ('archiveInterval', '"6 months"')           -- delay after which completed samples are not shown
;

CREATE TABLE users (
    id         serial      primary key,
    "googleId" varchar(50) null,
    token      text        null,
    name       text        not null,
    email      text        null,
    password   text        null
);

CREATE TABLE samples (
    id          serial    primary key,
    name        text      not null,
    tags        jsonb     not null,
    notes       text          null,
    created     timestamp not null,
    modified    timestamp     null,
    completed   timestamp     null
);

CREATE TABLE steps (
    id             serial    primary key,
    index          integer   not null,
    sample_id      integer   not null,
    status         Status    not null,
    name           text      not null,
    notes          text          null,
    started        timestamp     null,
    alerted        timestamp     null,
    "alertDelay"   interval  not null,
    "completionFn" integer       null
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
    id             serial   primary key,
    template_id    integer  not null,
    index          integer  not null,
    name           text     not null,
    "alertDelay"   interval not null,
    "completionFn" integer      null,
    unique (template_id, index)
);


CREATE TABLE completion_functions (
    id          serial  primary key,
    name        text    not null,
    code        text    not null
);
/* INSERT INTO completion_functions (name, code) VALUES (
'has-one-file',
'function(step, sample) {
    return step.files.length > 0
}'
); */


CREATE TABLE history (
    id          serial      primary key,
    sample_id   integer     not null,
    step_index  integer         null,
    user_id     varchar(50)     null,
    date        timestamp   not null,
    description text        not null
);


CREATE TABLE files (
    id          serial       primary key,
    sample_id   integer      not null,
    step_index  integer          null,
    mime        varchar(100) not null,
    name        text         not null
);



INSERT INTO users (id, "googleId", token, name, email, password) VALUES (
    nextval('users_id_seq'),
    null,
    null,
    'System',
    null,
    'f0ll0w'
);

-- Test data


INSERT INTO templates (name) VALUES ('experiment');
INSERT INTO template_steps (template_id, index, name, "alertDelay", "completionFn") VALUES
    (1, 0, 'Extract', '1 second', NULL),
    (1, 1, 'Pack',    '2 weeks', NULL)
;
INSERT INTO templates (name) VALUES ('request');
INSERT INTO template_steps (template_id, index, name, "alertDelay", "completionFn") VALUES
    (2, 0, 'Write',    '2 weeks', NULL),
    (2, 1, 'Review',   '2 weeks', NULL),
    (2, 2, 'Send',     '2 weeks', NULL),
    (2, 3, 'Response', '2 weeks', NULL),
    (2, 4, 'Read',     '2 weeks', NULL),
    (2, 5, 'Archive',  '2 weeks', 1),
    (2, 6, 'Sleep',    '2 weeks', NULL)
;
INSERT INTO users (id, "googleId", token, name, email) VALUES (
    nextval('users_id_seq'),
    '113897916442927912291',
    'ya2GlsZBV75c-JxuuzblrbS7WoUmuWpJDJtgOOdzUcwFOaFt_7ADAIRKpiOXA1A_TtFl1AkMoXAPcqus6_ia',
    'Rom Grk',
    'rom7011@gmail.com'
);

-- vim:et
