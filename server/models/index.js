var pool = require('../db');

module.exports = {
  getReviews: function(product_id, page, count) {
    return new Promise ((res, rej) => {
      let sql = `SELECT id as review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photos FROM reviews2 WHERE product_id = ${product_id} LIMIT ${count}`;
      pool.query(sql, (err, results) => {
        if (err) {
          return rej(err);
        }
        res(results);
      });
    });
  },

  getMeta: function(params) {
    return new Promise ((res, rej) => {
      const product_id = params;
      let sql = `SELECT JSON_BUILD_OBJECT('product_id', ${params}, 'ratings', reviewsMeta.ratings,'recommended', reviewsMeta.recommend, 'characteristics', reviewsMeta.combinedChar) as what FROM
      (
        SELECT * FROM
          (SELECT JSON_OBJECT_AGG(recommend_count.recommend, recommend_count.count) recommend, row_number() OVER() FROM
            (SELECT recommend, COUNT(*) FROM reviews2 where product_id=${params} GROUP BY recommend) recommend_count
          ) recommend_obj
        INNER JOIN
          (SELECT JSON_OBJECT_AGG(rating_counts.rating, rating_counts.count) ratings, row_number() OVER() FROM
            (SELECT rating, COUNT(*) FROM reviews2 WHERE product_id=${params} GROUP BY rating) rating_counts
          ) rating_obj
        ON recommend_obj.row_number = rating_obj.row_number
        INNER JOIN
        (
        SELECT JSON_OBJECT_AGG(avg_obj.name, avg_obj.value) combinedChar, row_number() OVER() FROM (
          SELECT name,JSON_BUILD_OBJECT('id', averages.characteristic_id, 'value', averages.value) as value FROM
          (SELECT name, AVG(value) AS value, characteristic_id
           FROM characteristics
           WHERE product_id=${params}
           GROUP BY characteristic_id, name) AS averages
        ) as avg_obj
        ) as characteristics_aggregate
        ON rating_obj.row_number = characteristics_aggregate.row_number
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
    const date = new Date();
    return new Promise ((res, rej) => {
      let sql = `INSERT INTO reviews2
      (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, photos)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
      pool.query(sql, [product_id, rating, date.toISOString(), summary, body, recommend, false, name, email, '', 0, photos], (err, results) => {
      if(err) {
        return rej(err);
      }
      res(results);
      });
    });
  },

  updateHelpfullness: function(user) {
    return new Promise((res,rej) => {
      let sql = `UPDATE reviews SET helpfulness = helpfullness + 1 WHERE id = ${reviewId}`
      pool.query(sql, (err, results) => {
        if(err){
          return rej(err);
        }
        res(results);
      })
    });
  },

  delete: function(user) {
    return new Promise((res,rej) => {
      const { user_id } = user;
      let sql = "DELETE FROM person WHERE user_id = $1";
      pool.query(sql, [user_id], (err, results) => {
        if(err) {
          return rej(err);
        } else { return res(results); }
      });
    });
  },
}