const model = require('../models');

test('Database retrieves meta deta with corresponding keys', () => {
  return model.getMeta(40).then((data) => {
    expect(Object.keys(data.rows[0].characteristics)).toEqual([
      'product_id', 'ratings', 'recommended', 'characteristics']);
  })
});

test('Database retrieves object with the appropriate keys', () => {
  return model.getReviews(40).then((data) => {
    expect(Object.keys(data.rows[0])).toEqual([
      'review_id', 'rating', 'summary',
      'recommend', 'response', 'body',
    'date', 'reviewer_name', 'photos']);
  })
});

