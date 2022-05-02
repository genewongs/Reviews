# Reviews
This is a node/express/Postgres application that provides an API for the reviews portion of Project Atelier's website

## Ensure that Postgresql is install onto your computer

## Installation

```
npm install
```

Start the Postgresql service on your terminal

Rename the `example.env` file to `.env` and configure the variables within.

```
npm start
npm startNR for New Relic as an analyzation tool
```

## API Endpoints

### `GET /reviews`
Retrieve a list of products

#### Parameters
| Parameter | Type    | Description                                               |
|-----------|---------|-----------------------------------------------------------|
| product_id| Integer | Specify the product you want reviews for. Required
| page      | Integer | Selects the page of results to return. Default 1.         |
| count     | Integer | Specifies how many results to return. Default 5.|
| sort      | String  | Specifies how to sort the reviews from "helpfulness", "relevant", "date"|
#### Response
```json
{
    "product": "22",
    "page": 1,
    "count": 5,
    "results": [
        {
            "review_id": 2029877,
            "rating": 2,
            "summary": "Et rerum blanditiis incidunt nam quasi.",
            "recommend": true,
            "response": "Velit necessitatibus praesentium modi illum animi amet expedita.",
            "body": "Nulla nemo saepe quia rerum atque voluptates ipsa eius assumenda. Delectus consequatur excepturi molestiae perspiciatis. Natus nihil nisi. Sit exercitationem numquam.",
            "date": "2020-11-09T03:47:18.000Z",
            "reviewer_name": "Marge.Rau74",
            "photos": []
        },
        {
            "review_id": 3655545,
            "rating": 4,
            "summary": "Dicta ea quaerat excepturi incidunt consequatur provident.",
            "recommend": true,
            "response": "null",
            "body": "Adipisci quae nulla ut voluptas iste ipsam consequatur quia ducimus. Ut a enim ipsa asperiores illum nihil et animi. Necessitatibus eveniet voluptatem id veritatis ratione non illo. Velit neque sit suscipit eligendi facere quis minus distinctio deserunt. Corrupti doloribus vero voluptatibus rem et eveniet quo.",
            "date": "2021-01-29T17:03:54.000Z",
            "reviewer_name": "Odell.Metz2",
            "photos": []
        },
        {
            "review_id": 5774967,
            "rating": 3,
            "summary": "this was summary",
            "recommend": true,
            "response": "",
            "body": "I loved this product, this is the body of my post request",
            "date": "2022-04-23T10:12:21.353Z",
            "reviewer_name": "alexshiao",
            "photos": [
                "https://scontent-lax3-2.xx.fbcdn.net/v/t1.6435-9/71511645_2565463433492684_7417716387742744576_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=a26aad&_nc_ohc=YuoDhsONPeQAX9on_u7&_nc_ht=scontent-lax3-2.xx&oh=00_AT_FJczUcX21OO2lUmbY3nwNRy1Xi2tOQ4tEGD7d4PRNTQ&oe=6288C24F"
            ]
        },
        {
            "review_id": 5774968,
            "rating": 3,
            "summary": "this was summary",
            "recommend": true,
            "response": "",
            "body": "I loved this product, this is the body of my post request",
            "date": "2022-04-23T10:12:21.353Z",
            "reviewer_name": "alexshiao",
            "photos": [
                "https://scontent-lax3-2.xx.fbcdn.net/v/t1.6435-9/71511645_2565463433492684_7417716387742744576_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=a26aad&_nc_ohc=YuoDhsONPeQAX9on_u7&_nc_ht=scontent-lax3-2.xx&oh=00_AT_FJczUcX21OO2lUmbY3nwNRy1Xi2tOQ4tEGD7d4PRNTQ&oe=6288C24F"
            ]
        },
        {
            "review_id": 5774966,
            "rating": 3,
            "summary": "this was summary",
            "recommend": true,
            "response": "",
            "body": "I loved this product, this is the body of my post request",
            "date": "2022-04-23T10:11:59.726Z",
            "reviewer_name": "alexshiao",
            "photos": [
                "https://scontent-lax3-2.xx.fbcdn.net/v/t1.6435-9/71511645_2565463433492684_7417716387742744576_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=a26aad&_nc_ohc=YuoDhsONPeQAX9on_u7&_nc_ht=scontent-lax3-2.xx&oh=00_AT_FJczUcX21OO2lUmbY3nwNRy1Xi2tOQ4tEGD7d4PRNTQ&oe=6288C24F"
            ]
        }
    ]
}
```
### `GET /reviews/meta`
Retrieve a list of meta data for the product

#### Parameters
| Parameter | Type    | Description                                               |
|-----------|---------|-----------------------------------------------------------|
| product_id| Integer | Specify the product you want reviews for. Required


#### Response
```json
{
    "ratings": {
        "2": 1,
        "3": 5,
        "4": 1
    },
    "recommended": {
        "true": 7
    },
    "characteristics": {
        "Quality": {
            "id": 79,
            "value": 5
        }
    },
    "product_id": "22"
}
```
### `POST /reviews`
Post a new review to the API

#### Parameters
| Parameter | Type    | Description                                               |
|-----------|---------|-----------------------------------------------------------|
| product_id| Integer | Specify the product you want to post reviews for. Required |
| rating| Integer | Integer indicating the review rating. Required |
| summary| text | Summary of the review. Required |
| body| text | The full text of the review. Required |
| recommend| bool | True or false, depending on if you recommend it or not. Required |
| name| text | Username for question asker. Required |
| email| text | Email address for question asker. Required |
| photos| [text] | Array of photo urls to images uploaded. |
| characteristics| object | Object of keys representing characteristic_id with corresponding values from 1-5. Required |



#### Response
```
201 status code
```
### `PUT /reviews/:review_id/helpful`
Mark a review as helpful

#### Parameters
| Parameter | Type    | Description                                               |
|-----------|---------|-----------------------------------------------------------|
| review_id| Integer | ID of the review to update. Required


#### Response
```
204 status code
```
### `PUT /reviews/:review_id/report`
Report a review

#### Parameters
| Parameter | Type    | Description                                               |
|-----------|---------|-----------------------------------------------------------|
| review_id| Integer | ID of the review to update. Required


#### Response
```
204 status code
```