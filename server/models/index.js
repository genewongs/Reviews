var pool = require('../db');
var format = require('pg-format');

module.exports = {
  getReviews: function(product_id, page = 1, count = 5, sortBy = 'relevant') {
    sortBy === 'relevant' ? sortBy = 'helpfulness DESC, date ' : sortBy = sortBy;
    return new Promise ((res, rej) => {
      let sql = format(`
      SELECT id as review_id, rating, summary, recommend, response, body, date, reviewer_name, photos
      FROM reviews2
      WHERE product_id = %L AND reported = false
      ORDER BY %s DESC
      LIMIT %L
      OFFSET %L
      `, product_id, sortBy, count, ((page - 1) * count));
      pool.query(sql, (err, results) => {
        if (err) {
          return rej(err);
        }
        res(results);
      });
    });
  },

//  ORDER BY helpfulness desc
  //      date DESC

  getMeta: function(params) {
    return new Promise ((res, rej) => {
      const product_id = params;
      let sql = format(`WITH reviews AS
      (SELECT recommend, rating FROM reviews2 WHERE product_id = %L)
        SELECT JSON_BUILD_OBJECT('product_id', %L, 'ratings', reviewsMeta.ratings, 'recommended', reviewsMeta.recommend, 'characteristics', reviewsMeta.agg_chars) characteristics FROM
          (
          SELECT * FROM
            (SELECT JSON_OBJECT_AGG(recommend_count.recommend, recommend_count.count) recommend, row_number() OVER() FROM
              (SELECT recommend, COUNT(*) FROM reviews GROUP BY recommend) recommend_count
            ) recommend_obj
          INNER JOIN
            (SELECT JSON_OBJECT_AGG(rating_counts.rating, rating_counts.count) ratings, row_number() OVER() FROM
              (SELECT rating, COUNT(*) FROM reviews GROUP BY rating) rating_counts
            ) rating_obj
          ON recommend_obj.row_number = rating_obj.row_number
          INNER JOIN
            (
            SELECT JSON_OBJECT_AGG(chars.name, chars.average) AS agg_chars, row_number() OVER() FROM
              (SELECT averages.name, JSON_BUILD_OBJECT('id', averages.characteristic_id, 'value', averages.value) average FROM
                (SELECT characteristic_id, name, AVG(value) AS value FROM characteristics WHERE product_id=%L GROUP BY characteristic_id, name) averages
              ) chars
            ) char_obj
          ON recommend_obj.row_number = char_obj.row_number
        ) reviewsMeta`, product_id, product_id, product_id);
      pool.query(sql, (err, results) => {
        if (err) {
          return rej(err);
        }
        res(results);
      });
    })
  },

  post: function(reqBody) {
    const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = reqBody;
    let emptyObj = {id: null, value: null};
    const { Length = emptyObj, Comfort = emptyObj, Quality = emptyObj, Fit = emptyObj, Size = emptyObj, Width = emptyObj } = characteristics;
    const date = new Date();
    return new Promise ((res, rej) => {
      let sql = format(`
      with j as (
        INSERT INTO reviews2
        (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos)
        VALUES(%L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L)
        )
      INSERT INTO characteristics (product_id, characteristic_id, name, value)
      SELECT * FROM (
        VALUES
        (%L::integer, %L::integer, 'Length', %L::integer),
        (%L::integer, %L::integer, 'Comfort', %L::integer),
        (%L::integer, %L::integer, 'Quality', %L::integer),
        (%L::integer, %L::integer, 'Fit', %L::integer),
        (%L::integer, %L::integer, 'Size', %L::integer),
        (%L::integer, %L::integer, 'Width', %L::integer)
      ) as vals
      WHERE column2 IS NOT NULL;
      `, product_id, rating, date.toISOString(), summary, body, recommend, false, name, email, '', 0, photos,
        product_id, Length.id, Length.value,
        product_id, Comfort.id, Comfort.value,
        product_id, Quality.id, Quality.value,
        product_id, Fit.id, Fit.value,
        product_id, Size.id, Size.value,
        product_id, Width.id, Width.value);
      pool.query(sql,
        (err, results) => {
      if(err) {
        return rej(err);
      }
      res(results);
      });
    });
  },

  updateHelpfullness: function(params) {
    return new Promise((res,rej) => {
      let sql = format(`UPDATE reviews2 SET helpfulness = helpfulness + 1 WHERE id = %L`, params.review_id)
      pool.query(sql, (err, results) => {
        if(err){
          return rej(err);
        }
        res(results);
      })
    });
  },

  updateReport: function(params) {
    return new Promise((res,rej) => {
      let sql = format(`UPDATE reviews2 SET reported = true WHERE id = %L`, params.review_id)
      pool.query(sql, (err, results) => {
        if(err){
          return rej(err);
        }
        res(results);
      })
    });
  },
}


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