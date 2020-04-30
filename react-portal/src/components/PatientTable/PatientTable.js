import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  TableContainer,
  Table,
  Tooltip,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import { Auth } from 'aws-amplify';

//COMPONENTS
import TableHeadPatient from '../../components/TableHeadPatient';
import DialogPatient from '../../components/DialogPatient';
import SnackBarNotification from '../../components/SnackBarNotification';
//UTILS
import Sex from '../../utils/Sex';
import PatientStatus from '../../utils/PatientStatus';
//STORE
import { store } from '../../store.js';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
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
export default function PatientTable() {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  const [dialog, setDialog] = React.useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('patientId');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [results, setResults] = useState([]);
  const [snackBar, setSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState('');

  useEffect(() => {
    const params = {
      sql: 'SELECT * FROM patient LIMIT 30',
      parameters: [],
    };
    async function loadData(params) {
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
          setResults(records);
          setSnackBar(true);
          setSnackBarMessage('Data loaded from DB');
          dispatch({
            type: 'set-data',
            value: records,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    loadData(params);
    return () => {};
  }, [dispatch, value]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, state.data.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <SnackBarNotification
        open={snackBar}
        handleClose={() => setSnackBar(false)}
        message={snackBarMessage}
        duration={5000}
      />
      <DialogPatient open={dialog} handleClose={() => setDialog(false)} />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table" size="small">
          <TableHeadPatient
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={state.data.length}
          />
          <TableBody>
            {stableSort(state.data, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    onClick={(e) => {
                      setDialog(true);
                      dispatch({
                        type: 'set-selected-patient',
                        value: row,
                      });
                    }}
                    tabIndex={-1}
                    key={row.patientId}
                  >
                    <TableCell>{row.patientId}</TableCell>
                    <TableCell>{row.firstName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.ssn}</TableCell>
                    <TableCell>{row.bed}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>
                      {Sex.filter((e) => e.value === row.sex)[0]?.label}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          PatientStatus.filter((e) => e.value === row.status)[0]
                            .label
                        }
                      >
                        <div>{row.status}</div>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={state.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
