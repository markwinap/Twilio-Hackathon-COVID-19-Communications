import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import { HighlightOff, ExpandMore } from '@material-ui/icons';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import moment from 'moment';
//STORE
import { store } from '../../store.js';
//UTILS
import SearchConditions from '../../utils/SearchConditions';
import SearchFilters from '../../utils/SearchFilters';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 40,
    paddingRight: 40,
  },
  cardRoot: {
    maxWidth: 345,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  mediaIcon: {},
  media: {
    //width: 200,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#f8f8f8',
  },
  mediab: {
    //width: 200,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#f8f8f8',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  button: {
    marginRight: 5,
  },
}));

export default function PatientTable() {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;

  return (
    <div className={classes.root}>
      <ExpansionPanel square>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            variant="h6"
            component="h6"
            align="left"
            color="primary"
            gutterBottom
          >
            Filters
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={2}>
            {state.filters.map((e, i) => (
              <>
                {e.and || e.or ? (
                  <Grid item xs={12}>{`${e.and ? 'And' : 'Or'}`}</Grid>
                ) : null}

                <Grid item xs={12}>
                  <Grid container spacing={2} xs={12}>
                    <Grid item xs={6} sm={6} md={4}>
                      <TextField
                        select
                        fullWidth
                        id="standard-required"
                        label="Field"
                        value={e.field}
                        onChange={(field) => {
                          state.filters[i].field = field.target.value;
                          dispatch({
                            type: 'set-filters',
                            value: state.filters,
                          });
                        }}
                      >
                        {SearchFilters.map((f) => (
                          <MenuItem key={f.value} value={f.value}>
                            {f.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                      <TextField
                        select
                        fullWidth
                        id="standard-required"
                        label="Filter"
                        value={e.condition}
                        onChange={(condition) => {
                          state.filters[i].condition = condition.target.value;
                          dispatch({
                            type: 'set-filters',
                            value: state.filters,
                          });
                        }}
                      >
                        {SearchConditions.map((c) => (
                          <MenuItem key={c.value} value={c.value}>
                            {c.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6} sm={6} md={2}>
                      <TextField
                        fullWidth
                        id="standard-required"
                        label="Value"
                        value={e.value}
                        onChange={(value) => {
                          state.filters[i].value = value.target.value;
                          dispatch({
                            type: 'set-filters',
                            value: state.filters,
                          });
                        }}
                      />
                    </Grid>
                    {state.filters.length - 1 === i ? (
                      <Grid item xs={6} sm={6} md={4}>
                        <IconButton
                          color="primary"
                          aria-label="delete-filter"
                          onClick={() => {
                            state.filters.splice(i, 1);
                            dispatch({
                              type: 'set-filters',
                              value: state.filters,
                            });
                          }}
                        >
                          <HighlightOff />
                        </IconButton>
                        <Button
                          variant="outlined"
                          size="medium"
                          className={classes.button}
                          color="primary"
                          onClick={() => {
                            state.filters.push({
                              field: 1,
                              condition: 1,
                              value: '',
                              and: false,
                              or: true,
                            });
                            dispatch({
                              type: 'set-filters',
                              value: state.filters,
                            });
                          }}
                        >
                          Or
                        </Button>
                        <Button
                          variant="outlined"
                          size="medium"
                          className={classes.button}
                          color="secondary"
                          onClick={() => {
                            state.filters.push({
                              field: 1,
                              condition: 1,
                              value: '',
                              and: true,
                              or: false,
                            });
                            dispatch({
                              type: 'set-filters',
                              value: state.filters,
                            });
                          }}
                        >
                          And
                        </Button>
                      </Grid>
                    ) : null}
                  </Grid>
                </Grid>
              </>
            ))}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                size="medium"
                //className={classes.button}
                //color="Submit"
                onClick={async () => {
                  console.log(state.filters);
                  console.log(getSQL(state.filters));
                  console.log(getParams(state.filters));

                  const params = {
                    sql: getSQL(state.filters),
                    parameters: getParams(state.filters),
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
                      let records = res.data.records;
                      records = records.map((e) => ({
                        patientId: e[0].longValue,
                        firstName: e[1].stringValue,
                        lastName: e[2].stringValue,
                        name: `${e[1].stringValue} ${e[2].stringValue}`,
                        ssn: e[3].stringValue,
                        bed: e[4].stringValue,
                        age: e[5].longValue,
                        sex: e[6].longValue,
                        status: e[7].longValue,
                        createdDate: e[8].stringValue,
                        updatedDate: e[9].stringValue,
                        admissionDate: e[10].stringValue,
                        exitDate: e[11].stringValue,
                      }));
                      dispatch({
                        type: 'set-data',
                        value: records,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
function getSQL(arr) {
  let resp = 'SELECT * FROM patient';
  for (let i in arr) {
    resp += `${arr[i].and ? ' AND' : ''}${arr[i].or ? ' OR' : ''} WHERE ${
      SearchFilters[arr[i].field].field
    } ${SearchConditions[arr[i].condition].condition} :field${i}`;
  }
  return resp;
}
function getParams(arr) {
  let resp = [];
  for (let i in arr) {
    const value = arr[i].value;
    resp.push({
      name: `field${i}`,
      value: {
        stringValue: SearchConditions[arr[i].condition].func(value),
      },
    });
  }
  return resp;
}
/*
is: = WHERE country = 'USA'
is not: <>, !=  WHERE country <> 'USA'
conaints: WHERE `column` LIKE '%${value}%' 
does not coaint: WHERE `column` NOT LIKE '%${value}%'
starts with WHERE firstName LIKE 'a%';


SELECT * FROM patient LIMIT 10

and: false
condition: 1
field: 1
or: false
value: "juan"

and: true
condition: 1
field: 2
or: false
value: "perez"
*/
