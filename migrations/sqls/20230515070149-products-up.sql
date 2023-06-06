/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS products ( 
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    description VARCHAR(255), 
    price DECIMAL(10, 2) NOT NULL, 
    link_image VARCHAR(255) 
    );