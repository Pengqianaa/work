import React from 'react'
import { Typography, Paper, Grid } from '@mui/material'

const Landing = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h4">Welcome to Admin Dashboard</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Landing 