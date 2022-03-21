# Strapi plugin Ratings

Enable and manage user reviews for your content very easily!

## Requirements

You should have installed an instance of Strapi v4.x.x

## Installation

Run the following command in your project root:

    npm install strapi-plugin-ratings

Then, rebuild the admin dashboard using the following command

    npm run build

## Configurarion

For your frontend to have access to the API, enable the following permissions for **Ratings** from **Users & Permissions Plugin** on your project settings:

For public, enable: **count**, **find**, **getPageSize** and **getStats**.

For authenticated, enable **create**, **find** and **getUserReview**.

## Display user reviews on the frontend

Reviews can be displayed in the frontend in two ways:

1. Using the React components library [strapi-ratings-client](https://npmjs.com/package/strapi-ratings-client) **(recommended)**
2. Build your custom frontend using the API endpoints, described as follows:

## API

There are some Typescript interfaces that will help to get an idea of the data structures.

### Reviews:

```ts
interface IReview {
  id: number,
  createdAt: string,
  comment: string | null,
  author: IAuthor | null,
  score: number,
}
```

### Authors:

```ts
interface IAuthor {
  username: string,
  email: string,
  id: number
}
```

### Content Stats

```ts
interface IStats {
  averageScore: number;
  reviewsCount: number | null;
}
```

The following endpoints are exposed to fetch and post reviews:

### Get reviews for a content ID

**Method**: GET

**Path**: /api/ratings/reviews/:slug

**Optional query parameters**: start, ignoreCount

**Returns**:

```ts
{
  reviewsCount: number,
  averageScore: number,
  userReview: IReview | null,
  reviews: IReview[]
}
```

The parameter `start` indicates how many reviews to skip. This is for pagination purposes.

The parameter `ignoreCount` indicates whether or not to return the total number of reviews associated with the given slug.

---

### Get review stats for a content ID

**Method**: GET

**Path**: /api/ratings/reviews/:slug/stats

**Returns**:

```ts
{
  averageScore: number,
  reviewsCount: number | null
}
```

---

### Get the number of reviews associated with a given content ID

**Method**: GET

**Path**: /api/ratings/reviews/:slug/count

**Returns**:

```ts
{
  count: number
}
```

---

### Post a review

**Method**: POST

**Path**: /api/ratings/reviews/:slug

**Authentication**: Bearer token

**Payload**:

```ts
{
  content: string
}
```

**Returns**:

```ts
{
  id: number
}
```

---

### Get the page size

**Method**: GET

**Path**: /api/ratings/page-size

**Returns**:

```ts
{
  pageSize: number
}
```

---

## General settings

The plugin allows to set how many reviews are returned per page by going to the **Pagination** section under **Ratings Plugin** of the **Settings** section.

The default page size is 10.

## Management of reviews

Admin users are able to delete reviews from within the plugin page of the Strapi admin dashboard.

The plugin interface has two tabs: one for the latest reviews and one for reviews by content ID.

## Roadmap and future plans

The plugin is pretty basic but it can be improved with more features and a better UI/UX. 
Feedback and collaborations are very welcome.
