import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import styled from "styled-components"
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Button } from '@strapi/design-system/Button';
import {
  ModalLayout,
  ModalHeader,
  ModalFooter,
  ModalBody
} from '@strapi/design-system/ModalLayout';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';

import axios from "../../utils/axiosInstance"
import Review from "./Review"
import ReactStarsRating from 'react-awesome-stars-rating'

const ROW_COUNT = 6;
const COL_COUNT = 10;

const ReviewsByKey = () => {
  const [reviewsData, setReviewsData] = useState(null)
  const [reviewsJSX, setReviewsJSX] = useState(null)
  const [currentContentID, setCurrentContentID] = useState(null)
  useEffect(() => {
    const fetchReviews = async () => {
      const url = "/ratings/reviews"
      try {
        const { data } = await axios.get(url)
        setReviewsData(data)
      } catch(err) {
        console.log(err)
      }
    }
    fetchReviews()
  }, [])

  const TableRow = styled(Tr)`
    &:hover {
      cursor: pointer;
      background: #d3d3d3;
    }
  `
  useEffect(() => {
    if (reviewsData) {
      const reviews = reviewsData.map(data => {
        const { contentID, reviews, averageScore } = data
        return (
          <TableRow key={contentID} onClick={() => setCurrentContentID(contentID)}>
            <Td>{contentID}</Td>
            <Td>{reviews}</Td>
            <Td>
              <ReactStarsRating
                isEdit={false}
                isHalf={true}
                value={averageScore}
                isArrowSubmit={false}
              />
            </Td>
          </TableRow>
        )
      })
      setReviewsJSX(reviews)
    }
  }, [reviewsData])

  const ReviewsTable = ({children}) => (
    <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
      <Thead>
        <Tr>
          <Th>
            <Typography fontWeight="bold">Content ID</Typography>
          </Th>
          <Th>
            <Typography fontWeight="bold">Reviews</Typography>
          </Th>
          <Th>
            <Typography fontWeight="bold">Average score</Typography>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {children}
      </Tbody>
    </Table>
  )

  return (
    <Box background="neutral0" padding={4}>
    {
      reviewsJSX ?
        reviewsJSX.length > 0 ?
          <>
            <ReviewsTable>{reviewsJSX}</ReviewsTable>
            {
              currentContentID &&
              <ListReviewsModal
                contentID={currentContentID}
                close={() => setCurrentContentID(null)}
              />
            }
          </>
        : <Typography variant="beta">There are no reviews yet</Typography>
      : <Typography variant="beta">Loading reviews...</Typography>
    }
    </Box>
  )
}

export default ReviewsByKey

const ListReviewsModal = ({contentID, close}) => {
  const [reviewsData, setReviewsData] = useState(null)
  const [reviewsJSX, setReviewsJSX] = useState(null)
  const deleteReview = id => {
    setReviewsData({
      reviewsCount: reviewsData.reviewsCount - 1,
      reviews: reviewsData.reviews.filter(c => c.id !== id)
    })
  }
  useEffect(() => {
    const fetchReviews = async () => {
      const url = `/ratings/reviews/${contentID}`
      try {
        const { data } = await axios.get(url)
        setReviewsData(data)
      } catch(err) {
        console.log(err)
      }
    }
    fetchReviews()
  }, [contentID])
  useEffect(() => {
    if (reviewsData) {
      const totalReviews = reviewsData.reviews.map(review => {
        return (
          <Review
            data={review}
            showDeleteButton={true}
            actionDelete={deleteReview}
            key={review.id}
          />
        )
      })
      setReviewsJSX(totalReviews)
    }
  }, [reviewsData])
  const loadMore = async () => {
    const start = reviewsData.reviews.length
    const url = `/ratings/reviews/${contentID}?start=${start}&ignoreCount=1`
    try {
      const { data } = await axios.get(url)
      setReviewsData({
        ...reviewsData,
        reviews: reviewsData.reviews.concat(data.reviews)
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <ModalLayout labelledBy="comments-modal-title" onClose={close}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="comments-modal-title">
          Reviews for {contentID}
        </Typography>
      </ModalHeader>
      <ModalBody>
        {
          !reviewsJSX ?
          <Box background="neutral0" borderColor="neutral200" hasRadius={true} padding={6}>
            <Typography>
              Loading reviews...
            </Typography>
          </Box>
          : !reviewsJSX.length ?
              <Box
                background="neutral0"
                borderColor="neutral200"
                hasRadius={true}
                padding={6}
              >
                <Typography>
                  There are no reviews yet.
                </Typography>
              </Box>
            : (
              <Stack size={2}>
                {reviewsJSX}
                {
                  (reviewsJSX.length < reviewsData.reviewsCount) &&
                  <Button
                    variant="secondary"
                    onClick={loadMore}
                  >Load more reviews</Button>
                }
              </Stack>
            )
        }
      </ModalBody>
      <ModalFooter
        endActions={<Button onClick={close}>Finish</Button>}
        startActions={<></>}
      />
    </ModalLayout>
  )
}
