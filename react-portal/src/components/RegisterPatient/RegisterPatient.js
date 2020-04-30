import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
//UTILS
import PatientFields from '../../utils/PatientFields';
import PatientRequiredFields from '../../utils/PatientRequiredFields';
//STORE
import { store } from '../../store.js';
//COMPONENT
import SnackBarNotification from '../../components/SnackBarNotification';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },
}));

RegisterPatient.propTypes = {
  title: PropTypes.string,
};
RegisterPatient.defaultProps = {
  title: 'Title',
};

export default function RegisterPatient(props) {
  const [Errors, setErrors] = React.useState([]);
  const [snackBar, setSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState('');

  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
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
    <div className={classes.root}>
      <SnackBarNotification
        open={snackBar}
        handleClose={() => setSnackBar(false)}
        message={snackBarMessage}
        duration={3000}
      />
      <Grid item xs={12}>
        <Typography
          variant="h3"
          component="h3"
          align="center"
          color="primary"
          gutterBottom
        >
          {props.title}
        </Typography>
      </Grid>
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
              value={state.patient[e?.value] ? state.patient[e?.value] : ''}
              onChange={(f) => {
                const patient = state.patient;
                dispatch({
                  type: 'set-patient',
                  value: {
                    ...patient,
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
              value={
                state?.patient?.admissionDate
                  ? state?.patient?.admissionDate
                  : moment.utc().format()
              }
              onChange={(e) => {
                const patient = state.patient;
                dispatch({
                  type: 'set-patient',
                  value: {
                    ...patient,
                    ...{ admissionDate: e },
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
              value={
                state?.patient?.exitDate
                  ? state?.patient?.exitDate
                  : moment.utc().format()
              }
              onChange={(e) => {
                const patient = state.patient;
                dispatch({
                  type: 'set-patient',
                  value: {
                    ...patient,
                    ...{ exitDate: e },
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
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              const patient = state.patient;
              const _missing = checkMissing(state.patient);
              setErrors(_missing);
              if (_missing.length > 0) {
                setSnackBar(true);
                setSnackBarMessage('Error: Missing parameters');
              } else {
                const params = {
                  sql:
                    'INSERT INTO patient (firstName,lastName,ssn,bed,age,sex,status,createdDate,updatedDate,admissionDate,exitDate) values (:firstName,:lastName,:ssn,:bed,:age,:sex,:status,:createdDate,:updatedDate,:admissionDate,:exitDate)',
                  parameters: [
                    {
                      name: 'firstName',
                      value: { stringValue: patient?.firstName },
                    },
                    {
                      name: 'lastName',
                      value: { stringValue: patient?.lastName },
                    },
                    { name: 'ssn', value: { stringValue: patient?.ssn } },
                    {
                      name: 'bed',
                      value: { stringValue: patient?.bed ? patient?.bed : '' },
                    },
                    { name: 'age', value: { longValue: patient?.age } },
                    { name: 'sex', value: { longValue: patient?.sex } },
                    {
                      name: 'status',
                      value: {
                        longValue: patient?.status ? patient?.status : 1,
                      },
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
                      name: 'admissionDate',
                      value: { stringValue: moment.utc().format('YYYY-MM-DD') },
                    },
                    {
                      name: 'exitDate',
                      value: { stringValue: moment.utc().format('YYYY-MM-DD') },
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
                    setSnackBarMessage('Successfully inserted data into DB');
                    dispatch({
                      type: 'set-patient',
                      value: {},
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
