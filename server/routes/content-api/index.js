'use strict';

module.exports = {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/page-size",
      handler: "reviews.getPageSize",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/reviews/:slug",
      handler: "reviews.find",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/reviews/:slug/count",
      handler: "reviews.count",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/reviews/:slug/user-review",
      handler: "reviews.getUserReview",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/reviews/:slug/stats",
      handler: "reviews.getStats",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/reviews/:slug",
      handler: "reviews.create",
      config: {
        policies: []
      }
    }
  ]
}