import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
} from '@material-ui/core';
import { Visibility, Add } from '@material-ui/icons';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import moment from 'moment';
//COMPONENTS
import SnackBarNotification from '../../components/SnackBarNotification';
import DialogNewPatientNote from '../../components/DialogNewPatientNote';
import DialogUpdatePatientNote from '../../components/DialogUpdatePatientNote';
import DialogNewFamilly from '../../components/DialogNewFamilly';
import DialogUpdateFamilly from '../../components/DialogUpdateFamilly';

//STORE
import { store } from '../../store.js';
//UTILS
import PatientFields from '../../utils/PatientFields';
import PatientRequiredFields from '../../utils/PatientRequiredFields';
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
  chip: {
    margin: 5,
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

export default function DialogPatient(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const [Errors, setErrors] = React.useState([]);
  const [note, setNote] = React.useState(false);
  const [noteUpdate, setNoteUpdate] = React.useState(false);
  const [familly, setFamilly] = React.useState(false);
  const [updateFamilly, setUpdateFamilly] = React.useState(false);
  const [snackBar, setSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState('');

  useEffect(() => {
    console.log('LOADED THIS');
    if (props.open) {
      console.log('OPEN');
      console.log(state);
      getNotes();
      getFamily();
    }
    async function getFamily() {
      const selectedPatient = state.selectedPatient;
      const params = {
        sql: 'SELECT * FROM familly WHERE patientId=:patientId',
        parameters: [
          {
            name: 'patientId',
            value: { longValue: selectedPatient?.patientId },
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
            type: 'set-family-members',
            value: res.data.records.map((e) => ({
              famillyId: e[0].longValue,
              firstName: e[1].stringValue,
              lastName: e[2].stringValue,
              relationship: e[3].longValue,
              email: e[4].stringValue,
              mobile: e[5].stringValue,
              createdDate: e[6].stringValue,
              updatedDate: e[7].stringValue,
              patientId: e[8].longValue,
            })),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    async function getNotes() {
      const selectedPatient = state.selectedPatient;
      const params = {
        sql: 'SELECT * FROM notes WHERE patientId=:patientId',
        parameters: [
          {
            name: 'patientId',
            value: { longValue: selectedPatient?.patientId },
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
            value: res.data.records.map((e) => ({
              noteId: e[0].longValue,
              createdDate: e[1].stringValue,
              updatedDate: e[2].stringValue,
              patientId: e[3].longValue,
              public: e[4].booleanValue,
              note: e[5].stringValue,
            })),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {
      // Clean up the subscription
      //subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  function checkMissing(obj) {
    let _temp = [];
    for (let i of PatientRequiredFields) {
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
      <SnackBarNotification
        open={snackBar}
        handleClose={() => setSnackBar(false)}
        message={snackBarMessage}
        duration={5000}
      />
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
            <Grid item xs={8} className={classes.boxBorder}>
              <Grid
                spacing={3}
                container
                //direction="row"
                //justify="center"
                //alignItems="center"
              >
                {PatientFields.map((e, i) => (
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
                        dispatch({
                          type: 'set-family',
                          value: {},
                        });
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Typography>
                  {state.familyMembers.map((e, i) => (
                    <Chip
                      key={`${e?.firstName}${e?.lastName}`}
                      label={`${e?.firstName} ${e?.lastName}`}
                      variant="outlined"
                      className={classes.chip}
                      size="small"
                      onDelete={async () => {
                        const family = state.family;
                        const params = {
                          sql: 'DELETE FROM familly WHERE famillyId=:famillyId',
                          parameters: [
                            {
                              name: 'famillyId',
                              value: { longValue: e?.famillyId },
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
                              type: 'set-family-members',
                              value: state.familyMembers.filter(
                                (f) => f?.famillyId !== e?.famillyId
                              ),
                            });
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                      onClick={() => {
                        console.log('Update family ');
                        console.log(e);
                        dispatch({
                          type: 'set-family',
                          value: e,
                        });
                        setUpdateFamilly(true);
                      }}
                      color="primary"
                    />
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
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
                {state.patientNotes
                  .sort((a, b) => {
                    if (a.noteId > b.noteId) {
                      return -1;
                    }
                    if (a.noteId < b.noteId) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((e, i) => {
                    return (
                      <ListItem
                        button
                        key={`patient-notes-${i}`}
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
                          primary={e?.createdDate}
                          secondary={e?.note}
                        />
                        {e?.public ? (
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
            variant="outlined"
            color="primary"
            onClick={async () => {
              const selectedPatient = state.selectedPatient;
              console.log(selectedPatient);
              const _missing = checkMissing(selectedPatient);
              setErrors(_missing);
              if (_missing.length > 0) {
                setSnackBar(true);
                setSnackBarMessage('Error: Missing parameters');
              } else {
                const params = {
                  sql:
                    'UPDATE patient SET firstName=:firstName,lastName=:lastName,ssn=:ssn,bed=:bed,age=:age,sex=:sex,status=:status,updatedDate=:updatedDate,admissionDate=:admissionDate,exitDate=:exitDate WHERE patientId = :patientId',
                  parameters: [
                    {
                      name: 'patientId',
                      value: { longValue: selectedPatient?.patientId },
                    },
                    {
                      name: 'firstName',
                      value: { stringValue: selectedPatient?.firstName },
                    },
                    {
                      name: 'lastName',
                      value: { stringValue: selectedPatient?.lastName },
                    },
                    {
                      name: 'ssn',
                      value: { stringValue: selectedPatient?.ssn },
                    },
                    {
                      name: 'bed',
                      value: {
                        stringValue: selectedPatient?.bed
                          ? selectedPatient?.bed
                          : '',
                      },
                    },
                    { name: 'age', value: { longValue: selectedPatient?.age } },
                    { name: 'sex', value: { longValue: selectedPatient?.sex } },
                    {
                      name: 'status',
                      value: {
                        longValue: selectedPatient?.status,
                      },
                    },
                    {
                      name: 'updatedDate',
                      value: { stringValue: moment.utc().format('YYYY-MM-DD') },
                    },
                    {
                      name: 'admissionDate',
                      value: { stringValue: selectedPatient?.admissionDate },
                    },
                    {
                      name: 'exitDate',
                      value: { stringValue: selectedPatient?.exitDate },
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
                    setSnackBar(true);
                    setSnackBarMessage('Successfully updated the DB');
                    dispatch({
                      type: 'set-data',
                      value: state.data.map((e) => {
                        if (e.patientId === selectedPatient.patientId) {
                          return selectedPatient;
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
              }
            }}
          >
            Update
          </Button>
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
