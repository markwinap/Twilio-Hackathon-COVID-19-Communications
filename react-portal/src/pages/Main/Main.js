import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, Container } from '@material-ui/core';
//COMPONENTS
import ToolbarTop from '../../components/ToolbarTop';
import HeroMessage from '../../components/HeroMessage';
import GridOptions from '../../components/GridOptions';
import FabBack from '../../components/FabBack';
//Pages
import Register from '../../pages/Register';
import Patient from '../../pages/Patient';
//Store
import { store } from '../../store.js';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
    padding: theme.spacing(3),
  },
}));

export default function Main() {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <ToolbarTop title="COVID-19 Communications" />

      <Container maxWidth="xl">
        <br />
        <br />
        <br />
        <br />
        <br />

        {state.page === 'main' ? (
          <>
            <HeroMessage
              title="Online Tools"
              subtitle="Tools for registering new patients and their family members"
            />
            <br />
            <br />
            <GridOptions />
          </>
        ) : null}
        {state.page === 'register' ? (
          <>
            <Container>
              <Register />
            </Container>
          </>
        ) : null}
        {state.page === 'patient' ? (
          <>
            <Container>
              <Patient />
            </Container>
          </>
        ) : null}
      </Container>
      {state.page !== 'main' ? <FabBack /> : null}
    </div>
  );
}
