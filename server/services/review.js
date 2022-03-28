'use strict';

/**
 *  service.
 */

const { createCoreService } = require('@strapi/strapi').factories;
const pluginId = require("../pluginId")

module.exports = createCoreService('plugin::ratings.review', ({strapi}) => ({
  DEFAULT_PAGE_SIZE: 10,
  /**
   * Retrieve the strapi data storage for the plugin
   */
  getStore: function() {
    return strapi.store({
      type: "plugin",
      name: pluginId
    })
  },
  getPageSize: async function() {
    const pluginStore = this.getStore()
    const pageSize = await pluginStore.get({ key: "pageSize"})
    if (!pageSize) {
      return this.DEFAULT_PAGE_SIZE
    }
    return pageSize
  },
  setPageSize: async function(newPageSize) {
    const pluginStore = this.getStore()
    pluginStore.set({ key: "pageSize", value: newPageSize})
  },
  async userCanPostReview(user, slug) {
    return true
  }
}));
