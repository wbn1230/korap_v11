import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import useInfo from "../hooks/use-info";

const RiskProfile = ({
  data,
  rawData,
  options,
  highlightNode,
  followMap,
  type,
}) => {
  const ref = useRef(null);
  const { hoveredIndex, selectedDM } = useInfo();
  const [allowHover, setAllowHover] = useState(true);
  const nodeIdtoIndexMap = rawData.reduce((acc, node, index) => {
    acc[node.properties.fromnodeid] = index;
    return acc;
  }, {});

  useEffect(() => {
    if (ref.current && data) {
      const newChart = new Chart(ref.current, {
        type: "line",
        data: data,
        options: {
          ...options,
          animation: {
            duration: 0,
          },

          // zoom in to clicked point on map
          onClick: (event, element, chart) => {
            if (element.length > 0) {
              const index = element[0].index;
              followMap(index);
            }

            // 지점 선택 후 지도로 마우스 이동하는동안 불필요한 hover 해제
            setAllowHover(false);
            setTimeout(() => {
              setAllowHover(true);
            }, 3000);
          },

          // display line & move dynamic map pointer
          onHover: (event, element, chart) => {
            if (!allowHover) return;

            const ctx = chart.ctx;

            if (element.length > 0) {
              const index = element[0].index;
              const x = element[0].element.x;

              highlightNode(index);
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(x, 20);
              ctx.lineTo(x, chart.chartArea.bottom);
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = "#000000";
              ctx.stroke();
              ctx.restore();
            }
          },
        },
      });

      // display line on map click
      const getX = (chart, index) => {
        const meta = chart.getDatasetMeta(0);
        const element = meta.data[index];
        return element ? element.x : null;
      };

      const drawLine = (chart, x) => {
        const ctx = chart.ctx;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, chart.chartArea.bottom);
        ctx.lineWidth = 3.0;
        ctx.strokeStyle = "#00000088";
        ctx.stroke();
        ctx.restore();
      };

      const nodeIndex = nodeIdtoIndexMap[hoveredIndex];
      const xCoord = getX(newChart, nodeIndex);
      if (xCoord) drawLine(newChart, xCoord);

      // custom checkbox for legend
      const checkbox = () => {
        const legend = document.getElementById("legend");
        legend.innerHTML = "";
        newChart.data.datasets.forEach((dataset, index) => {
          if (type === "intersection" && index === 1) return;
          const wrapper = document.createElement("div");
          wrapper.className = `checkbox-wrapper checkbox-wrapper-${index}`;

          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = dataset.label;
          checkbox.value = index;
          checkbox.id = `dataset${index}`;
          if (index === 1 || index === 5) {
            checkbox.checked = false;
          } else checkbox.checked = true;

          let label = document.createElement("label");
          label.htmlFor = `dataset${index}`;
          label.appendChild(document.createTextNode(dataset.label));

          wrapper.appendChild(checkbox);
          wrapper.appendChild(label);
          legend.appendChild(wrapper);

          checkbox.addEventListener("change", (e) => {
            handleCheckboxEffect(e, newChart);
          });
        });
      };

      const handleCheckboxEffect = (e, chart) => {
        const index = e.target.value;
        if (chart.isDatasetVisible(index)) {
          chart.hide(index);
        } else {
          chart.show(index);
        }
      };

      checkbox();

      return () => {
        newChart.destroy();
      };
    }
    // eslint-disable-next-line
  }, [data, options, hoveredIndex, allowHover, selectedDM]);

  return <canvas className={`riskprofile`} ref={ref}></canvas>;
};

export default RiskProfile;
