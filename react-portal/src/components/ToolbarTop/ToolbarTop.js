import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Auth } from 'aws-amplify';
import { store } from '../../store.js';
const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
}));
ToolbarTop.propTypes = {
  title: PropTypes.string,
};
ToolbarTop.defaultProps = {
  title: 'Title',
};
export default function ToolbarTop(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch } = globalState;
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography
          variant="h6"
          className={classes.title}
          onClick={() => {
            dispatch({
              type: 'set-page',
              value: 'main',
            });
          }}
        >
          {props.title}
        </Typography>
        <Button
          color="inherit"
          onClick={() => {
            Auth.signOut()
              .then((data) => console.log(data))
              .catch((err) => console.log(err));
          }}
        >
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
