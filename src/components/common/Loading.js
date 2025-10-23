import React from 'react';
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  content: {
    paddingTop: 150,
    textAlign: 'center',
  },
}));

const Loading = () => {
  const { root, content } = useStyles();

  return (
    <div className={root}>
      <Grid container justifyContent="center" spacing={4}>
        <Grid item lg={6} xs={12}>
          <div className={content}>
            <CircularProgress size={100} />
            <Typography variant="h5">Loading ...</Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Loading;
