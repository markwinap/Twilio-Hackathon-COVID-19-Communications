import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

HeroMessage.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
HeroMessage.defaultProps = {
  title: 'Title',
  subtitle: 'Subtitle',
};
export default function HeroMessage(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={3}
        alignItems="center"
        direction="column"
        justify="space-evenly"
      >
        <Grid item xs={12}>
          <Typography
            variant="h3"
            component="h3"
            align="center"
            gutterBottom
            color="primary"
          >
            {props.title}
          </Typography>
        </Grid>
        <Grid item xs={10} sm={10} md={6}>
          <Typography variant="body1" align="center" gutterBottom>
            {props.subtitle}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
