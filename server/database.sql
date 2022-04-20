-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table Review
--
-- ---

DROP TABLE IF EXISTS Review;

CREATE TABLE Reviews (
  product_id SERIAL NOT NULL,
  review_id SERIAL NOT NULL UNIQUE,
  rating INTEGER NOT NULL,
  summary VARCHAR(60) NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  response VARCHAR(1000) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date TIMESTAMP NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email text NOT NULL,
  helpfulness INT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table Characteristics
--
-- ---

CREATE TABLE Characteristics (
  id SERIAL NOT NULL,
  product_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Characteristics (
  id INT NOT NULL,
  review_id INT NOT NULL,
  url text NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table Photos
--
-- ---

DROP TABLE IF EXISTS Photos;

CREATE TABLE Photos (
  review_id INTEGER NOT NULL,
  id SERIAL NOT NULL,
  url TEXT NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE Characteristics ADD FOREIGN KEY (product_id) REFERENCES Reviews (product_id);
ALTER TABLE Photos ADD FOREIGN KEY (review_id) REFERENCES Reviews (review_id);

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