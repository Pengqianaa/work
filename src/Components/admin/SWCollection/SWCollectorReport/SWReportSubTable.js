import React from "react";
import { TableContainer, TableBody , Table ,TableHead , TableRow, TableCell, Paper } 
from "@mui/material";
import { SWCollectionReportSubCols } from "src/constants/admin/SWCollection";


const SWReportSubTable = props => {
  const { detailList } = props
 
  const subColumns = [...SWCollectionReportSubCols]

  return (<React.Fragment>
     <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell key={0}>No</TableCell>
            {subColumns.map(column => {
              return <TableCell key={column.id}>
                        {column.label}
                </TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {detailList.map((result, index) => {
            let css = {}
            if(index%2===0){
              css = {background:'#EFEFEF'}
            }
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
              <TableCell key={index} style={css}>{index+1}</TableCell>
                {subColumns.map((column) => {
                  let value = result[column.id]
                  return (
                    <TableCell key={column.id} style={css}>
                      {column.viewCallback(value)}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </React.Fragment>)
}

export default SWReportSubTable;