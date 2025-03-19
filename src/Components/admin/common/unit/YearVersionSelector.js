import { memo } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { FilterContainer } from "../StyledUnits";

const YearVersionSelector = ({ value, onChange }) => (
  <FilterContainer>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        variant="inline"
        openTo="year"
        views={["year"]}
        label={<FormattedMessage id="ADMIN.COMMON.TEXT.VERSION" />}
        value={dayjs(value)}
        onChange={onChange}
      />
    </LocalizationProvider>
  </FilterContainer>
);

YearVersionSelector.propTypes = {
  value: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default memo(YearVersionSelector);
