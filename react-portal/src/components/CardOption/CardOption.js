import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from '@material-ui/core';
import { store } from '../../store.js';

const useStyles = makeStyles((theme) => ({
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
CardOption.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  page: PropTypes.string,
  children: PropTypes.object,
  class: PropTypes.string,
};
CardOption.defaultProps = {
  title: 'Title',
  subtitle: 'Subtitle',
  page: 'main',
  children: {},
  class: '',
};
export default function CardOption(props) {
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch } = globalState;
  return (
    <Card className={classes.cardRoot}>
      <CardActionArea
        onClick={() => {
          dispatch({
            type: 'set-page',
            value: props.page,
          });
        }}
      >
        <CardMedia
          className={props.class}
          children={props.children}
          title={props.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="h2" color="primary">
            {props.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            {props.subtitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
