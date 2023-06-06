CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username varchar(100) not null,
    password_digest varchar not null,
    email varchar(255) not null,
    phone varchar(100) not null
);
