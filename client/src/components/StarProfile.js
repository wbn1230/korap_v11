import React, { useRef, useEffect, useMemo } from "react";
import { FlyToInterpolator } from "deck.gl";
import Chart from "chart.js/auto";
import useInfo from "../hooks/use-info";

const StarProfile = ({ setSelectedDM }) => {
  const ref = useRef(null);
  const { data, selectedRoad, showProfile, setView } = useInfo();

  const horizontalRoads = [
    "0",
    "2",
    "4",
    "6",
    "18",
    "20",
    "24",
    "26",
    "30",
    "32",
    "34",
    "36",
    "38",
    "42",
    "44",
    "45",
    "46",
    "48",
    "56",
    "82",
    "88",
  ]; //가로 방향성
  const verticalRoads = [
    "1",
    "3",
    "5",
    "7",
    "13",
    "14",
    "15",
    "17",
    "19",
    "21",
    "22",
    "23",
    "25",
    "27",
    "28",
    "29",
    "31",
    "33",
    "35",
    "37",
    "39",
    "40", // NA
    "43",
    "47",
    "58",
    "59",
    "67",
    "75",
    "77", // NA
    "79", // NA
    "87",
  ]; //세로 방향성

  const laneF = (code) => {
    switch (code) {
      case "1":
        return "1 차선";
      case "2":
        return "2 차선";
      case "3":
        return "4 차선";
      case "4":
        return "5-8 차선";
      case "5":
        return "9 차선 이상";
      default:
        return "N/A";
    }
  };

  const facilF = (code) => {
    switch (code) {
      case "0":
        return "일반도로";
      case "1":
        return "교량";
      case "2":
        return "터널";
      case "4":
        return "고가도로";
      case "8":
        return "지하도로";
      default:
        return "N/A";
    }
  };

  const speedF = (code) => {
    switch (code) {
      case null:
        return "결측";
      case 0:
        return "결측";
      case 20:
        return "20";
      case 30:
        return "30";
      case 40:
        return "40";
      case 50:
        return "50";
      case 60:
        return "60";
      case 70:
        return "70";
      case 80:
        return "80";
      case 90:
        return "90이상";
      case 100:
        return "90이상";
      case 110:
        return "90이상";
      default:
        return "N/A";
    }
  };

  const caronlyF = (code) => {
    switch (code) {
      case "0":
        return "비해당";
      case "1":
        return "해당";
      case null:
        return "결측";
      default:
        return "N/A";
    }
  };

  const onewayF = (code) => {
    switch (code) {
      case "0":
        return "비해당";
      case "1":
        return "해당";
      default:
        return "N/A";
    }
  };

  const getDistance = (pointA, pointB) => {
    const [x1, y1] = pointA;
    const [x2, y2] = pointB;
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  };

  const findSmallestXCoordinate = (coordinates) => {
    return coordinates.reduce((min, coord) => {
      if (coord[0] < min[0] || (coord[0] === min[0] && coord[1] < min[1])) {
        return coord;
      }
      return min;
    });
  };

  const findLargestXCoordinate = (coordinates) => {
    return coordinates.reduce((max, coord) => {
      if (coord[0] > max[0] || (coord[0] === max[0] && coord[1] > max[1])) {
        return coord;
      }
      return max;
    });
  };

  const findSmallestYCoordinate = (coordinates) => {
    return coordinates.reduce((min, coord) => {
      if (coord[1] < min[1] || (coord[1] === min[1] && coord[0] < min[0])) {
        return coord;
      }
      return min;
    });
  };

  const findLargestYCoordinate = (coordinates) => {
    return coordinates.reduce((min, coord) => {
      if (coord[1] > min[1] || (coord[1] === min[1] && coord[0] > min[0])) {
        return coord;
      }
      return min;
    });
  };

  const sortRoadData = (rawData, roadno, flag) => {
    const coordinates = rawData.map((road) => road.geometry.coordinates[0][0]);

    let startPoint, endPoint;
    if (flag === 1) {
      startPoint = findSmallestXCoordinate(coordinates);
      endPoint = findLargestXCoordinate(coordinates);
    } else {
      startPoint = findSmallestYCoordinate(coordinates);
      if (roadno === 29) endPoint = findSmallestXCoordinate(coordinates);
      else endPoint = findLargestYCoordinate(coordinates);
    }

    const sortedCoordinates = [startPoint];
    const remainingCoordinates = coordinates.filter(
      (coord) => coord !== startPoint
    );

    while (remainingCoordinates.length > 0) {
      const lastPoint = sortedCoordinates[sortedCoordinates.length - 1];
      let closestIndex = 0;
      let closestDistance = getDistance(lastPoint, remainingCoordinates[0]);

      for (let i = 1; i < remainingCoordinates.length; i++) {
        const distance = getDistance(lastPoint, remainingCoordinates[i]);
        if (distance < closestDistance) {
          closestIndex = i;
          closestDistance = distance;
        }
      }

      sortedCoordinates.push(remainingCoordinates.splice(closestIndex, 1)[0]);
    }

    const endIndex = sortedCoordinates.findIndex(
      (coord) => coord[0] === endPoint[0] && coord[1] === endPoint[1]
    );

    const validSortedCoordinates = sortedCoordinates.slice(0, endIndex + 1);

    const sortedData = validSortedCoordinates.map((coord) => {
      return rawData.find(
        (road) =>
          road.geometry.coordinates[0][0][0] === coord[0] &&
          road.geometry.coordinates[0][0][1] === coord[1]
      );
    });

    return sortedData;
  };

  // Data initialization
  const { sRoadData, starDataPoints, xlabels } = useMemo(() => {
    let sRoadData = [];
    let lengthSum = 0;

    if (!data || !showProfile || !selectedRoad) {
      return {
        sRoadData: [],
        starDataPoints: [],
        xlabels: [],
      };
    }

    const rawData = data.nroad.features.filter(
      (feature) => feature.properties.road_no === selectedRoad
    );

    if (horizontalRoads.includes(selectedRoad)) {
      sRoadData = sortRoadData(rawData, parseInt(selectedRoad, 10), 1);
    } else if (verticalRoads.includes(selectedRoad)) {
      sRoadData = sortRoadData(rawData, parseInt(selectedRoad, 10), 2);
    }

    if (!sRoadData) {
      return {
        sRoadData: [],
        starDataPoints: [],
        xlabels: [],
      };
    }

    const starDataPoints = sRoadData.map(
      (feature) => feature.properties.star_rating
    );

    const lengths = sRoadData.map((feature) => feature.properties.length);
    const xlabels = lengths.map((length) => {
      lengthSum += length;
      return (lengthSum / 1000).toFixed(1);
    });

    return {
      sRoadData,
      starDataPoints,
      xlabels,
    };
    //eslint-disable-next-line
  }, [data, selectedRoad]);

  // map interactive functions
  const followMap = (index) => {
    if (!sRoadData) return;

    const node = sRoadData[index];
    setSelectedDM(node.properties.uid);
    const pointer = node.geometry;

    if (pointer) {
      setView((prev) => ({
        longitude: pointer.coordinates[0][0][0],
        latitude: pointer.coordinates[0][0][1] - 0.005,
        zoom: 15,
        maxZoom: 17.45,
        minZoom: 5.5,
        pitch: prev.pitch,
        bearing: prev.bearing,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
      }));
    }
  };

  const sRoadDatasets = [
    {
      label: `별점평가 점수`,
      data: starDataPoints,
      borderColor: "rgba(100, 149, 237, 0.8)",
      borderWidth: 1,
      pointRadius: 0.1,
      fill: {
        target: "origin",
        above: "rgba(100, 149, 237, 0.2)", // Area will be red above the origin
      },
      tension: 0,
      stepped: "before",
      yAxisID: "y1",
    },
  ];

  const profdata = useMemo(
    () => ({
      labels: xlabels,
      datasets: sRoadDatasets,
    }),
    //eslint-disable-next-line
    [xlabels, sRoadData]
  );

  const profoptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: "transparent",
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "거리 (km)",
            font: {
              size: 13,
              family: "NanumSquare, sans-serif",
            },
          },
          ticks: {
            maxTicksLimit: 15,
          },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          title: {
            display: true,
            padding: 0,
            text: "별점평가 점수",
            font: {
              size: 14,
              family: "NanumSquare, sans-serif",
            },
          },
          // ticks: {
          //   stepSize: 1,
          // },
          grid: {
            color: "#00000030",
          },
        },
        y2: {
          beginAtZero: true,
          position: "left",
          ticks: {
            display: false,
          },
        },
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
            // zoom limits 적용이 안되는듯
            limits: {
              x: { min: 0, max: 2 },
              y1: { min: 0, max: 2 },
            },
          },
          pan: {
            enabled: true,
            mode: "x",
          },
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            pointStyle: "line",
          },
          onHover: function (event, legendItem, legend) {
            event.native.target.style.cursor = "pointer";
          },
          onLeave: function (event, legendItem, legend) {
            event.native.target.style.cursor = "";
          },
        },
        tooltip: {
          backgroundColor: "rgba(242, 242, 242, 0.8)",
          borderColor: "#36546C",
          borderWidth: 1,
          cornerRadius: 3,
          padding: 10,
          position: "nearest",
          titleFont: {
            size: 15,
            weight: "bold",
            color: "red",
          },
          bodyFont: {
            size: 14,
            weight: 500,
          },
          caretPadding: 10,
          bodyColor: "black",
          displayColors: false,
          bodySpacing: 5,
          footerColor: "white",
          callbacks: {
            label: function () {
              return null;
            },
            title: function () {
              return null;
            },
            afterBody: function (tooltipItem) {
              const index = tooltipItem[0].dataIndex;
              const feature = sRoadData[index];

              if (feature && feature.properties) {
                const props = feature.properties;
                return [
                  `차로수: ${laneF(props.width) || "N/A"}`,
                  `교통시설물: ${facilF(props.facil_kind) || "N/A"}`,
                  `제한속도: ${speedF(parseInt(props.max_spd, 10)) || "N/A"}`,
                  `자동차전용도로유무: ${caronlyF(props.auto_exclu) || "N/A"}`,
                  `일방통행유무: ${onewayF(props.oneway) || "N/A"}`,
                ].join("\n");
              }
            },
          },
        },
      },
    }),
    [sRoadData]
  );

  useEffect(() => {
    if (ref.current && data) {
      const newChart = new Chart(ref.current, {
        type: "line",
        data: profdata,
        options: {
          ...profoptions,
          animation: {
            duration: 0,
          },

          // zoom in to clicked point on map
          onClick: (event, element, chart) => {
            if (element.length > 0) {
              const index = element[0].index;
              followMap(index);
            }
          },

          // display line
          onHover: (event, element, chart) => {
            const ctx = chart.ctx;

            if (element.length > 0) {
              // const index = element[0].index;
              const x = element[0].element.x;

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

      // // display line on map click
      // const getX = (chart, index) => {
      //   const meta = chart.getDatasetMeta(0);
      //   const element = meta.data[index];
      //   return element ? element.x : null;
      // };

      // const drawLine = (chart, x) => {
      //   const ctx = chart.ctx;

      //   ctx.save();
      //   ctx.beginPath();
      //   ctx.moveTo(x, 20);
      //   ctx.lineTo(x, chart.chartArea.bottom);
      //   ctx.lineWidth = 3.0;
      //   ctx.strokeStyle = "#00000088";
      //   ctx.stroke();
      //   ctx.restore();
      // };

      // const nodeIndex = nodeIdtoIndexMap[hoveredIndex];
      // const xCoord = getX(newChart, nodeIndex);
      // if (xCoord) drawLine(newChart, xCoord);

      // custom checkbox for legend
      const checkbox = () => {
        const legend = document.getElementById("legend");
        legend.innerHTML = "";
        newChart.data.datasets.forEach((dataset, index) => {
          const wrapper = document.createElement("div");
          wrapper.className = `sp-checkbox-wrapper sp-checkbox-wrapper-${index}`;

          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = dataset.label;
          checkbox.value = index;
          checkbox.id = `dataset${index}`;
          checkbox.checked = true;

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
  }, [profdata, profoptions]);

  return <canvas className={`starprofile`} ref={ref}></canvas>;
};

export default StarProfile;
