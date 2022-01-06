'use strict';

/**
 *   controller
 */

module.exports = {
  async index(ctx) {
    const { start, ignoreCount } = ctx.request.query
    const pageSize = await strapi.service('plugin::ratings.review').getPageSize()
    const reviews = await strapi.entityService.findMany("plugin::ratings.review",
      {
        limit: pageSize,
        filters: {},
        start,
        sort: { createdAt: "desc" },
        populate: {
          related_to: { fields: ["slug", "average"] },
          author: { fields: ["id", "username", "email"] }
        }
      }
    )
    let reviewsCount
    if (!ignoreCount) {
      reviewsCount = await strapi.db.query("plugin::ratings.review").count()
    }
    ctx.body = {
      reviewsCount,
      reviews
    }
  },
  async findKeys(ctx) {
    const contents = await strapi.entityService.findMany("plugin::ratings.r-content-id", {
      fields: ["id", "slug", "average"],
      filters: {}
    })
    const res = await Promise.all(contents.map(async (content) => {
      // count reviews related to this content
      const reviewsCount = await strapi.db.query("plugin::ratings.review").count({
        where: {
          related_to: content.id
        }
      })
      return {
        contentID: content.slug,
        averageScore: content.average,
        reviews: reviewsCount
      }
    }))
    ctx.body = res
  },
  async delete(ctx) {
    const { id } = ctx.params
    // Delete review
    const review = await strapi.entityService.delete("plugin::ratings.review", id, {
      fields: ["score"],
      populate: {
        related_to: {
          fields: ["average"],
          populate: {
            reviews: { fields: ["id"] }
          }
        }
      }
    })
    const { score, related_to } = review
    // Update average rating
    const oldTotalScore = related_to.average * related_to.reviews.length
    const newTotalScore = oldTotalScore - score
    let newAvg = 0
    let newReviewsCount = related_to.reviews.length - 1
    if (newTotalScore && newReviewsCount) {
     newAvg = newTotalScore / newReviewsCount
    }
    await strapi.entityService.update("plugin::ratings.r-content-id", related_to.id, {
      data: {
        average: newAvg
      }
    })
    ctx.body = { ok: "true" }
  },
  async setPageSize(ctx) {
    const { pageSize } = ctx.request.body
    if (!pageSize || pageSize < 1) {
      return ctx.badRequest("pageSize must be greater than 0")
    }
    strapi.service('plugin::ratings.review').setPageSize(pageSize)
    return { ok: true }
  }
}
