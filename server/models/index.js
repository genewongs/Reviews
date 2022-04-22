var pool = require('../db');

module.exports = {
  get: function() {
    return new Promise ((res, rej) => {
      let sql = 'SELECT r2.id as review_id, r2.rating, r2.summary, r2.recommend, r2.response, r2.body, r2.date, r2.reviewer_name, r2.helpfulness, (SELECT array_to_json(coalesce(array_agg(photo), array[]::record[])) from (select p.id, p.url FROM reviews r inner join photos p on r.id = p.review_id where p.review_id = r2.id ) photo ) as photos from reviews r2 where r2.product_id = 65635 and r2.reported <> true';
      pool.query(sql, (err, results) => {
        if (err) {
          return rej(err);
        }
        res(results);
      });
    });
  },

  post: function(params) {
    const { firstname, lastname, email, registered } = params;
    return new Promise ((res, rej) => {
      let sql = "INSERT INTO person(firstname, lastname, email, registered) VALUES($1, $2, $3, $4)";
      pool.query(sql, [firstname, lastname, email, registered], (err, results) => {
      if(err) {
        return rej(err);
      }
      res(results);
      });
    });
  },

  update: function(user) {
    return new Promise((res,rej) => {
      const { email, user_id } = user;
      let sql = "UPDATE person SET email = $1 WHERE user_id = $2"
      pool.query(sql, [email, user_id], (err, results) => {
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