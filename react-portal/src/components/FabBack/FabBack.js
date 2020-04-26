import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
//STORE
import { store } from '../../store.js';
//COMPONENTS
const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

FabBack.propTypes = {
  name: PropTypes.string,
  page: PropTypes.string,
  color: PropTypes.string,
};
FabBack.defaultProps = {
  name: 'Back',
  page: 'main',
  color: 'secondary',
};

export default function FabBack(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch } = globalState;

  return (
    <Fab
      variant="extended"
      color={props.color}
      aria-label={props.name}
      className={classes.fab}
      onClick={() => {
        dispatch({
          type: 'set-page',
          value: props.page,
        });
      }}
    >
      {props.name}
    </Fab>
  );
}
