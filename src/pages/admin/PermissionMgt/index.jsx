import React, { useState, useEffect } from 'react'
import { Box, Container, Paper } from '@mui/material'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip
} from '@mui/material'
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from 'react-i18next'

const PermissionManagement = () => {
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortDirection, setSortDirection] = useState('asc')
  const [sortBy, setSortBy] = useState('account')

  return (
      <Container>
        <Box sx={{ mb: 3 }}>
          <h1>{t('permission.title')}</h1>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('common.actions')}</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'account'}
                    direction={sortDirection}
                    onClick={() => handleSort('account')}
                  >
                    {t('permission.account')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>{t('permission.userName')}</TableCell>
                <TableCell>{t('permission.roles')}</TableCell>
                <TableCell>{t('permission.remark')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <EditIcon 
                      sx={{ cursor: 'pointer', mr: 1 }}
                      onClick={() => handleEdit(row)}
                    />
                    <DeleteIcon
                      sx={{ cursor: 'pointer', color: 'error.main' }}
                      onClick={() => handleDelete(row)}
                    />
                  </TableCell>
                  <TableCell>{row.account}</TableCell>
                  <TableCell>{row.userName}</TableCell>
                  <TableCell>
                    {row.roles.map(role => (
                      <Chip 
                        key={role.id}
                        label={role.name}
                        size="small"
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{row.remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  )
}

export default PermissionManagement