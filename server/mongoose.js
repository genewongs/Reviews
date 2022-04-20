const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/3000');

let reviewSchema = mongoose.Schema({
  id: Number NOT NULL,
  product_id: Number,
  page: Number,
  count: Number,
  results: [
    {
      review_id: Number,
      rating: Number,
      summary: {type: string, max: 60},
      recommend: Boolean,
      response: {type: String, min: 50, max: 1,000},
      body: {type: String, min: 50, max: 1,000},
      date: String,
      reviewer_name: String,
      helpfulness: Number,
      photos: [{
        id: Number,
        url: String,
      }]
    }
  ]
});

let reviewMetaSchema = mongoose.Schema({
  {
    product_id: Number NOT NULL,
    reviews: [reviewSchema],
    meta: {
      ratings: {
        1: Number,
        2: Number,
        3: Number,
        4: Number,
        5: Number,
      },
      response: {
        type: String,
        min: 20,
        max: 1,000,
      },
      characteristics: {
        Fit: {
          id: Number,
          value: Number,
        },
        Length: {
          id: Number,
          value: Number,
        },
        Comfort: {
          id: Number,
          value: Number,
        },
        Quality: {
          id: Number,
          value: Number,
        }
      },
    }
  }
});

let Review = mongoose.model('Review', reviewSchema);

module.exports = {


}