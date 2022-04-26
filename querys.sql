--Select all reviews.photos array with Product ID of 4
SELECT reviews.*, COALESCE(photourl.photos, '[]') photos
FROM (SELECT * FROM reviews WHERE product_id = 4) reviews
LEFT JOIN
(SELECT review_id, JSON_AGG(JSON_BUILD_OBJECT('url', url, 'id', id)) photos
FROM photos
WHERE review_id IN
(SELECT reviews.id FROM reviews INNER JOIN photos ON reviews.id = photos.review_id AND reviews.product_id = 4)
GROUP BY review_id) photourl
ON reviews.id = photourl.review_id AND reviews.reported = false LIMIT 5;


--BUILDING CHARACTERISTICS

--RATINGS

{
    "product_id": "65631",

  "ratings": SELECT SUM(RATING) FROM Reviews2 WHERE product_id=65631 AND RATING=4;
  --SELECT RATING FROM Reviews2 WHERE product_id=65631 AND rating IN (1,2,3,4,5);
  --YAAAAAAAS
  -- SELECT rating,COUNT(*)
  --   FROM Reviews2
  --   WHERE product_id=20
  --   GROUP BY RATING;

--Grouped in an object
-- SELECT json_object_agg(ratings.rating, ratings.count) Ratings FROM (
--   	SELECT rating,COUNT(*)
-- 		FROM Reviews2
-- 		WHERE product_id=20
-- 		GROUP BY RATING) as ratings
    "ratings": {
        "1": "15",
        "2": "10",
        "3": "17",
        "4": "146",
        "5": "77"
    },


--SELECT recommend,COUNT(*) FROM reviews where product_id=20 GROUP BY recommend;
-- SELECT COUNT(*) FROM reviews where product_id=20 GROUP BY recommend;


--FORMS THE CORRECT STUFF.
-- SELECT json_object_agg(count.recommend, count.count) FROM
-- (SELECT recommend, COUNT(*) FROM reviews2 where product_id=20 GROUP BY recommend) count;
    "recommended": {
        "false": "31",
        "true": "234"
    },



--SELECT name,AVG(value) FROM characteristics where product_id=1 GROUP BY name;

    "characteristics": {
        "Fit": {
            "id": 220230,
            "value": "4.0880000000000000"
        },
        "Length": {
            "id": 220231,
            "value": "4.1600000000000000"
        },
        "Comfort": {
            "id": 220232,
            "value": "4.2640000000000000"
        },
        "Quality": {
            "id": 220233,
            "value": "4.1920000000000000"
        }
    }
}




--GIANT ASS QUERY BRO
-- SELECT JSON_BUILD_OBJECT('recommended', reviewsMeta.recommend, 'ratings', reviewsMeta.ratings, 'characteristics', reviewsMeta.combinedChar) FROM
-- (
--   SELECT * FROM
--     (SELECT JSON_OBJECT_AGG(recommend_count.recommend, recommend_count.count) recommend, row_number() OVER() FROM
--       (SELECT recommend, COUNT(*) FROM reviews2 where product_id=20 GROUP BY recommend) recommend_count
--     ) recommend_obj
--   INNER JOIN
--     (SELECT JSON_OBJECT_AGG(rating_counts.rating, rating_counts.count) ratings, row_number() OVER() FROM
--       (SELECT rating, COUNT(*) FROM reviews2 WHERE product_id=20 GROUP BY rating) rating_counts
--     ) rating_obj
--   ON recommend_obj.row_number = rating_obj.row_number
--   INNER JOIN
--   (
--   SELECT JSON_OBJECT_AGG(avg_obj.name, avg_obj.value) combinedChar, row_number() OVER() FROM (
-- 	  SELECT name,JSON_BUILD_OBJECT('id', averages.characteristic_id, 'value', averages.value) as value FROM
-- 	  (SELECT name, AVG(value) AS value, characteristic_id
-- 	   FROM characteristics
-- 	   WHERE product_id=1
-- 	   GROUP BY characteristic_id, name) AS averages
-- 	) as avg_obj
--   ) as characteristics_aggregate
-- 	ON rating_obj.row_number = characteristics_aggregate.row_number
-- ) reviewsMeta;







-- SELECT json_object_agg(char.name, char.rating) FROM (
-- 	SELECT name,AVG(value) FROM characteristics where product_id=1 GROUP BY name)
-- 	as char;

-- SELECT row_to_json(x) FROM (
-- 	SELECT name,AVG(value) as value FROM characteristics where product_id=1 GROUP BY name) as X;



-- FORM characteristics name, and object of id and values.
-- SELECT name,JSON_BUILD_OBJECT('id', averages.characteristic_id, 'value', averages.value) FROM
-- (SELECT name, AVG(value) AS value, characteristic_id FROM characteristics WHERE product_id=1 GROUP BY characteristic_id, name) AS averages;






// `SELECT JSON_BUILD_OBJECT('product_id', 1232, 'ratings', reviewsMeta.ratings,'recommended', reviewsMeta.recommend, 'characteristics', reviewsMeta.combinedChar) as characteristics FROM
//       (
//         SELECT * FROM
//           (SELECT JSON_OBJECT_AGG(recommend_count.recommend, recommend_count.count) recommend, row_number() OVER() FROM
//             (SELECT recommend, COUNT(*) FROM reviews2 where product_id=1232 GROUP BY recommend) recommend_count
//           ) recommend_obj
//         INNER JOIN
//           (SELECT JSON_OBJECT_AGG(rating_counts.rating, rating_counts.count) ratings, row_number() OVER() FROM
//             (SELECT rating, COUNT(*) FROM reviews2 WHERE product_id=1232 GROUP BY rating) rating_counts
//           ) rating_obj
//         ON recommend_obj.row_number = rating_obj.row_number
//         INNER JOIN
//         (
//         SELECT JSON_OBJECT_AGG(avg_obj.name, avg_obj.value) combinedChar, row_number() OVER() FROM (
//           SELECT name,JSON_BUILD_OBJECT('id', averages.characteristic_id, 'value', averages.value) as value FROM
//           (SELECT name, AVG(value) AS value, characteristic_id
//            FROM characteristics
//            WHERE product_id=1232
//            GROUP BY characteristic_id, name) AS averages
//         ) as avg_obj
//         ) as characteristics_aggregate
//         ON rating_obj.row_number = characteristics_aggregate.row_number
//       ) reviewsMeta`;



// `WITH reviews AS
//         (SELECT recommend, rating FROM reviews2 WHERE product_id = 1232)
//       SELECT JSON_BUILD_OBJECT('product_id', 1232, 'ratings', reviewsMeta.ratings, 'recommended', reviewsMeta.recommend, 'characteristics', reviewsMeta.agg_chars) characteristics FROM
//         (
//         SELECT * FROM
//           (SELECT JSON_OBJECT_AGG(recommend_count.recommend, recommend_count.count) recommend, row_number() OVER() FROM
//             (SELECT recommend, COUNT(*) FROM reviews GROUP BY recommend) recommend_count
//           ) recommend_obj
//         INNER JOIN
//           (SELECT JSON_OBJECT_AGG(rating_counts.rating, rating_counts.count) ratings, row_number() OVER() FROM
//             (SELECT rating, COUNT(*) FROM reviews GROUP BY rating) rating_counts
//           ) rating_obj
//         ON recommend_obj.row_number = rating_obj.row_number
//         INNER JOIN
//           (
//           SELECT JSON_OBJECT_AGG(chars.name, chars.average) AS agg_chars, row_number() OVER() FROM
//             (SELECT averages.name, JSON_BUILD_OBJECT('id', averages.characteristic_id, 'value', averages.value) average FROM
//               (SELECT name, AVG(value) AS value, characteristic_id FROM characteristics WHERE product_id=1232 GROUP BY characteristic_id, name) averages
//             ) chars
//           ) char_obj
//         ON recommend_obj.row_number = char_obj.row_number
//       ) reviewsMeta`;





//UNITS TEST
// SELECT JSON_BUILD_OBJECT(
//   'product_id', 12,
//   'ratings', (SELECT JSON_OBJECT_AGG(rating, rating_data)
//     FROM (SELECT rating, count(*) AS rating_data FROM reviews2 WHERE product_id = 12 GROUP BY rating) AS rate),
//   'recommended', (SELECT JSON_OBJECT_AGG(recommend, rec_data)
//     FROM (SELECT recommend, count(*) AS rec_data FROM reviews2 WHERE product_id = 12 GROUP BY recommend) AS rec),
//   'characteristics', (SELECT JSON_OBJECT_AGG(name, JSON_BUILD_OBJECT(
//           'id', characteristic_id,
//           'value', value
//     ))
//     FROM (SELECT name, characteristic_id, sum(value)/count(*) AS value
//       FROM characteristics WHERE product_id = 12 GROUP BY name, characteristic_id) AS char)
// )