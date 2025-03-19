import React, { useState } from "react";
import { styled as styledMui } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";
import { FilterContainer } from "../AdminCommonUis";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styled from "styled-components";
// styles
// import styled from "styled-components";
const PREFIX = "AvailabilityCheckboxGroup";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledFilterContainer = styledMui(FilterContainer)({
  [`&.${classes.root}`]: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
  },
});

// 升级UI包，先注解
const CheckboxLabel = styled.span`
  padding-right: 15px;
  font-size: 18px;
`;

const CHECKBOX_LABEL = [
  "softwareinfomgt.availableY",
  "softwareinfomgt.availableN",
];

export default function AvailabilityCheckboxGroup({ onCheck }) {
  const [availability, setAvailability] = useState([true, false]);

  const onChange = (event, index) => {
    const { checked } = event.target;
    setAvailability((prev) => {
      prev[index] = checked;
      return prev;
    });
    const available = availability[0];
    const unavailable = availability[1];
    // NOTE: if {available} and {unavailable} both are the same value (both are either true or false), return null
    const finalResult =
      (available && unavailable) || (!available && !unavailable)
        ? null
        : available;
    onCheck(finalResult);
  };

  return (
    <StyledFilterContainer className={classes.root}>
      <CheckboxLabel>
        <FormattedMessage id="softwareinfomgt.isAvailable" />
      </CheckboxLabel>
      <FormGroup row style={{marginTop:10}}>
        {CHECKBOX_LABEL.map((label, index) => (
          <FormControlLabel
            key={label}
            label={<FormattedMessage id={label} />}
            className={classes.root}
            control={
              <Checkbox
                color="primary"
                style={{ alignItems: "baseline" }}
                checked={availability[index]}
                onChange={(e) => onChange(e, index)}
              />
            }
          />
        ))}
      </FormGroup>
    </StyledFilterContainer>
  );
}
