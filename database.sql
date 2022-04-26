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
  date BIGINT NOT NULL,
  summary VARCHAR(128) NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email text NOT NULL,
  response VARCHAR(1000) NOT NULL,
  helpfulness INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Photos (
  id SERIAL NOT NULL,
  review_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE chars (
  id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  name VARCHAR(8) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE characteristics_reviews (
  id SERIAL UNIQUE NOT NULL,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE characteristics (
  id SERIAL UNIQUE,
  product_id INTEGER NOT NULL,
  characteristic_id INTEGER NOT NULL,
  name VARCHAR(12) NOT NULL,
  value INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE Reviews2 (
  id SERIAL UNIQUE,
  product_id SERIAL NOT NULL,
  rating INTEGER NOT NULL,
  date BIGINT NOT NULL,
  summary VARCHAR(128) NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email text NOT NULL,
  response VARCHAR(1000) NOT NULL,
  helpfulness INT NOT NULL,
  photos JSON DEFAULT '[]',
  PRIMARY KEY (id)
);


-- ---
-- Table Characteristics
-- ---


-- ---
-- Table Photos
-- ---

-- ---
-- Foreign Keys
-- ---

-- ALTER TABLE Photos ADD FOREIGN KEY (review_id) REFERENCES Reviews (id);
-- ALTER TABLE characteristics_reviews ADD FOREIGN KEY (review_id) REFERENCES Reviews (id);
-- ALTER TABLE characteristics_reviews ADD FOREIGN KEY (characteristic_id) REFERENCES Chars (id);

--ALTER TABLE Photos ADD FOREIGN KEY (review_id) REFERENCES Reviews (review_id); match these instead of review_id.

--IMPORT CSVs
\copy reviews FROM './reviews.csv' WITH (FORMAT CSV, HEADER);
\copy photos FROM './reviews_photos.csv' WITH (FORMAT CSV, HEADER);
\copy chars FROM './characteristics.csv' WITH (FORMAT CSV, HEADER);
\copy characteristics_reviews FROM './characteristic_reviews.csv' WITH (FORMAT CSV, HEADER);

--Create Characteristics Table
INSERT INTO characteristics (product_id, characteristic_id, name, value)
SELECT chars.product_id, xchars.characteristic_id, chars.name, xchars.value
FROM chars INNER JOIN
( SELECT * FROM characteristics_reviews
  RIGHT JOIN (SELECT * FROM generate_series(1,3347679) characteristic_id) series
  USING (characteristic_id)
  ORDER BY characteristic_id ASC
) xchars
ON chars.id = xchars.characteristic_id
ORDER BY xchars.characteristic_id;

INSERT INTO reviews2 (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos)
SELECT reviews.product_id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommend, reviews.reported, reviews.reviewer_name,
  reviews.reviewer_email, reviews.response, reviews.helpfulness, COALESCE(photourl.photos, '[]') photos FROM reviews
LEFT JOIN (SELECT review_id, JSON_AGG(JSON_BUILD_OBJECT('url', url)) photos FROM photos GROUP BY review_id) photourl
ON photourl.review_id = reviews.id;

-- ---
-- PARTIAL INDEXES
-- ---

--good results:
//Reviews2
CREATE INDEX idx_rvw2_product_id ON reviews2(product_id);
//Chracterisitics
CREATE INDEX idx_char_product_id ON characteristics(product_id);
CREATE INDEX idx_characteristics_name on characteristics(name);

-- CREATE INDEX idx_rvw_product_id ON reviews(product_id);

-- //Reviews2
-- CREATE INDEX idx_rvw2_product_id ON reviews2(product_id);

-- //Indexs for reviews for META
-- CREATE INDEX idx_rvw2_recommend ON reviews2(recommend);
-- CREATE INDEX idx_rvw2_rating ON reviews2(rating);

-- //Chracterisitics
-- CREATE INDEX idx_char_product_id ON characteristics(product_id);
-- CREATE INDEX idx_characteristics_name on characteristics(name);

-- CREATE INDEX idx_rvw2_char_id ON characteristics(characteristic_id);

--not sure if below works well?...
--

--CREATE INDEX idx_rvw_rec ON reviews(recommend);
--CREATE INDEX idx_rvw_rating on reviews(rating);
--CREATE INDEX idx_rvw_reported on reviews(reported);
--CREATE INDEX idx_rvw_rvw_id ON Reviews(reviews_id);
--RECOMMENDED, REPORTED, RATING, AND CHARACTERISTIC NAME.


UPDATE reviews2 SET date=date/1000;
ALTER TABLE reviews2 ALTER date TYPE TIMESTAMP WITHOUT TIME ZONE USING to_timestamp(date) AT TIME ZONE 'UTC';

DROP TABLE reviews;
DROP TABLE photos;
DROP TABLE chars;
DROP TABLE characteristic_reviews;
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