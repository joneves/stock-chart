import React, { useEffect, useState } from "react";
import DatePicker from "components/DatePicker/DatePicker";
import { Button, Grid } from "@material-ui/core";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import SYMBOL_WHITE_LIST from "constants/symbols";
import TYPES from "constants/types";
import { getSymbols, getPrices } from "services/finnhub";
import Chart from "../components/Chart/Chart";

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      margin: "1.6em",
      minWidth: 120,
    },
  }),
);

const useValidate = (symbol, startDate, endDate) => {
  const errors = {};
  if (symbol.length === 0) {
    errors.symbol = "Please select 1 - 3 Symbols";
  }
  if (!moment(startDate, "YYYY-MM-DD", true).isValid()) {
    errors.startDate = true;
  }

  if (!moment(endDate, "YYYY-MM-DD", true).isValid()) {
    errors.endDate = true;
  }

  return errors;
};

const Application = () => {
  const classes = useStyles();
  const [stocks, setStocks] = useState([]);
  const [startDate, setStartDate] = useState(moment().add(-1, "year"));
  const [endDate, setEndDate] = useState(moment());
  const [selectedStockSymbol, setSelectedStockSymbol] = useState([]);
  const [selectedType, setSelectedType] = useState(TYPES.OPEN);
  const [data, setData] = useState({});
  const errors = useValidate(selectedStockSymbol, startDate, endDate);

  useEffect(() => {
    const getData = async () => {
      const symbolsData = await getSymbols();
      setStocks(
        symbolsData.filter((s) => SYMBOL_WHITE_LIST.includes(s.symbol)),
      );
    };

    getData();
  }, []);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleStockChange = ({ target: { value } }) => {
    if (value.length <= 3) setSelectedStockSymbol(value);
  };

  const handleTypeChange = ({ target: { value } }) => {
    setSelectedType(value);
  };

  const handleGetChartData = async () => {
    const priceData = await getPrices(startDate, endDate, selectedStockSymbol);

    setData(priceData);
  };

  return (
    <div className="App">
      <Grid container>
        <Grid item md={2}>
          <FormControl className={classes.formControl}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              maxDate={moment(endDate).add(-1, "day")}
            />
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <FormControl className={classes.formControl}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              minDate={moment(startDate).add(1, "day")}
            />
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <FormControl
            className={classes.formControl}
            error={Boolean(errors.symbol)}
          >
            <InputLabel>Symbols</InputLabel>
            <Select
              style={{ minWidth: 225 }}
              multiple
              fullWidth
              value={selectedStockSymbol}
              onChange={handleStockChange}
              input={<Input />}
              renderValue={(selected = []) => (
                <div>
                  {selected.map((symbol) => (
                    <Chip
                      style={{ marginRight: 5 }}
                      key={symbol}
                      label={symbol}
                    />
                  ))}
                </div>
              )}
            >
              {stocks.map((s) => (
                <MenuItem key={`stock-${s.symbol}`} value={s.symbol}>
                  {s.description}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.symbol}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <Button
              disabled={Object.keys(errors).length > 0}
              variant="contained"
              color="primary"
              onClick={handleGetChartData}
            >
              Create Chart
            </Button>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={2}>
          <FormControl
            className={classes.formControl}
            error={Boolean(errors.type)}
          >
            <InputLabel>Type</InputLabel>
            <Select value={selectedType} onChange={handleTypeChange}>
              {Object.keys(TYPES).map((t) => (
                <MenuItem key={`type-${t}`} value={TYPES[t]}>
                  {t}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.type}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container>
        {Object.keys(data).length > 0 && (
          <Chart
            startDate={startDate}
            endDate={endDate}
            data={data}
            type={selectedType}
          />
        )}
      </Grid>
    </div>
  );
};

export default Application;
