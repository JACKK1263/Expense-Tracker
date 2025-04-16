import React from "react";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";

const ExpenseCharts = ({ transactions }) => {
  
  const lineChartData = transactions
  .map((tx) => ({
    date: moment(tx.date).format("YYYY-MM-DD"),
    amount: tx.amount,
  }))
  .sort((a, b) => new Date(a.date) - new Date(b.date));

  const tagTotals = transactions.reduce((acc, tx) => {
    acc[tx.tag] = (acc[tx.tag] || 0) + tx.amount;
    return acc;
  }, {});

  const pieChartData = Object.keys(tagTotals).map((tag) => ({
    category: tag,
    value: tagTotals[tag],
  }));

  const lineConfig = {
    data: lineChartData,
    xField: "date",
    yField: "amount",
    seriesField: "type", 
    smooth: true,
    point: {
      size: 5,
      shape: "circle",
    },
    xAxis: {
      title: { text: "Date & Time" },
      type: "timeCat",
    },
    yAxis: { title: { text: "Amount (₹)" } },
    color: (datum) => (datum.type === "income" ? "green" : "red"),
  };
  
  const pieConfig = {
    data: pieChartData,
    angleField: "value",
    colorField: "category",
    label: false,
    radius: 0.9,
    legend: { position: "right" },
    interactions: [{ type: "element-active" }],
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
      <div style={{ width: "50%" }}>
        <h2>Income Over Time</h2>
        <Line {...lineConfig} />
      </div>
      <div style={{ width: "40%" }}>
        <h2> Breakdown by Category</h2>
        <Pie {...pieConfig} />
      </div>
    </div>
  );
};

export default ExpenseCharts;
