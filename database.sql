-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table Review
--
-- ---
DROP DATABASE IF EXISTS sdc_lw;
CREATE DATABASE sdc_lw;

\c sdc_lw;

CREATE TABLE Reviews (
  id SERIAL UNIQUE NOT NULL,
  product_id SERIAL NOT NULL,
  rating INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  summary VARCHAR(60) NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email text NOT NULL,
  response VARCHAR(1000) NOT NULL,
  helpfulness INT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table Characteristics
-- ---

CREATE TABLE characteristics (
  id SERIAL NOT NULL,
  product_id INTEGER NOT NULL,
  name VARCHAR(12) NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE chars (
  id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  name VARCHAR(8) NOT NULL,
);

CREATE TABLE characteristics_reviews (
  id SERIAL UNIQUE NOT NULL,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  name VARCHAR(12) NOT NULL,
);

-- ---
-- Table Photos
-- ---

CREATE TABLE Photos (
  id SERIAL NOT NULL,
  review_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE Photos ADD FOREIGN KEY (review_id) REFERENCES Reviews (id);
ALTER TABLE characteristics_reviews ADD FOREIGN KEY (review_id) REFERENCES Reviews (id);
ALTER TABLE characteristics_reviews ADD FOREIGN KEY (characteristic_id) REFERENCES Chars (id);

--ALTER TABLE Photos ADD FOREIGN KEY (review_id) REFERENCES Reviews (review_id); match these instead of review_id.

--Create Characteristics Table
INSERT INTO characteristics (id, product_id, name, value)
SELECT characteristics_reviews.id, chars.product_id, chars.name, characteristics_reviews.value
FROM chars INNER JOIN characteristics_reviews
ON chars.id = characteristics_reviews.characteristic_id
ORDER BY characteristics_reviews.characteristic_id;

-- ---
-- PARTIAL INDEXES
-- ---


CREATE INDEX idx_rvw_product_id ON reviews(product_id);
--CREATE INDEX idx_rvw_rec ON reviews(recommend);
--CREATE INDEX idx_rvw_rating on reviews(rating);
--CREATE INDEX idx_rvw_reported on reviews(reported);
--CREATE INDEX idx_rvw_rvw_id ON Reviews(reviews_id);
--RECOMMENDED, REPORTED, RATING, AND CHARACTERISTIC NAME.

-- ---
-- Table Properties
-- ---

-- ALTER TABLE Review ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Characteristics ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE Photos ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---
-- (32123,123,3,"yeah", true, Coool, cooool, 1999-01-08, gene, 8, false)
-- INSERT INTO Review (product_id,review_id,rating,summary,recommend,response,body,date,reviewer_name,helpfulness,reported) VALUES
-- (,,,,,,,,,,);
-- INSERT INTO Characteristics (id,product_id,name,value) VALUES
-- (,,,);
-- INSERT INTO Photos (review_id,id,url) VALUES
-- (,,);

--IMPORT CSVs
\copy photos FROM './reviews_photos.csv' WITH (FORMAT CSV, HEADER);
\copy reviews FROM './reviews.csv' WITH (FORMAT CSV, HEADER);
\copy characteristics_reviews FROM './characteristic_reviews.csv' WITH (FORMAT CSV, HEADER);
\copy chars FROM './characteristics.csv' WITH (FORMAT CSV, HEADER);