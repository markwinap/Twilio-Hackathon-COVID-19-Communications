import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import moment from 'moment';
//UTILS
import FamillyFields from '../../utils/FamillyFields';
import FamillyRequiredFields from '../../utils/FamillyRequiredFields';
//STORE
import { store } from '../../store.js';
//COMPONENT
import SnackBarNotification from '../../components/SnackBarNotification';
//HOOKS
import Debounce from '../../hooks/Debounce';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },
}));

RegisterFamily.propTypes = {
  title: PropTypes.string,
};
RegisterFamily.defaultProps = {
  title: 'Title',
};
let timeout = null;
export default function RegisterFamily(props) {
  const [Errors, setErrors] = React.useState([]);
  const [snackBar, setSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = Debounce(searchTerm, 500);

  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;

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

  useEffect(() => {
    async function getData(value) {
      const params = {
        sql:
          'SELECT * FROM patient WHERE CONCAT(firstName," ",lastName) LIKE :like LIMIT 10',
        parameters: [
          {
            name: 'like',
            value: { stringValue: `%${value}%` },
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
          const records = res.data.records;
          setResults(
            records.map((e) => ({
              patientId: e[0].longValue,
              firstName: e[1].stringValue,
              lastName: e[2].stringValue,
              name: `${e[1].stringValue} ${e[2].stringValue}`,
            }))
          );
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
    }
    if (debouncedSearchTerm) {
      setIsSearching(true);
      getData(debouncedSearchTerm);
      setLoading(true);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm, dispatch]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  return (
    <div className={classes.root}>
      <SnackBarNotification
        open={snackBar}
        handleClose={() => setSnackBar(false)}
        message={snackBarMessage}
        duration={5000}
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
        {FamillyFields.map((e, i) => (
          <Grid
            item
            xs={e.xs}
            sm={e.sm}
            md={e.md}
            key={`grid_register_familly_${i}`}
          >
            <TextField
              required={e?.required}
              error={Errors.includes(e.value)}
              fullWidth
              select={e?.select}
              type={e?.type}
              id={`register_familly_${e?.label}`}
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
        <Grid item xs={6} sm={6} md={6}>
          <Autocomplete
            id="search-patient"
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            onChange={(event, value, reason) => {
              const family = state.family;
              if (reason === 'clear') {
                dispatch({
                  type: 'set-family',
                  value: {
                    ...family,
                    ...{ patientId: 0, patientName: '' },
                  },
                });
              } else {
                dispatch({
                  type: 'set-family',
                  value: {
                    ...family,
                    ...{ patientId: value.patientId, patientName: value.name },
                  },
                });
              }
            }}
            // getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={results}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient"
                required
                error={Errors.includes('patientName')}
                fullWidth
                //variant="outlined"
                value={
                  state?.family?.patientName ? state?.family?.patientName : ''
                }
                onChange={(e) => {
                  const family = state.family;
                  dispatch({
                    type: 'set-family',
                    value: {
                      ...family,
                      ...{ patientName: e.target.value },
                    },
                  });

                  setSearchTerm(e.target.value);
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              const family = state.family;
              console.log(family);
              const _missing = checkMissing(state.family);
              setErrors(_missing);
              if (_missing.length > 0) {
                setSnackBar(true);
                setSnackBarMessage('Error: Missing parameters');
              } else {
                const params = {
                  sql:
                    'INSERT INTO familly (firstName,lastName,relationship,email,mobile,createdDate,updatedDate,patientId) values (:firstName,:lastName,:relationship,:email,:mobile,:createdDate,:updatedDate,:patientId)',
                  parameters: [
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
                    { name: 'email', value: { stringValue: family?.email } },
                    { name: 'mobile', value: { stringValue: family?.mobile } },
                    {
                      name: 'patientId',
                      value: { longValue: family?.patientId },
                    },
                    {
                      name: 'createdDate',
                      value: { stringValue: moment.utc().format('YYYY-MM-DD') },
                    },
                    {
                      name: 'updatedDate',
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
                      type: 'set-family',
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
