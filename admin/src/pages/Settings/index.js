/*
 *
 * Settings Page
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import { Status } from '@strapi/design-system/Status';
import { NumberInput } from '@strapi/design-system/NumberInput';
import { Button } from '@strapi/design-system/Button';
import { Tooltip } from '@strapi/design-system/Tooltip';
import { Stack } from '@strapi/design-system/Stack';
import axios from "../../utils/axiosInstance"

const SettingsPage = () => {
  const [pageSize, setPageSize] = useState({})
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(null)
  const url = `ratings/page-size`
  useEffect(() => {
    const fetchPageSize = async () => {
      try {
        const { data } = await axios.get(url)
        setPageSize({
          ...pageSize,
          initial: data.pageSize
        })
      } catch(err) {
        console.log(err)
        if (!status) {
          setStatus(
            <Status variant="danger">
              <Typography>
                The page size could not been loaded. Please check console
              </Typography>
            </Status>
          )
        }
      }
    }
    fetchPageSize()
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pageSize.current) {
      return
    }

    setSending(true)
    try {
      if (pageSize.initial !== pageSize.current) {
        await axios.post(url, JSON.stringify({ pageSize: pageSize.current }))
      }
      setPageSize({
        initial: pageSize.current
      })
      setStatus(
        <Status variant="success">
          <Typography>
            The page size has been set to <Typography fontWeight="bold">{pageSize.current}</Typography>
          </Typography>
        </Status>
      )
    } catch(err) {
      console.log(err)
      setStatus(
        <Status variant="danger">
          <Typography>
            The page size could not been set. Please check console
          </Typography>
        </Status>
      )
    } finally {
      setSending(false)
    }
  }
  return (
    <Box background="neutral100" padding={8}>
      <Box paddingBottom={3} paddingTop={3}>
        <Typography variant="alpha" fontWeight="bold">Ratings settings</Typography>
      </Box>
      <Box background="neutral0" padding={6}>
        <Stack size={2}>
          <Typography variant="beta">
            Specify how many reviews to return for each page.
          </Typography>
          <Typography variant="epsilon">
            Current page size: {pageSize.initial || "loading..."}
          </Typography>
        </Stack>
        <Box paddingTop={2} paddingBottom={2}>
          <form onSubmit={handleSubmit}>
            <NumberInput
              label="Page size"
              name="page-size"
              hint="The number should be 1 or greater"
              error={
                (pageSize.current && pageSize.current <= 0) ? "Page size must be greater than 0" : undefined
              }
              onValueChange={value => setPageSize({...pageSize, current: value})}
              value={pageSize.current}
              required={true}
            />
            <Button
              type="submit"
              loading={sending ? true : undefined}
            >Submit</Button>
          </form>
        </Box>
        {
          status &&
          <Box>
            {status}
          </Box>
        }
      </Box>
    </Box>
  )
};

export default memo(SettingsPage);
