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
import { Auth } from 'aws-amplify';
import axios from 'axios';
import moment from 'moment';
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
        <Button
          color="secondary"
          onClick={async () => {
            const selectedPatient = state.selectedPatient;
            const params = {
              sql:
                'INSERT INTO notes (createdDate, updatedDate, patientId, public, note) values (:createdDate, :updatedDate, :patientId, :public, :note)',
              parameters: [
                {
                  name: 'patientId',
                  value: { longValue: selectedPatient?.patientId },
                },
                {
                  name: 'createdDate',
                  value: { stringValue: moment.utc().format('YYYY-MM-DD') },
                },
                {
                  name: 'updatedDate',
                  value: { stringValue: moment.utc().format('YYYY-MM-DD') },
                },
                {
                  name: 'public',
                  value: { longValue: publicNote ? 1 : 0 },
                },
                {
                  name: 'note',
                  value: {
                    stringValue: note,
                  },
                },
              ],
            };
            await axios({
              method: 'post',
              headers: {
                Authorization: await Auth.currentSession()
                  .then((res) => res.idToken.jwtToken)
                  .catch((err) => {
                    console.log(err);
                    return '';
                  }),
              },
              url:
                'https://w1dms5jz5f.execute-api.us-west-2.amazonaws.com/DEV/aurora',
              data: params,
            })
              .then((res) => {
                console.log(res.data);
                let temp = state.patientNotes;
                temp.push({
                  noteId: res.data.generatedFields[0].longValue,
                  updatedDate: moment.utc().format('YYYY-MM-DD'),
                  createdDate: moment.utc().format('YYYY-MM-DD'),
                  public: publicNote ? 1 : 0,
                  note: note,
                });
                dispatch({
                  type: 'set-patient-notes',
                  value: temp,
                });
              })
              .catch((err) => {
                console.log(err);
              });
            console.log(state.familyMembers);
            if (notification) {
              await axios({
                method: 'post',
                headers: {
                  Authorization: await Auth.currentSession()
                    .then((res) => res.idToken.jwtToken)
                    .catch((err) => {
                      console.log(err);
                      return '';
                    }),
                },
                url:
                  'https://w1dms5jz5f.execute-api.us-west-2.amazonaws.com/DEV/twilio',
                data: {
                  familyMembers: state.familyMembers,
                  selectedPatient: state.selectedPatient,
                  note: note,
                },
              })
                .then((res) => {
                  console.log(res.data);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            setNote('');
            setPublicNote(false);
            setNotification(false);
            props.handleClose();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
