\c sdc_lw;

\copy Photos FROM './reviews_photos.csv' WITH (FORMAT CSV, HEADER);
\copy Reviews FROM './reviews.csv' WITH (FORMAT CSV, HEADER);
\copy CharacteristicsReviews FROM './characteristic_reviews.csv' WITH (FORMAT CSV, HEADER);
\copy Characteristics FROM './characteristics.csv' WITH (FORMAT CSV, HEADER);