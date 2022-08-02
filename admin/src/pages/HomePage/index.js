/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography'
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system/Tabs'
import { LatestReviews, ReviewsByKey } from "../../components/Reviews"

const HomePage = () => {
  return (
    <Box background="neutral100" padding={8}>
      <Box paddingBottom={3} paddingTop={3}>
        <Typography variant="alpha" fontWeight="bold">Content Ratings</Typography>
      </Box>
      <TabGroup label="" id="tabs">
        <Tabs>
          <Tab>Latest reviews</Tab>
          <Tab>Reviews by content ID</Tab>
        </Tabs>
        <TabPanels>
          <TabPanel>
            <LatestReviews />
          </TabPanel>
          <TabPanel>
            <ReviewsByKey />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Box>
  )
};

export default memo(HomePage);
