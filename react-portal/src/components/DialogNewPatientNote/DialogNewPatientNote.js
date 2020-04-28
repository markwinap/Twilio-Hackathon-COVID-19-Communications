import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
//STORE
import { store } from '../../store.js';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  patitentNotes: {
    overflow: 'auto',
    maxHeight: 400,
  },
  boxBorder: {
    borderColor: '#f8f8f8 !important',
    borderRightStyle: 'solid',
  },
}));

DialogUpdatePatientNote.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
DialogUpdatePatientNote.defaultProps = {
  open: false,
  handleClose: () => {},
};

export default function DialogUpdatePatientNote(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const [note, setNote] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const [publicNote, setPublicNote] = React.useState(false);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="patient-note"
    >
      <DialogTitle id="patient-note-title">Create Patient Note</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="patientNote"
          label="Note"
          type="text"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
          }}
          fullWidth
        />
        <FormControlLabel
          control={
            <Switch
              checked={notification}
              onChange={(e) => setNotification(e.target.checked)}
            />
          }
          label="Notification"
        />
        <FormControlLabel
          control={
            <Switch
              checked={publicNote}
              onChange={(e) => setPublicNote(e.target.checked)}
            />
          }
          label="Public"
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button color="secondary" onClick={props.handleClose}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
