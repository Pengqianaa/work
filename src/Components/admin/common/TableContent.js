import React from "react";
import { TableContainer, Paper } from "@mui/material";
import {
  FilterContainer,
  FilterGroup,
  TableHeadContainer,
} from "./StyledUnits";
import styled from "styled-components";

const ContentContainer = styled(TableContainer)`
  width: 100%;

  .filter-group,
  .filter-container {
    width: 100%;
  }

  .filter-container {
    margin-right: 0 !important;
  }
`;

const TableContent = ({ children }) => (
  <ContentContainer component={Paper}>
    <TableHeadContainer>
      <FilterGroup className="filter-group">
        <FilterContainer className="filter-container">
          {children}
        </FilterContainer>
      </FilterGroup>
    </TableHeadContainer>
  </ContentContainer>
);

export default React.memo(TableContent);
