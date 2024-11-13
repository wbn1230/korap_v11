import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

const RiskChart = ({ data, options }) => {
  const ref = useRef(null);

  useEffect(() => {
    let newChart;
    if (ref.current && data) {
      newChart = new Chart(ref.current, {
        type: "bar",
        data: data,
        options: options,
      });
      setTimeout(() => {
        if (newChart) {
          // const xScale = newChart.scales.x;
          // newChart.resetZoom();
          // newChart.zoomScale("x", 3);
          // console.log(newChart.getZoomLevel());
          // newChart.zoom(1.2, { x: (xScale.min + xScale.max) / 2 });
        }
      }, 100);
    }
    return () => {
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [data, options]);

  return <canvas className="riskchart" ref={ref}></canvas>;
};

export default RiskChart;
