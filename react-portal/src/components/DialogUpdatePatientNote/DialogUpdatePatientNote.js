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
      <DialogTitle id="patient-note-title">Update Patient Note</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="patientNote"
          label="Note"
          type="text"
          value={state?.selectedPatientNote?.notes}
          onChange={(e) => {
            const selectedPatientNote = state.selectedPatientNote;
            dispatch({
              type: 'set-selected-patient-note',
              value: {
                ...selectedPatientNote,
                ...{
                  notes: e.target.value,
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
        <Button color="secondary" onClick={props.handleClose}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
