import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControlLabel,
  Switch,
  Chip,
} from '@material-ui/core';
import { Visibility, Add, Done } from '@material-ui/icons';
//COMPONENTS
import DialogNewPatientNote from '../../components/DialogNewPatientNote';
import DialogUpdatePatientNote from '../../components/DialogUpdatePatientNote';
import DialogNewFamilly from '../../components/DialogNewFamilly';
import DialogUpdateFamilly from '../../components/DialogUpdateFamilly';

//STORE
import { store } from '../../store.js';
//UTILS
import Sex from '../../utils/Sex';
import PatientStatus from '../../utils/PatientStatus';
//DATE
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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

DialogPatient.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
DialogPatient.defaultProps = {
  open: false,
  handleClose: () => {},
};
const familYMembers = [
  {
    firstName: 'test',
    lastName: 'test2',
    relationship: 1,
    email: 'test',
    mobile: '1212',
  },
];
const patientNotes = [
  {
    date: 1588035034,
    notes: 'This is a test note',
    public: true,
  },
  {
    date: 1588035034,
    notes:
      'This is a public not to let the family know that his patient is feeling better',
    public: false,
  },
  {
    date: 1588035034,
    notes: 'This is a test public note',
    public: true,
  },
  {
    date: 1588035034,
    notes: 'This is a test note',
    public: true,
  },
  {
    date: 1588035034,
    notes:
      'This is a public not to let the family know that his patient is feeling better',
    public: false,
  },
  {
    date: 1588035034,
    notes: 'This is a test public note',
    public: true,
  },
];

const required = ['firstName', 'lastName', 'ssn', 'sex', 'age'];
const fields = [
  {
    label: 'First Name',
    required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 4,
    value: 'firstName',
  },
  {
    label: 'Last Name',
    required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 4,
    value: 'lastName',
  },
  {
    label: 'SSN',
    required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 2,
    value: 'ssn',
  },
  {
    label: 'Bed',
    //required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 2,
    value: 'bed',
  },
  {
    label: 'Age',
    required: true,
    type: 'number',
    xs: 6,
    sm: 6,
    md: 2,
    value: 'age',
  },
  {
    label: 'Sex',
    required: true,
    select: true,
    type: 'text',
    xs: 6,
    sm: 6,
    md: 2,
    value: 'sex',
    child: Sex.map((e) => (
      <MenuItem key={e.value} value={e.value}>
        {e.label}
      </MenuItem>
    )),
  },
  {
    label: 'Status',
    select: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 2,
    value: 'status',
    child: PatientStatus.map((e) => (
      <MenuItem key={e.value} value={e.value}>
        {e.value}
      </MenuItem>
    )),
  },
];

export default function DialogPatient(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const [Errors, setErrors] = React.useState([]);
  const [note, setNote] = React.useState(false);
  const [noteUpdate, setNoteUpdate] = React.useState(false);
  const [familly, setFamilly] = React.useState(false);
  const [updateFamilly, setUpdateFamilly] = React.useState(false);

  function checkMissing(obj) {
    let _temp = [];
    for (let i of required) {
      if (!obj.hasOwnProperty(i)) {
        _temp.push(i);
      } else {
        if (obj[i] === '') {
          _temp.push(i);
        }
      }
    }
    return _temp;
  }
  return (
    <>
      <DialogNewFamilly open={familly} handleClose={() => setFamilly(false)} />
      <DialogUpdateFamilly
        open={updateFamilly}
        handleClose={() => setUpdateFamilly(false)}
      />
      <DialogNewPatientNote open={note} handleClose={() => setNote(false)} />
      <DialogUpdatePatientNote
        open={noteUpdate}
        handleClose={() => setNoteUpdate(false)}
      />

      <Dialog
        open={props.open}
        //onClose={props.handleClose}
        aria-labelledby="dialog-patient"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="dialog-patient-title">{`Patient - ${state?.selectedPatient.firstName} ${state?.selectedPatient.lastName}`}</DialogTitle>
        <DialogContent dividers>
          <Grid spacing={3} container>
            <Grid item xs={6} className={classes.boxBorder}>
              <Grid
                spacing={3}
                container
                //direction="row"
                //justify="center"
                //alignItems="center"
              >
                <Grid item xs={12} sm={12} md={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      const _missing = checkMissing(state.patient);
                      setErrors(_missing);
                    }}
                  >
                    Update
                  </Button>
                </Grid>
                {fields.map((e, i) => (
                  <Grid
                    item
                    xs={e.xs}
                    sm={e.sm}
                    md={e.md}
                    key={`grid_register_patitent_${i}`}
                  >
                    <TextField
                      required={e?.required}
                      error={Errors.includes(e.value)}
                      fullWidth
                      select={e?.select}
                      type={e?.type}
                      id={`register_patient_${e?.label}`}
                      label={e?.label}
                      value={state?.selectedPatient[e?.value]}
                      onChange={(f) => {
                        const selectedPatient = state.selectedPatient;

                        dispatch({
                          type: 'set-selected-patient',
                          value: {
                            ...selectedPatient,
                            ...{ [e.value]: f.target.value },
                          },
                        });
                      }}
                    >
                      {e?.child}
                    </TextField>
                  </Grid>
                ))}

                <Grid item xs={10} sm={6} md={3}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      id="date-admission"
                      label="Admission Date"
                      format="MM/DD/YYYY"
                      value={state?.selectedPatient?.admission}
                      onChange={(e) => {
                        const selectedPatient = state.selectedPatient;
                        dispatch({
                          type: 'set-selected-patient',
                          value: {
                            ...selectedPatient,
                            ...{ admission: e },
                          },
                        });
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={10} sm={6} md={3}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      id="date-exit"
                      label="Exit Date"
                      format="MM/DD/YYYY"
                      value={state?.selectedPatient?.admission}
                      onChange={(e) => {
                        const selectedPatient = state.selectedPatient;

                        dispatch({
                          type: 'set-selected-patient',
                          value: {
                            ...selectedPatient,
                            ...{ exit: e },
                          },
                        });
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="h5" gutterBottom>
                    Family Members
                    <IconButton
                      color="secondary"
                      aria-label="add-note"
                      onClick={() => {
                        setFamilly(true);
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Typography>
                  {familYMembers.map((e, i) => (
                    <Chip
                      key={`${e.firstName}${e.lastName}`}
                      label={`${e.firstName} ${e.lastName}`}
                      onDelete={() => {
                        console.log('Delete family ');
                      }}
                      onClick={() => {
                        console.log('Update family ');
                        setUpdateFamilly(true);
                      }}
                      color="primary"
                    />
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" gutterBottom>
                Notes
                <IconButton
                  color="secondary"
                  aria-label="add-note"
                  onClick={() => {
                    setNote(true);
                  }}
                >
                  <Add />
                </IconButton>
              </Typography>

              <List
                component="nav"
                aria-label="patient-notes"
                className={classes.patitentNotes}
              >
                {patientNotes.map((e, i) => {
                  return (
                    <ListItem
                      button
                      onClick={() => {
                        dispatch({
                          type: 'set-selected-patient-note',
                          value: e,
                        });
                        setNoteUpdate(true);
                      }}
                      //selected={selectedIndex === 3}
                      //onClick={(event) => handleListItemClick(event, 3)}
                    >
                      <ListItemText
                        primary="Oui Oui"
                        secondary=" — Do you have Paris recommendations? Have you ever…"
                      />
                      {e.public ? (
                        <ListItemSecondaryAction>
                          <Visibility />
                        </ListItemSecondaryAction>
                      ) : null}
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleClose}
            color="secondary"
            //variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
