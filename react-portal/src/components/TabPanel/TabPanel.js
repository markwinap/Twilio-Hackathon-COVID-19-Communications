import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  value: PropTypes.number,
};
TabPanel.defaultProps = {
  children: {},
  index: 0,
  value: 0,
};
export default function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box pt={3}>{children}</Box>}
    </Typography>
  );
}
