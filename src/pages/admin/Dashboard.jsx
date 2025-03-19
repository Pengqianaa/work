import React from 'react'
import { 
  Grid, 
  Paper, 
  Typography,
  Box 
} from '@mui/material'

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Welcome to Admin Panel</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard 