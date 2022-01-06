'use strict';

module.exports = {
  type: "admin",
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'admin__reviews.index',
      config: {
        policies: [],
      }
    },
    {
      method: "GET",
      path: "/reviews",
      handler: "admin__reviews.findKeys",
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/page-size',
      handler: 'reviews.getPageSize',
      config: {
        policies: [],
      }
    },
    {
      method: 'POST',
      path: '/page-size',
      handler: 'admin__reviews.setPageSize',
      config: {
        policies: [],
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
      method: "DELETE",
      path: "/reviews/:id",
      handler: "admin__reviews.delete",
      config: {
        policies: []
      }
    }
  ]
}