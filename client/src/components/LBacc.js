import "./LBacc.css";
import React, { useEffect, useMemo, useState } from "react";
import { FlyToInterpolator } from "deck.gl";
import DropdownForm from "./DropdownForm";
import Accordion2 from "./Accordion2";
import "./Accordion2.css";
import RiskChart from "./RiskChart";
import RiskProfile from "./RiskProfile";
import useInfo from "../hooks/use-info";
import useFetch from "../hooks/use-fetch";
import { MdIndeterminateCheckBox, MdOutlineSsidChart } from "react-icons/md";
import { FaCar, FaWalking, FaBiking } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

function LBacc({ devMode, menuToggle, setSelectedDM }) {
  const {
    rdata,
    idata,
    pdata,
    setPdata,
    rdepth,
    pdepth,
    setRdepth,
    setIdepth,
    setPdepth,
    rcbx,
    icbx,
    setRcbx,
    setIcbx,
    acclayer1,
    acclayer2,
    setAcclayer1,
    setAcclayer2,
    userHasInteractedR,
    setUserHasInteractedR,
    userHasInteractedI,
    setUserHasInteractedI,
    isSelect,
    setIsSelect,
    selectedRoad,
    setSelectedRoad,
    setView,
    INITIAL_VIEW_STATE,
    showProfile,
    setShowProfile,
    showChart,
    setShowChart,
    setPointer,
    setHoveredIndex,
  } = useInfo();
  const { fetchRiskProfile, fetchRoadacc, fetchIntacc } = useFetch();
  const [currentRoadIndicator, setCurrentRoadIndicator] = useState(3);
  const [currentICIndicator, setCurrentICIndicator] = useState(3);
  const [selectedRoadIcon, setSelectedRoadIcon] = useState("car");
  const [selectedICIcon, setSelectedICIcon] = useState("car");
  const [selectedRPIcon, setSelectedRPIcon] = useState("car");
  const [selectedTypeButton, setSelectedTypeButton] = useState("road");
  const [selection, setSelection] = useState("");

  // 페이지 로딩 시 단일로 사고위험도 데이터 fetching - 차트 오류 방지
  useEffect(() => {
    if (!rdata) fetchRoadacc();
    // eslint-disable-next-line
  }, []);

  const handleRoadDropdownClick = (op) => {
    setCurrentRoadIndicator(op);
    setRdepth((prev) => ({
      ...prev,
      index: op,
    }));
  };
  const handleICDropdownCLick = (op) => {
    setCurrentICIndicator(op);
    setIdepth((prev) => ({
      ...prev,
      index: op,
    }));
  };
  const handleProfileIconClick = (op) => {
    setSelectedRPIcon(op);
    setPdepth(op);
    setHoveredIndex(null);
    /*     setRdepth((prev) => ({
      ...prev,
      index: 3,
    })); */
  };
  const handleTypeSelect = (op) => {
    setSelectedTypeButton(op);
    if (op === "intersection") setAcclayer2(true);
    else setAcclayer2(false);
    setHoveredIndex(null);
  };

  const resetMap = (roadNo) => {
    setPointer(null);
    if (roadNo) {
      setView({
        longitude: INITIAL_VIEW_STATE.longitude,
        latitude: INITIAL_VIEW_STATE.latitude - 1.5,
        zoom: 6.35,
        maxZoom: 17.45,
        minZoom: 5.5,
      });
    }
  };

  const rindicatorTxt = (ind) => {
    if (ind === 1) {
      return "(기본) 구간별 건 / km";
    } else if (ind === 2) {
      return "(기본) 구간별 건 / 대·km";
    } else if (ind === 3) {
      return "평균 사고 건수";
    }
  };
  const iindicatorTxt = (ind) => {
    if (ind === 1) {
      return "(기본) 구간별 건 / 차로";
    } else if (ind === 2) {
      return "(기본) 구간별 건 / 대·차로";
    } else if (ind === 3) {
      return "평균 사고 건수";
    }
  };

  const handleSelection = (options) => {
    const roadNo = options[0];

    if (!pdata[roadNo]) {
      fetchRiskProfile(roadNo);
    }
    setSelectedRoad(roadNo);
    setSelection(`국도 ${roadNo}호선 (${options[1]})`);
    setIsSelect(false);
    setPointer(null);
    resetMap(roadNo);
    setSelectedTypeButton("road");
    setAcclayer2(false);
  };

  const handleRoadIconClick = (icon) => {
    setSelectedRoadIcon(icon);
    setRdepth((prev) => ({
      ...prev,
      type: icon,
    }));
  };

  const handleICIconClick = (icon) => {
    setSelectedICIcon(icon);
    setIdepth((prev) => ({
      ...prev,
      type: icon,
    }));
  };

  const handleRCbx = (idx) => {
    if (!userHasInteractedR) {
      setRcbx(rcbx.map((_, index) => index === idx));
      setUserHasInteractedR(true);
    } else {
      setRcbx((prev) => {
        const lst = [...prev];
        lst[idx] = !lst[idx];
        return lst;
      });
    }
  };

  const handleICbx = (idx) => {
    if (!userHasInteractedI) {
      setIcbx(icbx.map((_, index) => index === idx));
      setUserHasInteractedI(true);
    } else {
      setIcbx((prev) => {
        const lst = [...prev];
        lst[idx] = !lst[idx];
        return lst;
      });
    }
  };
  /////////////////////////////////////////////////////////////////

  const roads = [
    ["1", "목포-신의주"],
    ["2", "신안-부산"],
    ["3", "남해-초산"],
    ["4", "부안-경주"],
    ["5", "통영-중강진"],
    ["6", "인천-강릉"],
    ["7", "부산-온성"],
    ["13", "완도-금산"],
    ["14", "거제-포항"],
    ["15", "고흥-남원"],
    ["17", "여수-광주"],
    ["18", "진도-구례"],
    ["19", "남해-홍천"],
    ["20", "산청-포항"],
    ["21", "남원-이천"],
    ["22", "정읍-순천"],
    ["23", "강진-천안"],
    ["24", "신안-울산"],
    ["25", "진해-청주"],
    ["26", "군산-대구"],
    ["27", "완도-군산"],
    ["28", "영주-포항"],
    ["29", "보성-서산"],
    ["30", "부안-대구"],
    ["31", "부산-신고산"],
    ["32", "태안-대전"],
    ["33", "고성-구미"],
    ["34", "당진-영덕"],
    ["35", "부산-강릉"],
    ["36", "보령-울진"],
    ["37", "거창-파주"],
    ["38", "태안-동해"],
    ["39", "부여-의정부"],
    ["40", "당진-공주"],
    ["42", "인천-동해"],
    ["43", "세종-고성"],
    ["44", "양평-양양"],
    ["45", "서산-가평"],
    ["46", "인천-고성"],
    ["47", "안산-철원"],
    ["48", "강화-서울"],
    ["56", "철원-양양"],
    ["58", "진해-청도"],
    ["59", "광양-양양"],
    ["67", "칠곡-군위"],
    ["75", "가평-화천"],
    ["77", "부산-파주"],
    ["79", "의령-창녕"],
    ["82", "평택-화성"],
    ["87", "포천-철원"],
    ["88", "영양-울진"],
  ];

  const horizontalRoads = [
    "0",
    "4",
    "18",
    "20",
    "24",
    "26",
    "32",
    "34",
    "44",
    "45",
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
    "22",
    "25",
    "29",
    "33",
    "35",
    "43",
    "47",
    "58",
    "67",
    "75",
    "87",
  ]; //세로 방향성

  const mixedRoads = [
    2, 6, 21, 23, 27, 28, 30, 31, 36, 37, 38, 39, 40, 42, 46, 59, 77, 79,
  ];

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

  /*   const barrierF = (code) => {
    switch (code) {
      case "0":
        return "분리대 없음";
      case "1":
        return "벽";
      case "2":
        return "봉";
      case "3":
        return "화단";
      case "4":
        return "안전지대";
      case "5":
        return "금속";
      case "15":
        return "기타";
      default:
        return "N/A";
    }
  }; */

  /*   const lightF = (code) => {
    switch (code) {
      case 0:
        return "0";
      case 1:
        return "1";
      case 2:
        return "2";
      case 3:
        return "3";
      case 4:
        return "4";
      case null:
        return "결측";
      default:
        return "N/A";
    }
  }; */

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

  const tralightF = (code) => {
    switch (code) {
      case "0":
        return "없음";
      case "3":
        return "3구 신호등";
      case "4":
        return "4구 신호등 이상";
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
      if (roadno === 82) endPoint = [126.915102446, 37.06859312];
      else endPoint = findLargestXCoordinate(coordinates);
    } else {
      startPoint = findSmallestYCoordinate(coordinates);
      if (roadno === 1) endPoint = [126.709367792, 37.904133147];
      if (roadno === 22) endPoint = [126.839984464, 35.580029708];
      if (roadno === 25) endPoint = [127.475968992, 36.695226535];
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

  const sortPointsManual = (
    sortedCoordinates,
    remainingCoordinates,
    points
  ) => {
    points.forEach((point) => {
      sortedCoordinates.push(point);
      const indexToRemove = remainingCoordinates.findIndex(
        (coord) => coord[0] === point[0] && coord[1] === point[1]
      );
      if (indexToRemove !== -1) {
        remainingCoordinates.splice(indexToRemove, 1);
      }
    });
  };

  // 잘못된 연결 하드코딩 :(
  const sortManual = (rawData, roadno) => {
    const coordinates = rawData.map((road) => road.geometry.coordinates[0][0]);
    let startPoint, endPoint;

    if (roadno === 2) {
      startPoint = [126.161960381, 34.668304443];
      endPoint = findLargestXCoordinate(coordinates);
    } else if (roadno === 6) {
      startPoint = [126.619832473, 37.471216904];
      endPoint = findLargestXCoordinate(coordinates);
    } else if (roadno === 21) {
      startPoint = [127.243729021, 35.444742925];
      endPoint = findLargestYCoordinate(coordinates);
    } else if (roadno === 23) {
      startPoint = [126.790336594, 34.628328164];
      endPoint = findLargestYCoordinate(coordinates);
    } else if (roadno === 27) {
      startPoint = [127.209682596, 34.432476565];
      endPoint = [126.769820451, 35.986671869];
    } else if (roadno === 28) {
      startPoint = [129.341339289, 36.087080036];
      endPoint = findLargestYCoordinate(coordinates);
    } else if (roadno === 30) {
      startPoint = [126.668324817, 35.610692505];
      endPoint = findLargestXCoordinate(coordinates);
    } else if (roadno === 31) {
      startPoint = [129.231744271, 35.274538114];
      endPoint = findLargestYCoordinate(coordinates);
    } else if (roadno === 36) {
      startPoint = [126.509986725, 36.326792129];
      endPoint = findLargestXCoordinate(coordinates);
    } else if (roadno === 37) {
      startPoint = findSmallestYCoordinate(coordinates);
      endPoint = findSmallestXCoordinate(coordinates);
    } else if (roadno === 38) {
      startPoint = findSmallestXCoordinate(coordinates);
      endPoint = findLargestYCoordinate(coordinates);
    } else if (roadno === 39) {
      startPoint = findSmallestYCoordinate(coordinates);
      endPoint = [127.042843088, 37.75828653];
    } else if (roadno === 40) {
      startPoint = findLargestYCoordinate(coordinates);
      endPoint = findLargestXCoordinate(coordinates);
    } else if (roadno === 42) {
      startPoint = findSmallestXCoordinate(coordinates);
      endPoint = findLargestXCoordinate(coordinates);
    } else if (roadno === 46) {
      startPoint = findSmallestXCoordinate(coordinates);
      endPoint = findLargestXCoordinate(coordinates);
    } else if (roadno === 59) {
      startPoint = [127.758024988, 34.941575326];
      endPoint = findLargestYCoordinate(coordinates);
    } else if (roadno === 77) {
      startPoint = [128.442331347, 35.107069816];
      endPoint = findLargestYCoordinate(coordinates);
    } else if (roadno === 79) {
      startPoint = findSmallestYCoordinate(coordinates);
      endPoint = findLargestYCoordinate(coordinates);
    }

    const sortedCoordinates = [startPoint];
    const remainingCoordinates = coordinates.filter(
      (coord) => coord !== startPoint
    );

    while (remainingCoordinates.length > 0) {
      const lastPoint = sortedCoordinates[sortedCoordinates.length - 1];
      let closestIndex = 0;
      let closestDistance = getDistance(lastPoint, remainingCoordinates[0]);

      if (roadno === 36) {
        if (lastPoint[0] === 129.24241469 && lastPoint[1] === 36.940617472) {
          const nextPoint1 = [129.243402397, 36.940919036];
          const nextPoint2 = [129.244366024, 36.941267227];

          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint1,
            nextPoint2,
          ]);
          continue;
        }
      }
      if (roadno === 37) {
        if (lastPoint[0] === 127.835707696 && lastPoint[1] === 35.850975065) {
          const nextPoint = [127.836665862, 35.850774751];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
      }
      if (roadno === 38) {
        if (lastPoint[0] === 126.812337755 && lastPoint[1] === 36.882799675) {
          const nextPoint = [126.913878417, 36.886710076];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
        if (lastPoint[0] === 128.257309826 && lastPoint[1] === 37.172029106) {
          const nextPoint = [128.252295886, 37.175093786];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
        if (lastPoint[0] === 128.900854112 && lastPoint[1] === 37.207687406) {
          const nextPoint1 = [128.901894299, 37.207985589];
          const nextPoint2 = [128.902949727, 37.208246992];

          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint1,
            nextPoint2,
          ]);
          continue;
        }
      }
      if (roadno === 39) {
        if (lastPoint[0] === 126.800398423 && lastPoint[1] === 37.592463995) {
          const nextPoint = [126.797642235, 37.582174086];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
      }
      if (roadno === 42) {
        if (lastPoint[0] === 127.915032861 && lastPoint[1] === 37.292606477) {
          const nextPoint = [127.991142255, 37.388767181];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
      }
      if (roadno === 46) {
        if (lastPoint[0] === 127.759111354 && lastPoint[1] === 37.8384942) {
          const nextPoint = [127.772015533, 37.958171312];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
        if (lastPoint[0] === 127.105990073 && lastPoint[1] === 37.542188691) {
          const nextPoint = [127.15781648, 37.645812577];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
      }
      if (roadno === 77) {
        if (lastPoint[0] === 127.39050893 && lastPoint[1] === 34.554789621) {
          const nextPoint = [127.422930916, 34.529151753];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
        if (lastPoint[0] === 127.139831028 && lastPoint[1] === 34.541217707) {
          const nextPoint = [127.332559175, 34.756897132];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
        if (lastPoint[0] === 126.29513857 && lastPoint[1] === 36.745747075) {
          const nextPoint = [126.881205876, 36.982379509];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
      }
      if (roadno === 79) {
        if (lastPoint[0] === 128.282059786 && lastPoint[1] === 35.317426235) {
          const nextPoint = [128.605402537, 35.255547981];
          sortPointsManual(sortedCoordinates, remainingCoordinates, [
            nextPoint,
          ]);
          continue;
        }
      }
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
  const {
    roadData,
    intData,
    accDataPoints,
    bi1DataPoints,
    bi2DataPoints,
    crpDataPoints,
    slopeDataPoints,
    intDataPoints,
    intBi1DataPoints,
    intBi2DataPoints,
    xlabels,
  } = useMemo(() => {
    let [roadData, intData, intDataPoints, intBi1DataPoints, intBi2DataPoints] =
      [[], [], [], [], []];
    let lengthSum = 0;

    const propertyMap = {
      car: {
        abs: "l_car_abs",
        bi1: "l_car_bi_1",
        bi2: "l_car_bi_2",
        crp: "CRP_V",
      },
      walk: {
        abs: "l_ped_abs",
        bi1: "l_ped_bi_1",
        bi2: "l_ped_bi_2",
        crp: "CRP_P",
      },
      bike: {
        abs: "l_cyc_abs",
        bi1: "l_cyc_bi_1",
        bi2: "l_cyc_bi_2",
        crp: "CRP_B",
      },
    };

    if (!pdata || !showProfile || !selectedRoad) {
      return {
        roadData: [],
        intData: [],
        accDataPoints: [],
        bi1DataPoints: [],
        bi2DataPoints: [],
        crpDataPoints: [],
        slopeDataPoints: [],
        intDataPoints: [],
        intBi1DataPoints: [],
        intBi2DataPoints: [],
        xlabels: [],
      };
    }

    const pRoadData = pdata[selectedRoad];
    if (!pRoadData) {
      return {
        roadData: [],
        intData: [],
        accDataPoints: [],
        bi1DataPoints: [],
        bi2DataPoints: [],
        crpDataPoints: [],
        slopeDataPoints: [],
        intDataPoints: [],
        intBi1DataPoints: [],
        intBi2DataPoints: [],
        xlabels: [],
      };
    }

    const rawData = pRoadData.mergedGJ.features;

    const intRoadNo = parseInt(selectedRoad, 10);
    if (mixedRoads.includes(intRoadNo)) {
      roadData = sortManual(rawData, intRoadNo);
    } else if (horizontalRoads.includes(selectedRoad)) {
      roadData = sortRoadData(rawData, intRoadNo, 1);
    } else if (verticalRoads.includes(selectedRoad)) {
      roadData = sortRoadData(rawData, intRoadNo, 2);
    }

    const dataKeys = propertyMap[pdepth];

    const accDataPoints = roadData.map(
      (feature) => feature.properties[dataKeys.abs]
    );
    const bi1DataPoints = roadData.map(
      (feature) => feature.properties[dataKeys.bi1]
    );
    const bi2DataPoints = roadData.map(
      (feature) => feature.properties[dataKeys.bi2]
    );
    const crpDataPoints = roadData.map(
      (feature) => feature.properties[dataKeys.crp]
    );
    const slopeDataPoints = roadData.map((feature) => {
      let value = parseFloat(feature.properties.elevation);

      // needs better compensation
      if (value > -50 && value < 0) {
        value = -value;
      } else if (value < -50) {
        value += 57;
      }

      return value;
    });

    const filtered_idata = idata.mergedGJ.features.filter((feature) => {
      return (
        Array.isArray(feature.properties.l_roadno) &&
        feature.properties.l_roadno.includes(selectedRoad)
      );
    });

    roadData.forEach((roadFeature) => {
      const matchingData = filtered_idata.find((feature) => {
        return (
          !feature.matched &&
          Array.isArray(feature.properties.l_uid_l3) &&
          feature.properties.l_uid_l3.includes(roadFeature.properties.UID_L3)
        );
      });

      if (matchingData) {
        intData.push(matchingData);

        intDataPoints.push(
          pdepth === "car"
            ? matchingData.properties.n_car_ai
            : pdepth === "walk"
            ? matchingData.properties.n_ped_ai
            : matchingData.properties.n_cyc_ai
        );
        intBi1DataPoints.push(
          pdepth === "car"
            ? matchingData.properties.n_car_bi_1
            : pdepth === "walk"
            ? matchingData.properties.n_ped_bi_1
            : matchingData.properties.n_cyc_bi_1
        );
        intBi2DataPoints.push(
          pdepth === "car"
            ? matchingData.properties.n_car_bi_2
            : pdepth === "walk"
            ? matchingData.properties.n_ped_bi_2
            : matchingData.properties.n_cyc_bi_2
        );
        matchingData.matched = true;
      } else {
        intData.push(null);
        intDataPoints.push(null);
        intBi1DataPoints.push(null);
        intBi2DataPoints.push(null);
      }
    });

    filtered_idata.forEach((feature) => {
      delete feature.matched;
    });

    const lengths = roadData.map((feature) =>
      parseInt(feature.properties.length, 10)
    );
    const xlabels = lengths.map((length) => {
      lengthSum += length;
      return (lengthSum / 1000).toFixed(1);
    });

    return {
      roadData,
      intData,
      accDataPoints,
      bi1DataPoints,
      bi2DataPoints,
      crpDataPoints,
      slopeDataPoints,
      intDataPoints,
      intBi1DataPoints,
      intBi2DataPoints,
      xlabels,
    };
    //eslint-disable-next-line
  }, [pdata, selectedRoad, pdepth]);

  // map interactive functions
  const highlightNode = (index) => {
    const node = roadData[index];
    if (node) {
      setPointer(node.geometry);
    }
  };
  const followMap = (index) => {
    if (!roadData) return;

    const node = roadData[index];
    setPointer(node.geometry);
    setSelectedDM(node.properties.id_l3);
    const pointer = node.geometry;

    if (pointer) {
      setView((prevView) => ({
        longitude: pointer.coordinates[0][0][0],
        latitude: pointer.coordinates[0][0][1] - 0.01,
        zoom: 12,
        maxZoom: 17.45,
        minZoom: 5.5,
        pitch: prevView.pitch,
        bearing: prevView.bearing,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
      }));
    }
  };

  const roadDatasets = [
    {
      label: `평균사고건수`,
      data: accDataPoints,
      borderColor: "red",
      borderWidth: 1,
      pointRadius: 0.1,
      fill: false,
      tension: 0,
      stepped: "before",
      yAxisID: "y1",
    },
    {
      label: `평균사고건수(보간)`,
      hidden: true,
      data: crpDataPoints,
      borderColor: "#FF7300",
      borderWidth: 0,
      pointRadius: 0.1,
      fill: {
        target: "origin",
        above: "rgba(236, 48, 6, 0.3)",
      },
      tension: 0.2,
      stepped: false,
      yAxisID: "y1",
    },
    {
      label: `구간별 건 / km`,
      data: bi1DataPoints,
      borderColor: "#004182",
      borderWidth: 1,
      pointRadius: 0.1,
      fill: false,
      tension: 0,
      stepped: true,
      yAxisID: "y2",
    },
    {
      label: `구간별 건 / 대·km`,
      data: bi2DataPoints,
      borderColor: "#118DF0",
      borderWidth: 1,
      pointRadius: 0.1,
      fill: false,
      tension: 0,
      stepped: true,
      yAxisID: "y2",
    },
    {
      label: "고도(m)",
      data: slopeDataPoints,
      borderColor: "#556677",
      borderWidth: 0,
      pointRadius: 0.1,
      fill: {
        target: "origin",
        above: "rgba(85, 102, 119, 0.3)",
      },
      tension: 0.2,
      stepped: false,
      yAxisID: "y3",
    },
  ];

  const intDataSets = [
    {
      label: `평균사고건수`,
      type: "scatter",
      data: intDataPoints,
      borderColor: "red",
      backgroundColor: "red",
      borderWidth: 2,
      pointRadius: 2,
      yAxisID: "y1",
    },
    /* This dummy dataset exists to match the index numbers of roadDataPoints.
    The visibility of the legend checkbox is disabled in RiskProfile.js*/
    {
      label: `dummy`,
      hidden: true,
      data: [],
      borderColor: "#000000",
      yAxisID: "y1",
    },
    //
    {
      label: "지점별 건 / 대",
      type: "scatter",
      data: intBi1DataPoints,
      borderColor: "#004182",
      backgroundColor: "#004182",
      borderWidth: 2,
      pointRadius: 2,
      yAxisID: "y2",
    },
    {
      label: "지점별 건 / 대·차로",
      data: intBi2DataPoints,
      type: "scatter",
      borderColor: "#118DF0",
      backgroundColor: "#118DF0",
      borderWidth: 2,
      pointRadius: 2,
      yAxisID: "y2",
    },
    {
      label: "고도(m)",
      data: slopeDataPoints,
      borderColor: "#556677",
      borderWidth: 0,
      pointRadius: 0.1,
      fill: {
        target: "origin",
        above: "rgba(85, 102, 119, 0.3)",
      },
      tension: 0.2,
      stepped: false,
      yAxisID: "y3",
    },
  ];

  // RiskProfile Chart.js data & options
  const profdata = useMemo(
    () => ({
      labels: xlabels,
      datasets: selectedTypeButton === "road" ? roadDatasets : intDataSets,
    }),
    // eslint-disable-next-line
    [roadData, pdepth, selectedTypeButton]
  );

  const profoptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: "transparent",
      interaction: {
        mode: selectedTypeButton === "road" ? "index" : "nearest",
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
          position: "left",
          title: {
            display: true,
            padding: 3,
            text: "평균사고건수",
            font: {
              size: 14,
              family: "NanumSquare, sans-serif",
            },
          },
          grid: {
            color: "#00000030",
          },
        },
        y2: {
          beginAtZero: true,
          position: "right",
          title: {
            display: true,
            padding: 3,
            text: selectedTypeButton === "road" ? "구간별 지표" : "지점별 지표",
            font: {
              size: 14,
              family: "NanumSquare, sans-serif",
            },
          },
          grid: {
            color: function (context) {
              if (
                context.tick.value === context.scale.min ||
                context.tick.value === context.scale.max
              ) {
                return "rgba(0, 0, 0, 0)";
              }
              return "#00000030";
            },
          },
          border: {
            dash: [5, 5],
          },
        },
        y3: {
          display: false,
          min: 0,
          max: 1100,
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
              y2: { min: 0, max: 2 },
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
              const feature =
                selectedTypeButton === "road"
                  ? roadData[index]
                  : intData[index];

              if (feature && feature.properties) {
                const props = feature.properties;
                return selectedTypeButton === "road"
                  ? [
                      `도로명: ${props.road_name || "N/A"}`,
                      `경사도: ${
                        props.slope === null || props.slope === undefined
                          ? "N/A"
                          : Math.round(parseFloat(props.slope) * 100) / 100 +
                            "%"
                      }`,
                      `고도: ${
                        props.elevation
                          ? parseInt(props.elevation, 10) + "m"
                          : "N/A"
                      }`,
                      `차로수: ${laneF(props.width) || "N/A"}`,
                      `교통시설물: ${facilF(props.facil_kind) || "N/A"}`,
                      `제한속도: ${
                        speedF(parseInt(props.max_spd, 10)) || "N/A"
                      }`,
                      // `중앙분리대유형: ${barrierF(props.barrier) || "N/A"}`,
                      // `신호등개수: ${
                      //   lightF(parseInt(props.num_cross, 10)) || "N/A"
                      // }`,`
                      `자동차전용도로유무: ${
                        caronlyF(props.auto_exclu) || "N/A"
                      }`,
                      `일방통행유무: ${onewayF(props.oneway) || "N/A"}`,
                    ].join("\n")
                  : [
                      `교차로명: ${props.node_name || "N/A"}`,
                      `신호등 종류: ${tralightF(props.traffic_light) || "N/A"}`,
                      `연결 링크 수: ${props.approaches || "N/A"}`,
                      `AADT 예측값: ${
                        Number(props.aadt_pre_n).toFixed(2) || "N/A"
                      }`,
                    ].join("\n");
              }
              // return null;
            },
          },
        },
      },
    }),
    [roadData, intData, selectedTypeButton]
  );

  const toggleProfile = () => {
    if (!rdata) fetchRoadacc();
    if (!idata) {
      fetchIntacc();
      setIcbx([true, true, true, true, true]);
    }
    // offload pdata when riskprofile is turned off - adjust max value to performance
    if (Object.keys(pdata).length >= 10) {
      setPdata({});
    }
    if (selectedRoad || selection) {
      setSelectedRoad(null);
      setSelection("");
    }
    if (selectedRPIcon !== "car") {
      setSelectedRPIcon("car");
      setPdepth("car");
    }
    if (selectedTypeButton !== "road") {
      setSelectedTypeButton("road");
    }
    setIsSelect(false);
    setShowChart(false);
    setPointer(null);
    setAcclayer1(false);
    if (showProfile === true && acclayer2 === true) setAcclayer2(false);
    setShowProfile((prev) => !prev);
    setPdata({});
  };
  ///////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////
  const { chrtdata } = useMemo(() => {
    let counts = {};

    if (acclayer1 && rdata) {
      if (rdepth.type === "car") {
        switch (rdepth.index) {
          case 1:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_car_bi_1;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.003) counts[roadNo][0]++;
                else if (0.003 <= value && value < 0.012) counts[roadNo][1]++;
                else if (0.012 <= value && value < 0.029) counts[roadNo][2]++;
                else if (0.029 <= value && value < 0.083) counts[roadNo][3]++;
                else if (0.083 <= value && value < 0.19) counts[roadNo][4]++;
              }
            });
            break;
          case 2:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_car_bi_2;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.0141) counts[roadNo][0]++;
                else if (0.0141 <= value && value < 0.04707)
                  counts[roadNo][1]++;
                else if (0.04707 <= value && value < 0.10406)
                  counts[roadNo][2]++;
                else if (0.10406 <= value && value < 0.23738)
                  counts[roadNo][3]++;
                else if (0.23738 <= value && value < 0.54188)
                  counts[roadNo][4]++;
              }
            });
            break;
          case 3:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_car_abs;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.33642) counts[roadNo][0]++;
                else if (0.33642 <= value && value < 1.33964)
                  counts[roadNo][1]++;
                else if (1.33964 <= value && value < 4.00281)
                  counts[roadNo][2]++;
                else if (4.00281 <= value && value < 13.0132)
                  counts[roadNo][3]++;
                else if (13.0132 <= value && value < 150.4113)
                  counts[roadNo][4]++;
              }
            });
            break;
          default:
            break;
        }
      } else if (rdepth.type === "walk") {
        switch (rdepth.index) {
          case 1:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_ped_bi_1;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 >= value) counts[roadNo][0]++;
                else if (0 <= value && value < 0.002) counts[roadNo][1]++;
                else if (0.002 <= value && value < 0.005) counts[roadNo][2]++;
                else if (0.005 <= value && value < 0.014) counts[roadNo][3]++;
                else if (0.014 <= value && value < 0.04) counts[roadNo][4]++;
              }
            });
            break;
          case 2:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_ped_bi_2;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.003) counts[roadNo][0]++;
                else if (0.003 <= value && value < 0.013) counts[roadNo][1]++;
                else if (0.013 <= value && value < 0.032) counts[roadNo][2]++;
                else if (0.032 <= value && value < 0.113) counts[roadNo][3]++;
                else if (0.113 <= value && value < 0.27) counts[roadNo][4]++;
              }
            });
            break;
          case 3:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_ped_abs;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 >= value) counts[roadNo][0]++;
                else if (0 <= value && value < 0.334) counts[roadNo][1]++;
                else if (0.334 <= value && value < 1.333) counts[roadNo][2]++;
                else if (1.333 <= value && value < 3.667) counts[roadNo][3]++;
                else if (3.667 <= value && value < 20.68) counts[roadNo][4]++;
              }
            });
            break;
          default:
            break;
        }
      } else if (rdepth.type === "bike") {
        switch (rdepth.index) {
          case 1:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_cyc_bi_1;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 >= value) counts[roadNo][0]++;
                else if (0 <= value && value < 0.001) counts[roadNo][1]++;
                else if (0.001 <= value && value < 0.003) counts[roadNo][2]++;
                else if (0.003 <= value && value < 0.007) counts[roadNo][3]++;
                else if (0.007 <= value && value < 0.03) counts[roadNo][4]++;
              }
            });
            break;
          case 2:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_cyc_bi_2;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.001) counts[roadNo][0]++;
                else if (0.001 <= value && value < 0.005) counts[roadNo][1]++;
                else if (0.005 <= value && value < 0.014) counts[roadNo][2]++;
                else if (0.014 <= value && value < 0.038) counts[roadNo][3]++;
                else if (0.038 <= value && value < 0.08) counts[roadNo][4]++;
              }
            });
            break;
          case 3:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_cyc_abs;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 >= value) counts[roadNo][0]++;
                else if (0 <= value && value < 0.3329) counts[roadNo][1]++;
                else if (0.3329 <= value && value < 0.667) counts[roadNo][2]++;
                else if (0.667 <= value && value < 1.667) counts[roadNo][3]++;
                else if (1.667 <= value && value < 4.7) counts[roadNo][4]++;
              }
            });
            break;
          default:
            break;
        }
      }
    }

    const normalizeCounts = (counts) => {
      let normalized = {};
      Object.keys(counts).forEach((roadNo) => {
        let total = counts[roadNo].reduce((sum, current) => sum + current, 0);
        normalized[roadNo] = counts[roadNo].map((count) =>
          ((count / total) * 100).toFixed(4).slice(0, -2)
        );
      });
      return normalized;
    };

    const normalizedCounts = normalizeCounts(counts);

    const roadLabels = Object.keys(normalizedCounts).sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10)
    );
    // RiskChart Chart.js data & options
    const datasets = ["매우 낮음", "낮음", "보통", "높음", "매우 높음"].map(
      (label, idx) => ({
        label,
        data: roadLabels.map((roadNo) => ({
          x: `${roadNo}번 국도`,
          y: normalizedCounts[roadNo][idx],
          originalCount: counts[roadNo][idx],
        })),
        backgroundColor: [
          "#00afb9",
          "#79c2a5",
          "#f2d492",
          "#e98d78",
          "#dd0016",
        ][idx],
      })
    );

    return {
      counts,
      normalizedCounts,
      chrtdata: {
        labels: roadLabels.map((roadNo) => `${roadNo}번 국도`),
        datasets,
      },
    };
  }, [rdepth, rdata, acclayer1]);

  const chrtoptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      barPercentage: 0.75,
      scales: {
        x: {
          stacked: true,
          ticks: {
            maxTicksLimit: 20,
          },
        },
        y: {
          beginAtZero: true,
          stacked: true,
          ticks: {
            callback: (value) => `${value}%`,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label;
              const value = context.parsed.y;
              const originalCount = context.raw.originalCount;
              return `${label}: ${value}% (${originalCount})`;
            },
          },
        },
        legend: {
          display: true,
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "x",
          },
          limits: {
            x: { min: 0, max: "original" },
          },
        },
      },
    }),
    []
  );

  const toggleChart = () => {
    if (!rdata) {
      fetchRoadacc();
    }
    if (showProfile) {
      setShowProfile(false);
    }
    if (acclayer1 || acclayer2) {
      setAcclayer2(false);
    }
    setShowChart((prev) => !prev);
  };
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  const items = [
    {
      id: "도로사고",
      label: showChart ? "노선별 사고위험도" : "단일로 사고위험도",
      content: (
        <div>
          <div id="지표선택" className="inner-accordion-item">
            <span className="label">• 지표선택</span>
            <div className="accdropdown">
              <div className="indicator">
                {rindicatorTxt(currentRoadIndicator)}
              </div>
              <div className="dropdown-content">
                <button onClick={() => handleRoadDropdownClick(1)}>
                  (기본) 구간별 건 / km
                </button>
                <button onClick={() => handleRoadDropdownClick(2)}>
                  (기본) 구간별 건 / 대·km
                </button>
                <button onClick={() => handleRoadDropdownClick(3)}>
                  평균 사고 건수
                </button>
              </div>
            </div>
          </div>

          <div id="관점" className="inner-accordion-item">
            <span className="label">• 관점</span>
            <div className="icon_container">
              <button
                className={`icon_button car ${
                  selectedRoadIcon === "car" ? "selected" : ""
                }`}
                onClick={() => handleRoadIconClick("car")}
              >
                <FaCar />
                <div className="icon_label">차량</div>
              </button>
              <button
                className={`icon_button walk ${
                  selectedRoadIcon === "walk" ? "selected" : ""
                }`}
                onClick={() => handleRoadIconClick("walk")}
              >
                <FaWalking />
                <div className="icon_label">보행자</div>
              </button>
              <button
                className={`icon_button bike ${
                  selectedRoadIcon === "bike" ? "selected" : ""
                }`}
                onClick={() => handleRoadIconClick("bike")}
              >
                <FaBiking />
                <div className="icon_label">자전거</div>
              </button>
            </div>
          </div>

          {!showChart && (
            <div id="위험도R" className="inner-accordion-item">
              <span className="label">• 위험도</span>
              <div className="checkbox_container">
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="rcbx_vh"
                    className="hidden_checkbox"
                    checked={rcbx[0]}
                    onChange={() => handleRCbx(0)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box veryHigh" />
                  매우 높음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="rcbx_h"
                    className="hidden_checkbox"
                    checked={rcbx[1]}
                    onChange={() => handleRCbx(1)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box high" /> 높음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="rcbx_m"
                    className="hidden_checkbox"
                    checked={rcbx[2]}
                    onChange={() => handleRCbx(2)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box medium" /> 보통
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="rcbx_l"
                    className="hidden_checkbox"
                    checked={rcbx[3]}
                    onChange={() => handleRCbx(3)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box low" /> 낮음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="rcbx_vl"
                    className="hidden_checkbox"
                    checked={rcbx[4]}
                    onChange={() => handleRCbx(4)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box veryLow" /> 매우
                  낮음
                </label>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "교차사고",
      label: "교차로 사고위험도",
      content: (
        <div>
          <div id="지표선택" className="inner-accordion-item">
            <span className="label">• 지표선택</span>
            <div className="content">
              <div className="accdropdown">
                <div className="indicator">
                  {iindicatorTxt(currentICIndicator)}
                </div>
                <div className="dropdown-content">
                  <button
                    className="button"
                    onClick={() => handleICDropdownCLick(1)}
                  >
                    (기본) 구간별 건 / 차로
                  </button>
                  <button
                    className="button"
                    onClick={() => handleICDropdownCLick(2)}
                  >
                    (기본) 구간별 건 / 대·차로
                  </button>
                  <button
                    className="button"
                    onClick={() => handleICDropdownCLick(3)}
                  >
                    평균 사고 건수
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="관점" className="inner-accordion-item">
            <span className="label">• 관점</span>
            <div className="content">
              <div className="icon_container">
                <button
                  className={`icon_button car ${
                    selectedICIcon === "car" ? "selected" : ""
                  }`}
                  onClick={() => handleICIconClick("car")}
                >
                  <FaCar />
                  <div className="icon_label">차량</div>
                </button>
                <button
                  className={`icon_button walk ${
                    selectedICIcon === "walk" ? "selected" : ""
                  }`}
                  onClick={() => handleICIconClick("walk")}
                >
                  <FaWalking />
                  <div className="icon_label">보행자</div>
                </button>
                <button
                  className={`icon_button bike ${
                    selectedICIcon === "bike" ? "selected" : ""
                  }`}
                  onClick={() => handleICIconClick("bike")}
                >
                  <FaBiking />
                  <div className="icon_label">자전거</div>
                </button>
              </div>
            </div>
          </div>

          <div id="위험도I" className="inner-accordion-item">
            <span className="label">• 위험도</span>
            <div className="content">
              <div className="checkbox_container">
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_vh"
                    className="hidden_checkbox"
                    checked={icbx[0]}
                    onChange={() => handleICbx(0)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box veryHigh" />{" "}
                  매우 높음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_h"
                    className="hidden_checkbox"
                    checked={icbx[1]}
                    onChange={() => handleICbx(1)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box high" /> 높음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_m"
                    className="hidden_checkbox"
                    checked={icbx[2]}
                    onChange={() => handleICbx(2)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box medium" /> 보통
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_l"
                    className="hidden_checkbox"
                    checked={icbx[3]}
                    onChange={() => handleICbx(3)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box low" /> 낮음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_vl"
                    className="hidden_checkbox"
                    checked={icbx[4]}
                    onChange={() => handleICbx(4)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box veryLow" /> 매우
                  낮음
                </label>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];
  ///////////////////////////////////////////////////////////////
  const canvasStyle = {
    width: "99%",
    height: "100%",
  };
  const profileStyle = {
    width: "99%",
    height: "87.5%",
  };
  const visibleItems = showChart
    ? items.filter((item, index) => index !== 1)
    : items;
  ///////////////////////////////////////////////////////////////
  return (
    <div>
      <div className={`detail_div ${menuToggle ? "" : "hidden"}`}>
        <div className="accordion_div">
          {!showProfile && <Accordion2 items={visibleItems} />}
        </div>
        <div className={`buttons_div`}>
          <button className="data_button profile" onClick={toggleProfile}>
            <MdOutlineSsidChart />
            <span className="profile_text">리스크 프로필을 표출합니다.</span>
          </button>
          <button className="data_button chart" onClick={toggleChart}>
            <IoStatsChart />
            <span className="chart_text">차트 정보를 표출합니다.</span>
          </button>
        </div>
      </div>
      <div>
        {showProfile && (
          <div className={`profile_container ${menuToggle ? "" : "hidden"}`}>
            <div className="rpoptions">
              <div className="rp_icon_container">
                <button
                  className={`rp_icon car ${
                    selectedRPIcon === "car" ? "selected" : ""
                  }`}
                  onClick={() => handleProfileIconClick("car")}
                >
                  <FaCar />
                </button>
                <button
                  className={`rp_icon walk ${
                    selectedRPIcon === "walk" ? "selected" : ""
                  }`}
                  onClick={() => handleProfileIconClick("walk")}
                >
                  <FaWalking />
                </button>
                <button
                  className={`rp_icon bike ${
                    selectedRPIcon === "bike" ? "selected" : ""
                  }`}
                  onClick={() => handleProfileIconClick("bike")}
                >
                  <FaBiking />
                </button>
              </div>

              <div className="dropdown_container" style={{ width: "40%" }}>
                <div
                  className="rp_roadNo"
                  onClick={() => setIsSelect(!isSelect)}
                >
                  <div>{selection ? `${selection}` : "국도 선택"}</div>
                  {isSelect ? <GoTriangleUp /> : <GoTriangleDown />}
                </div>
                {isSelect && (
                  <DropdownForm
                    options={roads}
                    handleSelection={handleSelection}
                    type="riskprofile"
                  />
                )}
              </div>

              <div className="rp_type_selector">
                <button
                  className={`rp_button road ${
                    selectedTypeButton === "road" ? "selected" : ""
                  }`}
                  onClick={() => handleTypeSelect("road")}
                >
                  단일로
                </button>
                <button
                  className={`rp_button intersection ${
                    selectedTypeButton === "intersection" ? "selected" : ""
                  }`}
                  onClick={() => handleTypeSelect("intersection")}
                >
                  교차로
                </button>
              </div>
            </div>

            <div style={profileStyle}>
              <div id="legend"></div>
              <RiskProfile
                data={profdata}
                rawData={roadData}
                options={profoptions}
                highlightNode={highlightNode}
                followMap={followMap}
                type={selectedTypeButton}
              />
            </div>
          </div>
        )}

        {showChart && (
          <div className="chart_container">
            <div style={canvasStyle}>
              <RiskChart data={chrtdata} options={chrtoptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LBacc;
