import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Grid,
  MenuItem,
} from '@material-ui/core';
import * as rax from 'retry-axios';
import axios from 'axios';
import moment from 'moment';
const interceptorId = rax.attach();

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
const required = [
  'id_cat_rol',
  'nombre_usuario',
  'desc_rol',
  //'tel_oficina',
  //'celular',
  'correo_electronico',
  //'correo_electronico_alternativo',
  'organizacion_encuestadora',
  'cognito_usuario',
];

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ToolbarTop(props) {
  const [tempUser, setTempUser] = React.useState({});
  const [tempUserError, setTempUserError] = React.useState([]);
  const classes = useStyles();

  function checkMissing(user) {
    let _temp = [];
    for (let i of required) {
      if (!user.hasOwnProperty(i)) {
        _temp.push(i);
      } else {
        if (user[i] === '') {
          _temp.push(i);
        }
      }
    }
    return _temp;
  }
  return (
    <Dialog
      open={props.createDialog}
      fullWidth={true}
      maxWidth="md"
      onClose={() => {
        props.setCreateDialog(false);
      }}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle
        id="form-dialog-title"
        onClose={() => {
          props.setCreateDialog(false);
        }}
      >
        Create New User
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>Update the following fields.</DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth={true}
              error={tempUserError.includes('nombre_usuario')}
              value={tempUser?.nombre_usuario}
              onChange={(e) => {
                setTempUser({
                  ...tempUser,
                  ...{ nombre_usuario: e.target.value },
                });
              }}
              label="Nombre"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth={true}
              error={tempUserError.includes('organizacion_encuestadora')}
              value={tempUser?.organizacion_encuestadora}
              onChange={(e) => {
                setTempUser({
                  ...tempUser,
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
              error={tempUserError.includes('id_cat_rol')}
              label="Rol"
              value={tempUser?.id_cat_rol}
              onChange={(e) => {
                setTempUser({
                  ...tempUser,
                  ...{
                    id_cat_rol: e.target.value,
                    desc_rol: roles.filter((f) => f.value === e.target.value)[0]
                      .label,
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
              error={tempUserError.includes('correo_electronico')}
              value={tempUser?.correo_electronico}
              type="email"
              onChange={(e) => {
                setTempUser({
                  ...tempUser,
                  ...{ correo_electronico: e.target.value },
                });
              }}
              label="Email"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth={true}
              error={tempUserError.includes('correo_electronico_alternativo')}
              value={tempUser?.correo_electronico_alternativo}
              type="email"
              onChange={(e) => {
                setTempUser({
                  ...tempUser,
                  ...{ correo_electronico_alternativo: e.target.value },
                });
              }}
              label="Email Alternativo"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth={true}
              error={tempUserError.includes('tel_oficina')}
              value={tempUser?.tel_oficina}
              type="tel"
              onChange={(e) => {
                setTempUser({
                  ...tempUser,
                  ...{ tel_oficina: e.target.value },
                });
              }}
              label="Phone"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth={true}
              error={tempUserError.includes('celular')}
              value={tempUser?.celular}
              type="tel"
              onChange={(e) => {
                setTempUser({
                  ...tempUser,
                  ...{ celular: e.target.value },
                });
              }}
              label="Mobile"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth={true}
              error={tempUserError.includes('cognito_usuario')}
              onChange={(e) => {
                setTempUser({
                  ...tempUser,
                  ...{ cognito_usuario: e.target.value },
                });
              }}
              value={setTempUser?.cognito_usuario}
              label="Usuario"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.setCreateDialog(false);
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            console.log('Create User');
            const _missing = checkMissing(tempUser);
            props.setSnackbarOpen(true);

            setTempUserError(_missing);
            if (_missing.length > 0) {
              props.setSnackbarMessage('Missing Form Fields');
            } else {
              props.setSnackbarMessage('Creating User');
              let payload = {
                event: 'create-user',
                Cognito: {
                  Username: tempUser?.cognito_usuario,
                  TemporaryPassword: 'P@ssword123',
                  DesiredDeliveryMediums: ['EMAIL'],
                  ForceAliasCreation: true,
                  UserAttributes: [],
                },
                SQL: {
                  ...tempUser,
                  ...{
                    fecha_alta: moment.utc().format(),
                    fecha_modificacion: moment.utc().format(),
                  },
                },
              };
              console.log(payload);
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
                  props.setSnackbarOpen(true);
                  props.setSnackbarMessage('User Added to DB');
                  props.setCreateDialog(false);
                  console.log(res.data);
                  return res.data;
                })
                .catch((err) => {
                  console.log(err);
                  props.setCreateDialog(false);
                  props.setSnackbarMessage('Error From Server');
                  return [];
                });
            }
          }}
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
