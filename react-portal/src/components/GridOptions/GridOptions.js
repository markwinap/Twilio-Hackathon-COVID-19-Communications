import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
//STORE
import { store } from '../../store.js';
//ICONS
import Patient from '../../icons/Patient';
import Registry from '../../icons/Registry';
//COMPONENTS
import CardOption from '../../components/CardOption';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
}));
GridOptions.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  page: PropTypes.string,
  image: PropTypes.object,
};
GridOptions.defaultProps = {
  title: 'Title',
  subtitle: 'Subtitle',
  page: 'main',
  image: {},
};
export default function GridOptions(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch } = globalState;
  return (
    <div className={classes.root}>
      <Grid
        spacing={6}
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={10} sm={6} md={3}>
          <CardOption
            title="Patient"
            subtitle="View or update existing patient details"
            page="patient"
            class={classes.media}
            children={<Patient />}
          />
        </Grid>
        <Grid item xs={10} sm={6} md={3}>
          <CardOption
            title="Register"
            subtitle="Register new patients and family members"
            page="register"
            class={classes.mediab}
            children={<Registry />}
          />
        </Grid>
      </Grid>
    </div>
  );
}
