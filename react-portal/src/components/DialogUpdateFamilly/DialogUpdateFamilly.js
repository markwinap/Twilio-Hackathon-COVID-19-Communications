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
  Grid,
  Box,
} from '@material-ui/core';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import moment from 'moment';
//STORE
import { store } from '../../store.js';
//UTILS
import FamillyFields from '../../utils/FamillyFields';
import FamillyRequiredFields from '../../utils/FamillyRequiredFieldsDialog';
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

DialogNewFamilly.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
DialogNewFamilly.defaultProps = {
  open: false,
  handleClose: () => {},
};

export default function DialogNewFamilly(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const [note, setNote] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const [publicNote, setPublicNote] = React.useState(false);
  const [Errors, setErrors] = React.useState([]);
  function checkMissing(obj) {
    let _temp = [];
    for (let i of FamillyRequiredFields) {
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
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="dialog-familly"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="dialog-familly-title">Update Familly Member</DialogTitle>
      <DialogContent dividers>
        <Grid
          spacing={3}
          container
          //direction="row"
          //justify="center"
          //alignItems="center"
        >
          {FamillyFields.map((e, i) => (
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
                value={state.family[e?.value] ? state.family[e?.value] : ''}
                onChange={(f) => {
                  const family = state.family;
                  dispatch({
                    type: 'set-family',
                    value: {
                      ...family,
                      ...{ [e.value]: f.target.value },
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
        <Button
          color="secondary"
          onClick={async () => {
            const selectedPatient = state.selectedPatient;
            const family = state.family;
            console.log(family);
            const _missing = checkMissing(state.family);
            setErrors(_missing);
            console.log(_missing);
            if (_missing.length > 0) {
            } else {
              console.log('Not missing');
              const params = {
                sql:
                  'UPDATE familly SET firstName=:firstName,lastName=:lastName,relationship=:relationship,email=:email,mobile=:mobile,updatedDate=:updatedDate WHERE famillyId = :famillyId',
                parameters: [
                  {
                    name: 'famillyId',
                    value: { longValue: family?.famillyId },
                  },
                  {
                    name: 'firstName',
                    value: { stringValue: family?.firstName },
                  },
                  {
                    name: 'lastName',
                    value: { stringValue: family?.lastName },
                  },
                  {
                    name: 'relationship',
                    value: { longValue: family?.relationship },
                  },
                  {
                    name: 'email',
                    value: { stringValue: family?.email ? family?.email : '' },
                  },
                  {
                    name: 'mobile',
                    value: {
                      stringValue: family?.mobile ? family?.mobile : '',
                    },
                  },
                  {
                    name: 'updatedDate',
                    value: { stringValue: moment.utc().format('YYYY-MM-DD') },
                  },
                ],
              };
              console.log(params);
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
                    value: state.familyMembers.map((e) => {
                      if (e.famillyId === family.famillyId) {
                        return family;
                      } else {
                        return e;
                      }
                    }),
                  });
                  dispatch({
                    type: 'set-family',
                    value: {},
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
      </DialogActions>
    </Dialog>
  );
}
