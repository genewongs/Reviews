var pool = require('../db');

module.exports = {
  getReviews: function(product_id, page = 1, count = 5, sortBy = 'relevant') {
    sortBy === 'relevant' ? sortBy = 'helpfulness DESC, date ' : sortBy = sortBy;
    return new Promise ((res, rej) => {
      let sql = `
      SELECT id as review_id, rating, summary, recommend, response, body, date, reviewer_name, photos
      FROM reviews2
      WHERE product_id = ${product_id}
      ORDER BY ${sortBy} DESC
      LIMIT ${count}
      `;
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
      let sql = `WITH reviews AS
      (SELECT recommend, rating FROM reviews2 WHERE product_id = ${params})
        SELECT JSON_BUILD_OBJECT('product_id', ${params}, 'ratings', reviewsMeta.ratings, 'recommended', reviewsMeta.recommend, 'characteristics', reviewsMeta.agg_chars) characteristics FROM
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
                (SELECT characteristic_id, name, AVG(value) AS value FROM characteristics WHERE product_id=${params} GROUP BY characteristic_id, name) averages
              ) chars
            ) char_obj
          ON recommend_obj.row_number = char_obj.row_number
        ) reviewsMeta`;
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
      let sql = `
      with j as (
        INSERT INTO reviews2
        (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        )
      INSERT INTO characteristics (product_id, characteristic_id, name, value)
      SELECT * FROM (
        VALUES
        ($1::integer, $13::integer, 'Length', $14::integer),
        ($1::integer, $15::integer, 'Comfort', $16::integer),
        ($1::integer, $17::integer, 'Quality', $18::integer),
        ($1::integer, $19::integer, 'Fit', $20::integer),
        ($1::integer, $21::integer, 'Size', $22::integer),
        ($1::integer, $23::integer, 'Width', $24::integer)
      ) as vals
      WHERE column2 IS NOT NULL;
      `;
      pool.query(sql,
        [product_id, rating, date.toISOString(), summary, body, recommend, false, name, email, '', 0, photos,
          Length.id, Length.value,
          Comfort.id, Comfort.value,
          Quality.id, Quality.value,
          Fit.id, Fit.value,
          Size.id, Size.value,
          Width.id, Width.value
        ],
        (err, results) => {
      if(err) {
        return rej(err);
      }
      res(results);
      });
    });
  },

  postCharacteristics: function(reqBody) {
    const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = reqBody;
    let emptyObj = {id: null, value: null};
    const { Length = emptyObj, Comfort = emptyObj, Quality = emptyObj, Fit = emptyObj, Size = emptyObj, Width = emptyObj } = characteristics;
    return new Promise ((res,rej) => {
      let sql = `
      INSERT INTO characterstics (product_id, characteristics_id, name, value)
      SELECT * FROM (
        VALUES
        ($1, $2, 'Length', $3),
        ($4, $5, 'Comfort', $6),
        ($7, $8, 'Quality', $9),
        ($10, $11, 'Fit', $12),
        ($13, $14, 'Size', $15),
        ($16, $17, 'Width', $18)
      ) as vals
      WHERE column2 IS NOT NULL;
      `
      pool.query(sql,
        [product_id, Length.id, Length.value,
          product_id, Comfort.id, Comfort.value,
          product_id, Quality.id, Quality.value,
          product_id, Fit.id, Fit.value,
          product_id, Size.id, Size.value,
          product_id, Width.id, Width.value],
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
      let sql = `UPDATE reviews2 SET helpfulness = helpfulness + 1 WHERE id = ${params.review_id}`
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
      let sql = `UPDATE reviews2 SET reported = true WHERE id = ${params.review_id}`
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