import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { store } from '../../store.js';

const useStyles = makeStyles((theme) => ({
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
}));
SnackBarNotification.propTypes = {
  message: PropTypes.string,
  handleClose: PropTypes.func,
  duration: PropTypes.number,
  open: PropTypes.bool,
};
SnackBarNotification.defaultProps = {
  message: '',
  handleClose: () => {},
  duration: 6000,
  open: false,
};
export default function SnackBarNotification(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch } = globalState;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={props.open}
      autoHideDuration={props.duration}
      onClose={props.handleClose}
      message={props.message}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={props.handleClose}
        >
          <Close fontSize="small" />
        </IconButton>
      }
    />
  );
}
