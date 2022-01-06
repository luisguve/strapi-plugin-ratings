const review = require("./review/schema.json")
const contentID = require("./ratings-content-id/schema.json")

module.exports = {
  review: {schema: review},
  "r-content-id": {schema: contentID},
}
