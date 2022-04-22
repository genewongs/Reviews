SELECT reviews.*, COALESCE(photourl.photos, '[]') photos
FROM (SELECT * FROM reviews WHERE product_id = 4) reviews
LEFT JOIN
(SELECT review_id, JSON_AGG(JSON_BUILD_OBJECT('url', url, 'id', id)) photos
FROM photos
WHERE review_id IN
(SELECT reviews.id FROM reviews INNER JOIN photos ON reviews.id = photos.review_id AND reviews.product_id = 4)
GROUP BY review_id) photourl
ON reviews.id = photourl.review_id AND reviews.reported = false LIMIT 5;