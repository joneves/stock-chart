import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import moment from "moment";
import momentPropTypes from "react-moment-proptypes";

const getMaxY = (data) =>
  Object.keys(data).reduce(
    (maxValue, symbol) =>
      Math.max(
        (Math.max(...data[symbol].h) - data[symbol].h[0]) / data[symbol].h[0],
        maxValue,
      ),
    0,
  ) + 0.1;

const getMinY = (data) =>
  Object.keys(data).reduce((minValue, symbol) => {
    const x = Math.min(
      (Math.min(...data[symbol].l) - data[symbol].l[0]) / data[symbol].l[0],
      minValue,
    );

    return x;
  }, data[Object.keys(data)[0]].l[0]);

const transformData = (data, type) => {
  if (!data) return null;

  const axisData = data.t;
  const chartData = axisData.map((item, index) => ({
    [type]: (data[type][index] - data[type][0]) / data[type][0],
    day: moment.unix(item).utc(),
  }));

  return chartData;
};

const HEIGHT = 400;
const WIDTH = 1100;
const MARGIN = 70;

const COLORS = ["steelblue", "gold", "firebrick"];

const Chart = ({ startDate, endDate, data, type }) => {
  const container = useRef(null);

  useEffect(() => {
    const svg = d3.select(container.current);
    const yMin = getMinY(data);
    const yMax = getMaxY(data);
    svg.selectAll("g, path").remove();

    const xScale = d3
      .scaleTime()
      .domain([startDate, endDate])
      .range([MARGIN, WIDTH - 2 * MARGIN]);
    svg
      .append("g")
      .attr("id", "xAxis")
      .attr("transform", `translate(0, ${HEIGHT - 2 * MARGIN})`)
      .call(d3.axisBottom(xScale));

    const yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([HEIGHT - MARGIN - MARGIN, 0]);

    svg
      .append("g")
      .attr("id", "yAxis")
      .attr("transform", `translate(${MARGIN}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat((d) => `${(d * 100).toFixed(0)}%`));

    if (Object.keys(data).length === 1) {
      const yScaleRight = d3
        .scaleLinear()
        .domain([
          Math.min(...data[Object.keys(data)[0]].l),
          Math.max(...data[Object.keys(data)[0]].h),
        ])
        .range([HEIGHT - MARGIN - MARGIN, 0]);

      svg
        .append("g")
        .attr("id", "yAxis")
        .attr("transform", `translate(${WIDTH - 2 * MARGIN}, 0)`)
        .call(d3.axisRight(yScaleRight));
    }

    const line = d3
      .line()
      .x((d) => xScale(d.day))
      .y((d) => yScale(d[type]));

    Object.values(data).forEach((item, index) =>
      svg
        .append("path")
        .data([transformData(item, type)])
        .style("fill", "none")
        .attr("id", "priceChart")
        .attr("stroke", COLORS[index])
        .attr("stroke-width", "1.5")
        .attr("d", line),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, type]);

  useEffect(() => {
    const svg = d3.select(container.current);
    // svg.selectAll("circle, text").remove();
    svg
      .selectAll("dots")
      .data(Object.entries(data))
      .enter()
      .append("circle")
      .attr("cx", 1020)
      .attr("cy", (d, i) => {
        return 20 + i * 25;
      })
      .attr("r", 7)
      .style("fill", (d, i) => {
        return COLORS[i];
      });

    svg
      .selectAll("labels")
      .data(Object.keys(data))
      .enter()
      .append("text")
      .attr("x", 1035)
      .attr("y", (d, i) => {
        return 20 + i * 25;
      })
      .style("fill", (d, i) => {
        return COLORS[i];
      })
      .text((d) => {
        return d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  }, [data]);

  return (
    <div style={{ margin: 50, backgroundColor: "transparent" }}>
      <svg ref={container} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

Chart.propTypes = {
  startDate: momentPropTypes.momentObj.isRequired,
  endDate: momentPropTypes.momentObj.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.shape(PropTypes.any.isRequired).isRequired,
};

export default Chart;
