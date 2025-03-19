import React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box
} from '@mui/material'

const Freeware = () => {
  const rows = [
    { id: 1, name: 'Software A', status: 'Pending', submittedBy: 'User 1' },
    { id: 2, name: 'Software B', status: 'Approved', submittedBy: 'User 2' },
    { id: 3, name: 'Software C', status: 'Rejected', submittedBy: 'User 3' },
  ]

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Freeware Review
        </Typography>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.submittedBy}</TableCell>
                <TableCell>
                  <Button size="small" variant="contained" sx={{ mr: 1 }}>
                    Approve
                  </Button>
                  <Button size="small" variant="outlined" color="error">
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Freeware 