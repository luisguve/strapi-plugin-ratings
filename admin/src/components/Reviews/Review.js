import React, { useState, useEffect, useContext } from "react"
import { Stack } from '@strapi/design-system/Stack';
import { Divider } from '@strapi/design-system/Divider';
import { Textarea } from '@strapi/design-system/Textarea';
import { Button } from '@strapi/design-system/Button';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import axios from "../../utils/axiosInstance"
import { ISOToFull } from "../../utils/date-format"
import {
  ModalLayout,
  ModalHeader,
  ModalFooter,
  ModalBody
} from '@strapi/design-system/ModalLayout';
import ReactStarsRating from 'react-awesome-stars-rating';

const Review = ({ data, showDeleteButton, actionDelete }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const handleDelete = async () => {
    const url = `/ratings/reviews/${data.id}`
    setDeleting(true)
    try {
      const res = await axios.delete(url)
      const { ok } = res.data
      if (!ok) {
        throw res
      }
      actionDelete(data.id)
    } catch(err) {
      console.log(err)
      setDeleting(false)
    }
  }
  const openDeleteModal = () => {
    setDeleteModalOpen(true)
  }
  return (
    <>
      <Box paddingTop={4} paddingBottom={4}>
        <Box paddingBottom={4}>
          <Box paddingBottom={2}>
            <Stack horizontal size={2}>
              <Typography fontWeight="bold">
                Review {data.id}:
              </Typography>
              <Typography fontWeight="bold">
                {data.author.username}
              </Typography>
              <Typography>
                {"\t"} on {ISOToFull(data.createdAt)}
              </Typography>
              {
                showDeleteButton &&
                <Button variant="danger" onClick={openDeleteModal}>delete</Button>
              }
            </Stack>
          </Box>
          <Box background="neutral0" paddingBottom={3}>
            <Stack size={1}>
              <Typography>
                Score: {data.score} / 5
              </Typography>
              <ReactStarsRating
                isEdit={false}
                isHalf={true}
                value={data.score}
                isArrowSubmit={false}
              />
            </Stack>
          </Box>
          {
            data.comment && 
            <Box background="neutral0" borderColor="neutral200" hasRadius={true} padding={6}>
              <Typography>
                {data.comment}
              </Typography>
            </Box>
          }
        </Box>
      </Box>
      {
        deleteModalOpen && (
          <DeleteModal
            headerContent={`Delete Review ${data.id} and associated score`}
            close={() => setDeleteModalOpen(false)}
            deleting={deleting}
            handleDelete={handleDelete}
          >
            <Box paddingTop={5} paddingBottom={5}>
              <Typography variant="beta">
                Are you sure you want to delete this review and associated score?
              </Typography>
              <Typography textColor="neutral800" as="h5">
                This action cannot be undone
              </Typography>
            </Box>
          </DeleteModal>
        )
      }
    </>
  )
}

export default Review

const DeleteModal = ({headerContent, children, close, handleDelete, deleting}) => {
  return (
    <ModalLayout labelledBy="delete-title" onClose={close}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="delete-title">
          {headerContent}
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Box paddingBottom={6}>
          {children}
        </Box>
        <Stack horizontal size={4}>
          <Button onClick={close}>Cancel</Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting ? true : undefined}
          >Delete</Button>
        </Stack>
      </ModalBody>
    </ModalLayout>
  )
}
