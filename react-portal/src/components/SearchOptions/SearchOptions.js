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
import { PhotoCamera, HighlightOff, ExpandMore } from '@material-ui/icons';

import { store } from '../../store.js';

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
const condition = [
  {
    value: 1,
    label: 'is',
  },
  {
    value: 2,
    label: 'is not',
  },
  {
    value: 3,
    label: 'contains',
  },
  {
    value: 4,
    label: 'does not contain',
  },
];
const filters = [
  {
    value: 1,
    label: 'First Name',
  },
  {
    value: 2,
    label: 'Last Name',
  },
  {
    value: 3,
    label: 'Sex',
  },
  {
    value: 4,
    label: 'Age',
  },
  {
    value: 5,
    label: 'SSN',
  },
];
export default function PatientTable() {
  const [value, setValue] = React.useState(0);
  const [filterArr, setFilterArr] = React.useState([
    {
      field: 1,
      condition: 1,
      value: '',
      and: false,
    },
  ]);
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
                        {filters.map((f) => (
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
                        {condition.map((c) => (
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
