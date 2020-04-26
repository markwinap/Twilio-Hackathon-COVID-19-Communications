import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';

import { store } from '../../store.js';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Juan Perez', 159, 6.0, 24, 4.0),
  createData('Maria Magdalena', 237, 9.0, 37, 4.3),
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
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
}));
const motivos = [
  {
    value: 1,
    label: 'A',
  },
  {
    value: 2,
    label: 'B',
  },
  {
    value: 3,
    label: 'C',
  },
  {
    value: 4,
    label: 'D',
  },
];
export default function PatientTable() {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch } = globalState;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Sex</TableCell>
              <TableCell align="right">Bed</TableCell>
              <TableCell align="right">SSN</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
