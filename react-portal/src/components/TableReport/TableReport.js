import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableSortLabel,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Fab,
  Snackbar,
  Grid,
  MenuItem,
} from '@material-ui/core';
import { Cached, Add } from '@material-ui/icons';

//components
import DialogCreateUser from '../DialogCreateUser';

import * as rax from 'retry-axios';
import axios from 'axios';
import moment from 'moment';
const interceptorId = rax.attach();
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
const headCells = [
  {
    id: 'cognito_usuario',
    numeric: false,
    disablePadding: false,
    label: 'Usuario',
  },
  {
    id: 'nombre_usuario',
    numeric: false,
    disablePadding: false,
    label: 'Nombre',
  },
  { id: 'desc_rol', numeric: false, disablePadding: false, label: 'Rol' },
  {
    id: 'tel_oficina',
    numeric: false,
    disablePadding: false,
    label: 'Tel Oficina',
  },
  { id: 'celular', numeric: false, disablePadding: false, label: 'Celular' },
  {
    id: 'correo_electronico',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'correo_electronico_alternativo',
    numeric: false,
    disablePadding: false,
    label: 'Email Alternativo',
  },
  {
    id: 'organizacion_encuestadora',
    numeric: false,
    disablePadding: false,
    label: 'Organizacion',
  },
];
const roles = [
  {
    value: 1,
    label: 'Administrador de Sistema',
  },
  {
    value: 2,
    label: 'Director Administrativo',
  },
  {
    value: 3,
    label: 'Director de Area',
  },
  {
    value: 4,
    label: 'Director General',
  },
  {
    value: 5,
    label: 'Encuestador',
  },
  {
    value: 6,
    label: 'Encuestador PH',
  },
  {
    value: 7,
    label: 'Jefe de Area',
  },
  {
    value: 8,
    label: 'Supervisor',
  },
  {
    value: 9,
    label: 'Administrador',
  },
];
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 400,
  },
  row: {
    //fontSize: 'small',
    position: 'relative',
  },
  formroot: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabAdd: {
    position: 'absolute',
    bottom: theme.spacing(8),
    right: theme.spacing(2),
  },
  dialotButton: {
    float: 'right',
  },
}));
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#37474f',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
function EnhancedTableHead(props) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TableReport() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState({ cognito: false });

  const [createDialog, setCreateDialog] = React.useState(false);
  const [dialogOpen, setdDialogOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(() => {
    getAll();
    return () => {
      // Clean up the subscription
    };
  }, []);

  async function getAll() {
    setSnackbarOpen(true);
    setSnackbarMessage('Loading Data');
    const _all = await axios({
      method: 'get',
      url:
        'https://nl06rx6lik.execute-api.us-west-2.amazonaws.com/PROD/admin/report',
      params: {
        key: 'all',
      },
      raxConfig: {
        retry: 3,
        retryDelay: 500,
        statusCodesToRetry: [
          [100, 199],
          [400, 429],
          [500, 599],
        ],
      },
    })
      .then((res) => {
        setSnackbarOpen(true);
        setSnackbarMessage('Data Loaded From Server');
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        setSnackbarOpen(true);
        setSnackbarMessage('Error From Server');
        return [];
      });
    console.log(_all);
    setSnackbarOpen(true);
    setRows(_all);
  }
  /*
id_usuario: 1
id_cat_rol: 4
nombre_usuario: "Oscar Reyes"
desc_rol: "Administrador"
tel_oficina: "13-40-20-00"
celular: "8183096788"
correo_electronico: "oreyes@caritas.org.mx"
correo_electronico_alternativo: ""
organizacion_encuestadora: "DIRECCION GENERAL"
fecha_alta: "2020-04-17T00:00:00.000Z"
fecha_modificacion: "2020-04-17T00:00:00.000Z"
cognito_usuario: "oregon"
*/

  return (
    <div className={classes.root}>
      <DialogCreateUser
        createDialog={createDialog}
        setCreateDialog={setCreateDialog}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
      />
      <Dialog
        open={dialogOpen}
        fullWidth={true}
        maxWidth="md"
        onClose={() => {
          setdDialogOpen(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="form-dialog-title"
          onClose={() => {
            setdDialogOpen(false);
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              Update Entrie
            </Grid>
            <Grid item xs={4}>
              <Button
                color="secondary"
                className={classes.dialotButton}
                onClick={async () => {
                  let payload = {
                    event: 'reset-user',
                    Cognito: {
                      Username: selectedUser?.cognito_usuario,
                      TemporaryPassword: 'P@ssword123',
                      DesiredDeliveryMediums: ['EMAIL'],
                      ForceAliasCreation: true,
                      UserAttributes: [],
                    },
                    SQL: selectedUser,
                  };
                  if (selectedUser?.correo_electronico) {
                    payload.Cognito.UserAttributes.push({
                      Name: 'email',
                      Value: selectedUser?.correo_electronico,
                    });
                  }
                  const _reset_user = await axios({
                    method: 'post',
                    url:
                      'https://nl06rx6lik.execute-api.us-west-2.amazonaws.com/PROD/admin/report',
                    data: payload,
                    raxConfig: {
                      retry: 3,
                      retryDelay: 500,
                      statusCodesToRetry: [
                        [100, 199],
                        [400, 429],
                        [500, 599],
                      ],
                    },
                  })
                    .then((res) => {
                      setSnackbarOpen(true);
                      setSnackbarMessage('Cognito Account Reset');
                      return res.data;
                    })
                    .catch((err) => {
                      console.log(err);
                      setSnackbarOpen(true);
                      setSnackbarMessage('Error From Server');
                      return err;
                    });
                }}
              >
                Reset Account
              </Button>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText>Update the following fields.</DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth={true}
                value={selectedUser?.nombre_usuario}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    ...{ nombre_usuario: e.target.value },
                  });
                }}
                label="Nombre"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth={true}
                value={selectedUser?.organizacion_encuestadora}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    ...{ organizacion_encuestadora: e.target.value },
                  });
                }}
                label="Oragnizacion"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth={true}
                label="Rol"
                value={selectedUser?.id_cat_rol}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    ...{
                      id_cat_rol: e.target.value,
                      desc_rol: roles.filter(
                        (f) => f.value === e.target.value
                      )[0].label,
                    },
                  });
                }}
                helperText="Select rol"
              >
                {roles.map((e) => (
                  <MenuItem key={e.value} value={e.value}>
                    {e.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth={true}
                value={selectedUser?.correo_electronico}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    ...{ correo_electronico: e.target.value },
                  });
                }}
                label="Email"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth={true}
                value={selectedUser?.correo_electronico_alternativo}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    ...{ correo_electronico_alternativo: e.target.value },
                  });
                }}
                label="Email Alternativo"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth={true}
                value={selectedUser?.tel_oficina}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    ...{ tel_oficina: e.target.value },
                  });
                }}
                label="Phone"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth={true}
                value={selectedUser?.celular}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    ...{ celular: e.target.value },
                  });
                }}
                label="Mobile"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                disabled={
                  selectedUser?.cognito_usuario !== null && //false, true
                  !selectedUser?.cognito
                }
                fullWidth={true}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    ...{ cognito_usuario: e.target.value, cognito: true },
                  });
                }}
                value={selectedUser?.cognito_usuario}
                label="Usuario"
              />
              {selectedUser?.cognito_usuario !== null &&
              !selectedUser?.cognito ? null : (
                <Button
                  fullWidth
                  disabled={selectedUser?.cognito_usuario === null}
                  onClick={async () => {
                    console.log('Create Cognito User');
                    setSnackbarOpen(true);
                    setSnackbarMessage('Creating Data');
                    let payload = {
                      event: 'create-cognito',
                      Cognito: {
                        Username: selectedUser?.cognito_usuario,
                        TemporaryPassword: 'P@ssword123',
                        DesiredDeliveryMediums: ['EMAIL'],
                        ForceAliasCreation: true,
                        UserAttributes: [],
                      },
                      SQL: selectedUser,
                    };
                    if (selectedUser?.correo_electronico) {
                      payload.Cognito.UserAttributes.push({
                        Name: 'email',
                        Value: selectedUser?.correo_electronico,
                      });
                    }
                    const _create_user = await axios({
                      method: 'post',
                      url:
                        'https://nl06rx6lik.execute-api.us-west-2.amazonaws.com/PROD/admin/report',
                      data: payload,
                      raxConfig: {
                        retry: 3,
                        retryDelay: 500,
                        statusCodesToRetry: [
                          [100, 199],
                          [400, 429],
                          [500, 599],
                        ],
                      },
                    })
                      .then((res) => {
                        setSnackbarOpen(true);
                        setSelectedUser({
                          ...selectedUser,
                          ...{ cognito: false },
                        });
                        setSnackbarMessage('User Created in Cognito');
                        const elementsIndex = rows.findIndex(
                          (e) => e.id_usuario === selectedUser.id_usuario
                        );
                        let newArray = [...rows];
                        newArray[elementsIndex] = {
                          ...newArray[elementsIndex],
                          ...{ cognito_usuario: selectedUser.cognito_usuario },
                        };
                        setRows(newArray);
                        return res.data;
                      })
                      .catch((err) => {
                        console.log(err);
                        setSnackbarOpen(true);
                        setSnackbarMessage('Error From Server');
                        return [];
                      });
                  }}
                  color="secondary"
                >
                  Create User
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setdDialogOpen(false);
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              console.log('Create User');
              setSnackbarOpen(true);
              setSnackbarMessage('Creating Data');
              let payload = {
                event: 'update-user',
                SQL: {
                  ...selectedUser,
                  ...{ fecha_modificacion: moment.utc().format() },
                },
              };
              const _update_user = await axios({
                method: 'post',
                url:
                  'https://nl06rx6lik.execute-api.us-west-2.amazonaws.com/PROD/admin/report',
                data: payload,
                raxConfig: {
                  retry: 3,
                  retryDelay: 500,
                  statusCodesToRetry: [
                    [100, 199],
                    [400, 429],
                    [500, 599],
                  ],
                },
              })
                .then((res) => {
                  setSnackbarOpen(true);
                  setSnackbarMessage('User Updated in DB');
                  const elementsIndex = rows.findIndex(
                    (e) => e.id_usuario === selectedUser.id_usuario
                  );
                  let newArray = [...rows];
                  newArray[elementsIndex] = selectedUser;
                  setRows(newArray);
                  setdDialogOpen(false);
                  return res.data;
                })
                .catch((err) => {
                  console.log(err);
                  setSnackbarOpen(true);
                  setSnackbarMessage('Error From Server');
                  return [];
                });
            }}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            size="small"
            aria-label="a dense table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />

            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow
                      hover
                      key={`table_row_${i}`}
                      onClick={(e) => {
                        setdDialogOpen(true);

                        setSelectedUser(
                          rows.filter((e) => e.id_usuario === row.id_usuario)[0]
                        );
                      }}
                    >
                      <TableCell className={classes.row}>
                        {row.cognito_usuario}
                      </TableCell>
                      <TableCell className={classes.row}>
                        {row.nombre_usuario}
                      </TableCell>
                      <TableCell className={classes.row}>
                        {row.desc_rol}
                      </TableCell>
                      <TableCell className={classes.row}>
                        {row.tel_oficina}
                      </TableCell>
                      <TableCell className={classes.row}>
                        {row.celular}
                      </TableCell>
                      <TableCell className={classes.row}>
                        {row.correo_electronico}
                      </TableCell>
                      <TableCell className={classes.row}>
                        {row.correo_electronico_alternativo}
                      </TableCell>
                      <TableCell className={classes.row}>
                        {row.organizacion_encuestadora}
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
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      <Fab
        aria-label="Reload"
        size="small"
        className={classes.fab}
        onClick={() => getAll()}
      >
        <Cached />
      </Fab>
      <Fab
        aria-label="Add"
        size="small"
        color="secondary"
        className={classes.fabAdd}
        onClick={() => setCreateDialog(true)}
      >
        <Add />
      </Fab>
    </div>
  );
}
