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
  MenuItem,
  Grid,
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

const required = ['firstName', 'lastName', 'relationship', 'patient'];
const relationship = [
  {
    value: 1,
    label: 'Friend',
  },
  {
    value: 2,
    label: 'Spouse',
  },
  {
    value: 3,
    label: 'Parent',
  },
  {
    value: 4,
    label: 'Child',
  },
  {
    value: 5,
    label: 'Sibling',
  },
  {
    value: 99,
    label: 'Other',
  },
];
const fields = [
  {
    label: 'First Name',
    required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 6,
    value: 'firstName',
  },
  {
    label: 'Last Name',
    required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 6,
    value: 'lastName',
  },
  {
    label: 'Relationship',
    required: true,
    select: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 4,
    value: 'relationship',
    child: relationship.map((e) => (
      <MenuItem key={e.value} value={e.value}>
        {e.label}
      </MenuItem>
    )),
  },
  {
    label: 'Email',
    //required: true,
    type: 'email',
    xs: 6,
    sm: 6,
    md: 4,
    value: 'email',
  },
  {
    label: 'Mobile',
    //required: true,
    type: 'phone',
    xs: 6,
    sm: 6,
    md: 4,
    value: 'mobile',
  },
];

DialogUpdateFamilly.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
DialogUpdateFamilly.defaultProps = {
  open: false,
  handleClose: () => {},
};

export default function DialogUpdateFamilly(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const [note, setNote] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const [publicNote, setPublicNote] = React.useState(false);
  const [Errors, setErrors] = React.useState([]);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="dialog-familly"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="dialog-familly-title">Uodate Familly Member</DialogTitle>
      <DialogContent dividers>
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
        </Grid>
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
