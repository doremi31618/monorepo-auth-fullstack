SELECT "id","email","name","password","created_at","updated_at"
FROM "users"
WHERE "users"."email" = 'kkk';


select "id", "email", "name", "password", "created_at", "updated_at" from "users" where "users"."email" = 'sss';


CREATE EXTENSION IF NOT EXISTS "pgcrypto";