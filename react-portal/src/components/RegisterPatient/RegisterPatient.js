import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
} from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
//STORE
import { store } from '../../store.js';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },
}));
const required = ['firstName', 'lastName', 'ssn', 'sex', 'age'];
const sex = [
  {
    value: 1,
    label: 'M',
  },
  {
    value: 2,
    label: 'F',
  },
];
const patientStatus = [
  {
    value: 1,
    label: '01-DISCHARGED TO HOME OR SELF CARE',
  },
  {
    value: 2,
    label: '02-DISCHARGED/TRANSFERRED TO ANOTHER SHORT-TERM HOSPITAL',
  },
  {
    value: 3,
    label: '03-DISCHARGED/TRANSFERRED TO A NURSING FACILITY',
  },
  {
    value: 4,
    label: '04-DISCHARGED/TRANSFERRED TO AN INTERMEDIATE CARE FACILITY',
  },
  {
    value: 5,
    label: '05-DISCHARGED/TRANSFERRED TO ANOTHER TYPE INSTITUTION',
  },
  {
    value: 6,
    label:
      '06-DISCHARGED/TRANSFERRED TO HOME UNDER CARE OF ORGANIZED HOME HEALTH SERVICE ORGANIZATION',
  },
  {
    value: 7,
    label: '07-LEFT AGAINST MEDICAL ADVICE OR DISCONTINUED CARE',
  },
  {
    value: 8,
    label:
      '08-DISCHARGED/TRANSFERRED TO HOME UNDER CARE OF A HOME IV DRUG THERAPY PROVIDER',
  },
  {
    value: 9,
    label: '09-ADMITTED AS AN INPATIENT TO THIS HOSPITAL',
  },
  {
    value: 20,
    label: '20-EXPIRED',
  },
  {
    value: 30,
    label: '30-STILL A PATIENT',
  },
  {
    value: 40,
    label: '40-EXPIRED AT HOME',
  },
  {
    value: 41,
    label: '41-EXPIRED IN A MEDICAL FACILITY',
  },
  {
    value: 42,
    label: '42-EXPIRED - PLACE UNKNOWN ',
  },
  {
    value: 43,
    label: '43-Discharged/transferred to a federal hospital',
  },
  {
    value: 50,
    label: '50-HOSPICE - HOME',
  },
  {
    value: 51,
    label: '51-HOSPICE - MEDICAL FACILITY',
  },
  {
    value: 61,
    label: '61-DISCHARGED TO A HOSPITAL-BASED MEDICARE APPROVED SWING BED',
  },
  {
    value: 62,
    label:
      '62-DISCHARGED/TRANSFERRED TO ANOTHER REHAB FACILITY/REHAB UNIT OF A HOSPITAL',
  },
  {
    value: 63,
    label: '63-DISCHARGED/TRANSFERRED TO A LONG-TERM CARE HOSPITAL',
  },
  {
    value: 65,
    label:
      '64-DISCHARGED/TRANSFERRED TO A PSYCH HOSPITAL/PSYCH UNIT OF A HOSPITAL',
  },
  {
    value: 66,
    label: '66-DISCHARGED TO CRITICAL ACCESS HOSPITAL',
  },
  {
    value: 71,
    label:
      '71-DISCHARGED/TRANSFERRED TO ANOTHER INSTITUTION FOR OUTPATIENT SERVICES',
  },
  {
    value: 72,
    label:
      '77-DISCHARGED/TRANSFERRED TO THIS INSTITUTION FOR OUTPATIENT SERVICES',
  },
  {
    value: 99,
    label: '99-UNKNOWN',
  },
];
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
    md: 1,
    value: 'age',
  },
  {
    label: 'Sex',
    required: true,
    select: true,
    type: 'text',
    xs: 6,
    sm: 6,
    md: 1,
    value: 'sex',
    child: sex.map((e) => (
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
    md: 4,
    value: 'status',
    child: patientStatus.map((e) => (
      <MenuItem key={e.value} value={e.value}>
        {e.label}
      </MenuItem>
    )),
  },
];
RegisterPatient.propTypes = {
  title: PropTypes.string,
};
RegisterPatient.defaultProps = {
  title: 'Title',
};

export default function RegisterPatient(props) {
  const [Errors, setErrors] = React.useState([]);
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
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
    <div className={classes.root}>
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
              value={state.patient[e?.value]}
              onChange={(f) => {
                const patient = state.patient;
                dispatch({
                  type: 'set-patient',
                  value: {
                    ...{ patient },
                    ...{ [e.value]: f.currentTarget.value },
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
              value={state?.patient?.admission}
              onChange={(e) => {
                const patient = state.patient;
                dispatch({
                  type: 'set-patient',
                  value: {
                    ...{ patient },
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
              value={state?.patient?.admission}
              onChange={(e) => {
                const patient = state.patient;
                dispatch({
                  type: 'set-patient',
                  value: {
                    ...{ patient },
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const _missing = checkMissing(state.patient);
              setErrors(_missing);
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
