import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { store } from '../../store.js';
//COMPONENTS
import PatientTable from '../../components/PatientTable';
import SearchOptions from '../../components/SearchOptions';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 40,
    paddingRight: 40,
  },
  cardRoot: {
    maxWidth: 345,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  mediaIcon: {},
  media: {
    //width: 200,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#f8f8f8',
  },
  mediab: {
    //width: 200,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#f8f8f8',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));
export default function Patient() {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch } = globalState;

  return (
    <div className={classes.root}>
      <Typography
        variant="h3"
        component="h3"
        align="center"
        color="primary"
        gutterBottom
      >
        Patient Search
      </Typography>

      <SearchOptions />
      <PatientTable />
    </div>
  );
}
