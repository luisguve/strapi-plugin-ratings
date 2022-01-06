import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';

import axios from "../../utils/axiosInstance"
import ReviewsContainer from "./ReviewsContainer"

const LatestReviews = () => {
  const [reviewsData, setReviewsData] = useState(null)
  const [reviewsJSX, setReviewsJSX] = useState(null)
  const deleteReview = id => {
    setReviewsData({
      ...reviewsData,
      reviewsCount: reviewsData.reviewsCount - 1,
      reviews: reviewsData.reviews.filter(c => c.id !== id)
    })
  }
  useEffect(() => {
    const fetchComments = async () => {
      const url = "/ratings"
      const { data } = await axios.get(url)
      setReviewsData(data)
    }
    fetchComments()
  }, [])
  const addReviews = reviews => {
    setReviewsData({
      ...reviewsData,
      reviews: reviewsData.reviews.concat(reviews)
    })
  }
  useEffect(() => {
    if (reviewsData) {
      setReviewsJSX(<ReviewsContainer
        data={reviewsData}
        actionAdd={addReviews}
        actionDelete={deleteReview}
      />)
    }
  }, [reviewsData])

  return (
    <Box background="neutral0" padding={4}>
      {
        reviewsJSX ?
          reviewsJSX
        : <Typography variant="beta">Loading latest comments...</Typography>
      }
    </Box>
  )
}

export default LatestReviews