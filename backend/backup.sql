--
-- PostgreSQL database dump
--

\restrict IzpXlSYHdbWPRMjEi35UQgGOeharQojg07381LQK7E74O6mP9hPxDasQpp93abA

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: user_refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_refresh_tokens (
    refresh_token text NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.user_refresh_tokens OWNER TO postgres;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sessions (
    user_id integer NOT NULL,
    session_token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: user_refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_refresh_tokens (refresh_token, user_id, created_at, expires_at) FROM stdin;
b1863e06-4984-476b-a2fb-62079c77276e	7	2025-11-15 04:02:02.28719	2025-12-15 04:02:02.257
fa331d63-7984-494a-bba4-8dbc6cc0b5b7	3	2025-11-19 04:22:00.359372	2025-12-19 04:22:00.331
3e60e328-d821-4990-bbc4-1d7d7fb848f9	3	2025-11-19 09:28:48.821007	2025-12-19 09:28:48.807
7b58b57a-e69a-4924-beac-5c6ec39aceaf	3	2025-11-19 09:56:38.909235	2025-12-19 09:56:38.871
afa60503-617a-4e7b-881f-fab752e38f7c	1	2025-11-28 08:54:57.709996	2025-12-28 08:54:57.693
c8465164-285d-43d4-9aaa-22768302b196	1	2025-12-01 04:37:32.661793	2025-12-31 04:37:32.451
87a2fa6b-6cd2-4c4c-959f-16a0af0e9716	1	2025-12-01 05:01:40.738612	2025-12-31 05:01:40.726
b7353da7-6852-4019-ba97-8a5c7138ca0a	1	2025-12-01 05:19:55.635853	2025-12-31 05:19:55.579
1bb27d74-6fb9-4871-b548-81d2ba8008f4	1	2025-12-01 05:23:04.810298	2025-12-31 05:23:04.794
17bb7e6a-0d3b-4d97-9091-f6105911fce3	1	2025-12-01 09:42:09.167664	2025-12-31 09:42:09.087
80ed5676-a0ff-4fef-bb4d-adcfb2d35cf0	1	2025-12-01 09:43:22.42544	2025-12-31 09:43:22.399
055494e4-beec-48cd-b630-9fa6f7bc7279	1	2025-12-01 09:45:06.911777	2025-12-31 09:45:06.891
2c5ec74f-bdd9-416b-ada1-e80f1254d970	1	2025-12-01 09:45:44.465366	2025-12-31 09:45:44.436
fa68269c-9a58-4edd-81e5-606787a7879a	1	2025-12-01 09:46:57.252002	2025-12-31 09:46:57.065
68aab01a-1de5-4c4a-b7db-269b925bc7d8	1	2025-12-02 07:22:29.520832	2026-01-01 07:22:29.514
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_sessions (user_id, session_token, expires_at, created_at, updated_at) FROM stdin;
4	1eed06c6-71f2-4649-a3fc-b289a67d231f	2025-12-10 08:09:45.515	2025-11-10 08:09:45.520528	2025-11-10 08:09:45.520528
5	8df3b92f-755b-4d0f-aafe-6b5f6d98e269	2025-12-12 11:51:35.837	2025-11-12 11:51:35.839951	2025-11-12 11:51:35.839951
6	d4fe6e4b-cb89-4972-ad5b-a8789aaad381	2025-12-12 11:59:09.881	2025-11-12 11:59:09.882961	2025-11-12 11:59:09.882961
6	b25496cc-459c-4601-a181-680314b3e322	2025-12-12 12:03:36.403	2025-11-12 12:03:36.405474	2025-11-12 12:03:36.405474
6	e64cf7ed-cb44-416a-91c9-354d063fec44	2025-12-12 12:06:48.337	2025-11-12 12:06:48.340875	2025-11-12 12:06:48.340875
7	b1863e06-4984-476b-a2fb-62079c77276e	2025-12-15 04:02:02.256	2025-11-15 04:02:02.263703	2025-11-15 04:02:02.263703
3	e2d51091-bdcf-4b36-baa7-4c449a74adc9	2025-12-17 12:29:29.192	2025-11-17 12:29:29.198341	2025-11-17 12:29:29.198341
3	fa331d63-7984-494a-bba4-8dbc6cc0b5b7	2025-12-19 04:22:00.328	2025-11-19 04:22:00.333005	2025-11-19 04:22:00.333005
3	3e60e328-d821-4990-bbc4-1d7d7fb848f9	2025-12-19 09:28:48.806	2025-11-19 09:28:48.809607	2025-11-19 09:28:48.809607
3	7b58b57a-e69a-4924-beac-5c6ec39aceaf	2025-12-19 09:56:38.869	2025-11-19 09:56:38.877953	2025-11-19 09:56:38.877953
1	afa60503-617a-4e7b-881f-fab752e38f7c	2025-12-28 08:54:57.692	2025-11-28 08:54:57.698885	2025-11-28 08:54:57.698885
1	c8465164-285d-43d4-9aaa-22768302b196	2025-12-31 04:37:32.387	2025-12-01 04:37:32.495147	2025-12-01 04:37:32.495147
1	87a2fa6b-6cd2-4c4c-959f-16a0af0e9716	2025-12-31 05:01:40.723	2025-12-01 05:01:40.728742	2025-12-01 05:01:40.728742
1	b7353da7-6852-4019-ba97-8a5c7138ca0a	2025-12-31 05:19:55.574	2025-12-01 05:19:55.589832	2025-12-01 05:19:55.589832
1	1bb27d74-6fb9-4871-b548-81d2ba8008f4	2025-12-31 05:23:04.792	2025-12-01 05:23:04.796844	2025-12-01 05:23:04.796844
1	17bb7e6a-0d3b-4d97-9091-f6105911fce3	2025-12-31 09:42:09.08	2025-12-01 09:42:09.099642	2025-12-01 09:42:09.099642
1	80ed5676-a0ff-4fef-bb4d-adcfb2d35cf0	2025-12-31 09:43:22.399	2025-12-01 09:43:22.403994	2025-12-01 09:43:22.403994
1	055494e4-beec-48cd-b630-9fa6f7bc7279	2025-12-31 09:45:06.89	2025-12-01 09:45:06.893644	2025-12-01 09:45:06.893644
1	2c5ec74f-bdd9-416b-ada1-e80f1254d970	2025-12-31 09:45:44.435	2025-12-01 09:45:44.442565	2025-12-01 09:45:44.442565
1	fa68269c-9a58-4edd-81e5-606787a7879a	2025-12-31 09:46:57.054	2025-12-01 09:46:57.113948	2025-12-01 09:46:57.113948
1	4b355a39-a569-4d51-81e2-3e56c4e77a0b	2026-01-01 07:22:28.685	2025-12-02 07:22:28.692169	2025-12-02 07:22:28.692169
1	68aab01a-1de5-4c4a-b7db-269b925bc7d8	2026-01-01 07:22:29.514	2025-12-02 07:22:29.520078	2025-12-02 07:22:29.520078
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, updated_at) FROM stdin;
1	doremi31618	doremi31618@gmail.com	$scrypt$n=16384,r=8,p=1$TXTrOlrPucU41q0WzIhEuw$3t7Kqlr7uWmgRm4dgNaHS4ZrM41WM0w3UQdoH18tR633ClOMl66gbY2/Rz0mU5Asc8nimxxWpwjGcVPs//TegA	2025-10-28 13:59:34.137	2025-10-28 13:59:34.137
2	ssss	kkk@sss.ccc	$2b$10$.dqGuTf5vlQUnFljvZxZs.ufIaKt1Pk.d2OCmvidS2ub.TO2ZAfz6	2025-11-05 15:26:56.134964	2025-11-05 15:26:56.134964
3	ssssa	kkk@sss.ccca	$2b$10$.by79pgZVXByHYsIgT3zI.mW/hbXB9/qpNaMW4nH1.TTQlN.vL2bq	2025-11-05 15:41:04.251964	2025-11-05 15:41:04.251964
4	ssssaa	kkk@sss.cccad	$2b$10$OXMO36tC4OBZKGyIwtQlyeQTxyn.k2ijow21yBkWTVN47cRhg6eAS	2025-11-10 08:09:45.481148	2025-11-10 08:09:45.481148
5	eric	eric@gmail.com	$2b$10$kvEUslrxTGK3P9crpFs2eech4x6Bw/VMasLv.M2rhMGaRlgdIklma	2025-11-12 11:51:35.824657	2025-11-12 11:51:35.824657
6	eric	doremi31618x@gmail.com	$2b$10$qh8tGZzhC8s3rM4cP3cuBu2Pzd/eZMdWrhKQ8yMIJHHpP9lmZBWCy	2025-11-12 11:59:09.878929	2025-11-12 11:59:09.878929
7	ssssaad	kkk@sss.cccada	$2b$10$vqyk/Jdd28lcCqxLUASzzO8Q2cJGhJJyouYtasj09oUP4IlizqS86	2025-11-15 04:02:02.248792	2025-11-15 04:02:02.248792
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: user_refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (refresh_token);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (session_token);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_refresh_tokens user_refresh_tokens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_refresh_tokens
    ADD CONSTRAINT user_refresh_tokens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict IzpXlSYHdbWPRMjEi35UQgGOeharQojg07381LQK7E74O6mP9hPxDasQpp93abA

