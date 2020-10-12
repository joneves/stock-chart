import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import MomentUtils from "@date-io/moment";
import momentPropTypes from "react-moment-proptypes";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const DATE_FORMAT = "DD/MM/yyyy";

const DatePicker = ({ label, value, onChange, minDate, maxDate }) => {
  const handleChange = (date) => {
    onChange(date);
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableFuture
          disableToolbar
          variant="inline"
          format={DATE_FORMAT}
          margin="normal"
          label={label}
          value={value}
          onChange={(date) => {
            handleChange(date);
          }}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          minDate={minDate}
          maxDate={maxDate}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

DatePicker.defaultProps = {
  value: null,
  minDate: undefined,
  maxDate: undefined,
};

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: momentPropTypes.momentObj,
  minDate: momentPropTypes.momentObj,
  maxDate: momentPropTypes.momentObj,
};

export default DatePicker;
