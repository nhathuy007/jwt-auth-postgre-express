
CREATE DATABASE interview
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
CREATE TABLE public.groups
(
    group_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    group_name character varying COLLATE pg_catalog."default" NOT NULL,
    group_owner character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT groups_pkey PRIMARY KEY (group_id)
)
TABLESPACE pg_default;

ALTER TABLE public.groups
    OWNER to postgres;

CREATE TABLE public.group_member
(
    group_id integer NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT group_member_pkey PRIMARY KEY (group_id, email)
)

TABLESPACE pg_default;
ALTER TABLE public.group_member
    OWNER to postgres;
	
CREATE TABLE public.users
(
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (email)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;