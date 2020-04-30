import React, { useContext } from 'react';
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
  Box,
} from '@material-ui/core';
//STORE
import { Auth } from 'aws-amplify';
import axios from 'axios';
import moment from 'moment';
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

DialogNewPatientNote.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
DialogNewPatientNote.defaultProps = {
  open: false,
  handleClose: () => {},
};

export default function DialogNewPatientNote(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="patient-note"
      fullWidth
    >
      <DialogTitle id="patient-note-title">
        <Box position="absolute">Update Patient Note</Box>
        <Box right={10} position="absolute">
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            right={10}
            onClick={async () => {
              const selectedPatientNote = state.selectedPatientNote;
              const params = {
                sql: 'DELETE FROM notes WHERE noteId=:noteId',
                parameters: [
                  {
                    name: 'noteId',
                    value: { longValue: selectedPatientNote?.noteId },
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

                  dispatch({
                    type: 'set-patient-notes',
                    value: state.patientNotes.map((e) => {
                      if (e.noteId !== selectedPatientNote.noteId) {
                        return e;
                      }
                    }),
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
              props.handleClose();
            }}
          >
            Delete
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="patientNote"
          label="Note"
          type="text"
          value={state?.selectedPatientNote?.note}
          onChange={(e) => {
            const selectedPatientNote = state.selectedPatientNote;
            dispatch({
              type: 'set-selected-patient-note',
              value: {
                ...selectedPatientNote,
                ...{
                  note: e.target.value,
                },
              },
            });
          }}
          fullWidth
        />
        <FormControlLabel
          control={
            <Switch
              checked={state?.selectedPatientNote?.public}
              onChange={(e) => {
                const selectedPatientNote = state.selectedPatientNote;
                console.log(e.target.checked);
                dispatch({
                  type: 'set-selected-patient-note',
                  value: {
                    ...selectedPatientNote,
                    ...{
                      public: e.target.checked,
                    },
                  },
                });
              }}
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
            const selectedPatientNote = state.selectedPatientNote;
            const params = {
              sql:
                'UPDATE notes SET updatedDate=:updatedDate,public=:public,note=:note WHERE noteId = :noteId',
              parameters: [
                {
                  name: 'noteId',
                  value: { longValue: selectedPatientNote?.noteId },
                },
                {
                  name: 'updatedDate',
                  value: { stringValue: moment.utc().format('YYYY-MM-DD') },
                },
                {
                  name: 'public',
                  value: { longValue: selectedPatientNote?.public ? 1 : 0 },
                },
                {
                  name: 'note',
                  value: {
                    stringValue: selectedPatientNote?.note,
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
                dispatch({
                  type: 'set-patient-notes',
                  value: state.patientNotes.map((e) => {
                    if (e.noteId === selectedPatientNote.noteId) {
                      return selectedPatientNote;
                    } else {
                      return e;
                    }
                  }),
                });
              })
              .catch((err) => {
                console.log(err);
              });
            props.handleClose();
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
