import React from 'react'
import { Typography, Grid, Paper } from '@mui/material'

const Home = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h4">Welcome to SAM</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Home 