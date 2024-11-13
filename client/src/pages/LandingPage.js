import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Map } from "react-map-gl";
import DeckGL, {
  GeoJsonLayer,
  ScatterplotLayer,
  TileLayer,
  BitmapLayer,
  ColumnLayer,
} from "deck.gl";
import "mapbox-gl/dist/mapbox-gl.css"; //remove console log error
import "./LandingPage.css";
import { BsArrowsExpand } from "react-icons/bs";
import dissolvedRoad from "../National_Road_Dissolved3.json";
import intPoint from "../National_Road_Interchange_Final_geojson";
import useTooltip from "../hooks/use-tooltip";
import useInfo from "../hooks/use-info";
import useFetch from "../hooks/use-fetch";
import useColor from "../hooks/use_color";
import Controls from "../components/Controls";
import Basemap from "../components/Basemap";
import TopBar from "../components/TopBar";
import DetailMap from "../components/DetailMap";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function LandingPage({ devMode }) {
  const { getTooltip } = useTooltip();
  const {
    INITIAL_VIEW_STATE,
    info,
    taasInfo,
    tmsInfo,
    depth1,
    depth2,
    isFilter,
    view,
    setView,
    setLowerView,
    LD,
    data,
    rdata,
    idata,
    pdata,
    activeMenu,
    acclayer1,
    acclayer2,
    showProfile,
    showDashBoard,
    setShowDashBoard,
    selectedRoad,
    selectedDM,
    setSelectedDM,
    pointer,
    setHoveredIndex,
    pdepth,
    rdepth,
    rcbx,
    idepth,
    icbx,
    basemap,
    mapName,
    detailMap,
    setRBToggle,
    setShowProfile,
    RBtoggle,
  } = useInfo();
  const {
    getEmiVColor,
    getEmiPColor,
    getEmiBColor,
    getRoadColor,
    getTmsColor,
    getTmsdColor,
    getRaccColor,
    getIaccColor,
    getPaccColor,
    getColumnColor,
    getStarColor,
  } = useColor();
  const { fetchdetailmap } = useFetch();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [length, setLength] = useState(null);
  const [boundary, setDMBoundary] = useState(null);
  const [menuToggle, setMenuToggle] = useState(true);

  // window size change
  const useWindowDimensions = () => {
    const [windowDims, setWindowDims] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowDims({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return [windowDims.width, windowDims.height];
  };

  const [width, height] = useWindowDimensions();
  useEffect(() => {
    setView((prevState) => ({
      ...prevState,
      width,
      height,
    }));
  }, [setView, width, height]);

  // vworld map layer
  const baselayer = useMemo(() => {
    return (
      (basemap === "vworldSatellite" || basemap === "vworldBlack") &&
      new TileLayer({
        id: "baselayer",
        data:
          basemap === "vworldSatellite"
            ? "https://api.vworld.kr/req/wmts/1.0.0/4C74568D-F5BB-3771-B47D-753555C5138B/Satellite/{z}/{y}/{x}.jpeg"
            : "https://api.vworld.kr/req/wmts/1.0.0/4C74568D-F5BB-3771-B47D-753555C5138B/midnight/{z}/{y}/{x}.png",
        tileSize: 256,
        renderSubLayers: (props) => {
          const {
            bbox: { west, south, east, north },
          } = props.tile;
          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north],
            desaturate: basemap === "vworldSatellite" ? 0 : 1,
            tintColor: [120, 120, 120],
          });
        },
      })
    );
  }, [basemap]);

  // Helper functions
  const findMidPoint = (coordinates) => {
    coordinates.sort((a, b) => {
      if (a[1] === b[1]) {
        return a[0] - b[0];
      }
      return a[1] - b[1];
    });

    const midIndex = Math.floor(coordinates.length / 2);
    return coordinates[midIndex];
  };

  const handleDMclick = (i) => {
    console.log(i.object);
    if (depth1 !== "별점평가") return;
    setRBToggle(true);
    setShowProfile(false);
    const coordinates = i.object.geometry.coordinates;
    if (!coordinates) {
      window.alert("해당 지점에 정보가 없습니다.");
      console.log("! Coordinate Error !");
      return;
    }
    setView((prev) => {
      return {
        ...prev,
        longitude: coordinates[0][0][0],
        latitude: coordinates[0][0][1],
        zoom: 15.5,
        maxZoom: 19.8,
        minZoom: 5.5,
      };
    });
    if (detailMap) {
      const midpoint = findMidPoint(coordinates[0]);
      setDMBoundary(midpoint);
      fetchdetailmap(midpoint);
      setLowerView((prev) => {
        return {
          ...prev,
          longitude: coordinates[0][0][0],
          latitude: coordinates[0][0][1],
          zoom: 15.5,
          maxZoom: 20.9,
          minZoom: 15,
        };
      });
    }
    setSelectedDM(i.object.properties.uid);
  };

  const onHover = (info) => {
    if (info.object) {
      setHoveredItem({
        id: info.object.properties.id || info.object.properties.UID,
      });
    } else {
      setHoveredItem(null);
    }
  };

  const getDynamicPointRadius = useCallback(
    (d) => {
      if (
        hoveredItem &&
        (d.properties.id === hoveredItem.id ||
          d.properties.UID === hoveredItem.id)
      ) {
        return 200; // 1000
      }
      return 2; // 4
    },
    [hoveredItem]
  );
  /////////////////////////////////////////////////////

  // LAYERS
  const layer0 = new GeoJsonLayer({
    id: "oneroad",
    data: dissolvedRoad, // 기본 도로선 레이어
    lineWidthMaxPixels: 3,
    getLineColor:
      depth2 !== "교통량지점" ? [147, 177, 200, 180] : [0, 0, 0, 255 * 0.2],
    getLineWidth: 500,
    visible: view.zoom >= 6 && depth1 !== "TAAS",
  });

  const layer1 = useMemo(() => {
    if (!data.nroad) return null;

    return new GeoJsonLayer({
      id: "nationalRoad",
      data: data.nroad,
      lineWidthMaxPixels: depth1 === "별점평가" ? 7 : 5,
      lineWidthMinPixels: 3,
      getLineWidth: 700,
      getLineColor: (d) => {
        switch (depth1) {
          case "도로현황":
            return getRoadColor(d);
          case "별점평가":
            return getStarColor(d.properties);
          case "TMS":
            if (depth2 === "교통량구간") {
              return getTmsColor(d.properties.aadt_pred);
            } else {
              return [100, 0, 60, 0];
            }
          default:
            return [230, 0, 60];
        }
      },
      pickable: true,
      autoHighlight: true,
      visible:
        (activeMenu === "curr" || activeMenu === "star") &&
        isFilter &&
        view.zoom >= 6 &&
        (depth1 === "도로현황" ||
          depth1 === "별점평가" ||
          (depth1 !== "TAAS" &&
            depth2 !== "교통량지점" &&
            isFilter &&
            depth2 !== null)),
      onClick: (i) => handleDMclick(i),
      updateTriggers: {
        getLineColor: [info, depth1, tmsInfo, handleDMclick, selectedDM],
      },
    });
    //eslint-disable-next-line
  }, [
    data.nroad,
    depth1,
    depth2,
    isFilter,
    view.zoom,
    info,
    getRoadColor,
    getStarColor,
    getTmsColor,
    tmsInfo,
    activeMenu,
    selectedDM,
  ]);

  const layer2 = useMemo(() => {
    if (!data.emiroad) return null;

    return new GeoJsonLayer({
      id: "emiRoad",
      data: data.emiroad, // 일반국도현황 -> 교통사고
      lineWidthMaxPixels: 4,
      lineWidthMinPixels: depth2 !== null ? 4 : 1,
      getLineWidth: depth2 !== null ? 2000 : 1,
      getLineColor: (d) => {
        switch (depth2) {
          case "차량관점":
            return getEmiVColor(d.properties.emi_v);
          case "보행자관점":
            return getEmiPColor(d.properties.emi_p);
          case "자전거관점":
            return getEmiBColor(d.properties.emi_b);
          default:
            return [230, 0, 60];
        }
      },
      pickable: true,
      autoHighlight: true,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 6 &&
        depth1 === "TAAS",
      onClick: (i) => console.log(i.object),
      updateTriggers: {
        getLineColor: [taasInfo, depth2],
      },
    });
  }, [
    data.emiroad,
    depth1,
    depth2,
    taasInfo,
    getEmiVColor,
    getEmiPColor,
    getEmiBColor,
    isFilter,
    view.zoom,
    activeMenu,
  ]);

  const layer3 =
    depth1 === "도로현황" &&
    new GeoJsonLayer({
      id: "int",
      data: intPoint, // 전국 모든 교차로 레이어
      stroked: true,
      filled: true,
      pointType: "circle",
      lineWidthScale: 10,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 2,
      pointRadiusMaxPixels: 3,
      getFillColor: [229, 252, 246],
      getLineColor: [60, 60, 60],
      getPointRadius: 100,
      // pickable: true,
      // onHover: onHover,
      // autoHighlight: true,
      // highlightColor: [255, 0, 0, 200],
      visible: activeMenu === "curr" && view.zoom >= 9.7,
    });

  const layer4 = useMemo(() => {
    if (!data.vpoint) return null;

    return new GeoJsonLayer({
      id: "vpoint",
      data: data.vpoint, // 교통사고 -> 차량 관점 사고 지점
      lineWidthScale: 10,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 10,
      getFillColor: [255, 255, 255, 255 * 0.7],
      getLineColor: [0, 0, 0, 255 * 0.25],
      pickable: true,
      autoHighlight: true,
      getPointRadius: getDynamicPointRadius,
      onHover: onHover,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 10 &&
        depth2 === "차량관점",
      onClick: (i) => console.log(i.object),
      updateTriggers: {
        getPointRadius: hoveredItem,
      },
    });
  }, [
    data.vpoint,
    depth2,
    isFilter,
    view.zoom,
    hoveredItem,
    getDynamicPointRadius,
    activeMenu,
  ]);

  const layer5 = useMemo(() => {
    if (!data.ppoint) return null;

    return new GeoJsonLayer({
      id: "ppoint",
      data: data.ppoint, // 교통사고 -> 보행자 관점 사고 지점
      lineWidthScale: 20,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 10,
      getFillColor: [255, 255, 255, 255 * 0.7],
      getLineColor: [0, 0, 0, 255 * 0.25],
      pickable: true,
      autoHighlight: true,
      getPointRadius: getDynamicPointRadius,
      onHover: onHover,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 10 &&
        depth2 === "보행자관점",
      onClick: (i) => console.log(i.object),
      updateTriggers: {
        getPointRadius: hoveredItem,
      },
    });
  }, [
    data.ppoint,
    depth2,
    isFilter,
    view.zoom,
    hoveredItem,
    getDynamicPointRadius,
    activeMenu,
  ]);

  const layer6 = useMemo(() => {
    if (!data.bpoint) return null;

    return new GeoJsonLayer({
      id: "bpoint",
      data: data.bpoint, // 교통사고 -> 자전거 관점 사고 지점
      lineWidthScale: 20,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 10,
      getFillColor: [255, 255, 255, 255 * 0.7],
      getLineColor: [0, 0, 0, 255 * 0.25],
      pickable: true,
      autoHighlight: true,
      getPointRadius: getDynamicPointRadius,
      onHover: onHover,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 10 &&
        depth2 === "자전거관점",
      onClick: (i) => console.log(i.object),
      updateTriggers: {
        getPointRadius: hoveredItem,
      },
    });
  }, [
    data.bpoint,
    depth2,
    isFilter,
    view.zoom,
    hoveredItem,
    getDynamicPointRadius,
    activeMenu,
  ]);

  const layer7 = useMemo(() => {
    if (!data.aadtDot) return null;

    return new GeoJsonLayer({
      id: "aadtdot",
      data: data.aadtDot, // 교통량 측정 지점
      lineWidthScale: 20,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 7,
      getFillColor: (d) => {
        return getTmsdColor(d.properties.Resduals);
      },
      getLineColor: [0, 0, 0, 255 * 0.75],
      pickable: true,
      autoHighlight: true,
      getPointRadius: 1000,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 6 &&
        depth2 === "교통량지점",
      onClick: (i) => console.log(i.object),
      updateTriggers: {
        getFillColor: tmsInfo,
      },
    });
  }, [
    data.aadtDot,
    depth2,
    tmsInfo,
    isFilter,
    view.zoom,
    getTmsdColor,
    activeMenu,
  ]);

  // 사고위험지도 Layers //////////////////////////////////////////////////////////////////////

  const layer8 = useMemo(() => {
    if (!rdata) return null;

    return new GeoJsonLayer({
      id: "roadAcdnt",
      data: rdata.mergedGJ,
      lineWidthScale: 1000,
      lineWidthMaxPixels: 5,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 7,
      getFillColor: [255, 255, 255, 255 * 0.7],
      getLineColor: (d) => {
        return getRaccColor(d.properties);
      },
      pickable: true,
      autoHighlight: true,
      onHover: onHover,
      onClick: (i) => console.log(i.object),
      visible:
        activeMenu === "acc" &&
        isFilter &&
        view.zoom >= 6 &&
        acclayer1 &&
        !showProfile,
      updateTriggers: {
        getLineColor: [rdepth, rcbx],
      },
    });
  }, [
    rdata,
    isFilter,
    view.zoom,
    activeMenu,
    acclayer1,
    showProfile,
    getRaccColor,
    rdepth,
    rcbx,
  ]);

  const layer9 = useMemo(() => {
    if (!idata) return null;

    return new GeoJsonLayer({
      id: "intAcdnt",
      data: idata.mergedGJ,
      lineWidthScale: 20,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 4,
      pointRadiusMaxPixels: 10,
      getFillColor: (d) => {
        return getIaccColor(d.properties);
      },
      getLineColor: [0, 0, 0, 255 * 0.75],
      pickable: true,
      autoHighlight: true,
      getPointRadius: getDynamicPointRadius,
      onHover: onHover,
      visible: activeMenu === "acc" && isFilter && view.zoom >= 6 && acclayer2,
      onClick: (i) => console.log(i.object),
      updateTriggers: {
        getFillColor: [idepth, icbx],
        getPointRadius: hoveredItem,
      },
    });
  }, [
    idata,
    isFilter,
    view.zoom,
    activeMenu,
    acclayer2,
    hoveredItem,
    getDynamicPointRadius,
    getIaccColor,
    idepth,
    icbx,
  ]);

  const [hoveredCommonId, setHoveredCommonId] = useState(null);
  const layer10 = useMemo(() => {
    if (!selectedRoad || pdata.length === 0) return null;

    const pRoadData = pdata[selectedRoad];
    if (!pRoadData) return null;

    return new GeoJsonLayer({
      id: "riskprof",
      data: pRoadData.mergedGJ,
      lineWidthScale: 1000,
      lineWidthMaxPixels: 5,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 7,
      getLineColor: (d) => {
        if (d.properties.id_l3 === selectedDM) return [22, 17, 250, 255 * 0.9];
        else if (hoveredCommonId && d.properties.uid_l1 === hoveredCommonId) {
          return [111, 45, 111, 255];
        } else return getPaccColor(d.properties);
      },
      extruded: view.pitch > 45,
      getElevation: (d) => d.properties.elevation,
      pickable: true,
      autoHighlight: true,
      highlightColor: [122, 122, 250],
      onHover: (i) => {
        if (i.object) {
          setHoveredCommonId(i.object.properties.uid_l1);
        } else {
          setHoveredCommonId(null);
        }
      },
      onClick: (i) => {
        console.log(i.object);
        setHoveredIndex(i.object.properties.fromnodeid);
        setSelectedDM(i.object.properties.id_l3);
      },
      visible:
        activeMenu === "acc" && isFilter && view.zoom >= 6 && showProfile,
      updateTriggers: {
        getLineColor: [
          hoveredCommonId,
          pdepth,
          rdepth,
          selectedRoad,
          selectedDM,
        ],
      },
    });
    //eslint-disable-next-line
  }, [
    pdata,
    pdepth,
    rdepth,
    isFilter,
    view.zoom,
    view.pitch,
    activeMenu,
    showProfile,
    selectedRoad,
    getPaccColor,
    setHoveredIndex,
    selectedDM,
    hoveredCommonId,
  ]);

  const layer11 = useMemo(() => {
    if (!pdata || !pointer || !selectedRoad) return null;

    const pointData = pointer ? [pointer] : [];

    return new ScatterplotLayer({
      id: "pointer",
      data: pointData,
      getPosition: (d) => d.coordinates[0][0],
      getRadius:
        view.zoom <= 7.8
          ? 3000
          : view.zoom <= 9
          ? 1700
          : view.zoom <= 10.1
          ? 900
          : view.zoom <= 11
          ? 450
          : view.zoom <= 12
          ? 220
          : view.zoom <= 13.95
          ? 80
          : view.zoom <= 14.5
          ? 50
          : view.zoom <= 15.4
          ? 25
          : view.zoom <= 17
          ? 10
          : 3,
      // 2869.23 / (view.zoom - 7.07),
      lineWidthScale: 10,
      getFillColor: [0, 170, 255, 255 * 0.85],
      stroked: true,
      lineWidthMaxPixels: 2,
      lineWidthMinPixels: 2,
      getLineColor: [255, 255, 255],
      pickable: true,
      onClick: (i) => console.log(i.object),
      visible:
        activeMenu === "acc" && isFilter && view.zoom >= 6 && showProfile,
    });
  }, [
    pdata,
    pointer,
    activeMenu,
    selectedRoad,
    isFilter,
    showProfile,
    view.zoom,
  ]);

  // 3D testing phase

  // turn off right click for pitch change
  useEffect(() => {
    const handleContextMenu = (event) => {
      if (mapName === "3D (Beta)") event.preventDefault();
    };
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [mapName]);

  const toggleDashBoard = () => {
    setShowDashBoard((prev) => !prev);
    console.log(showDashBoard); // dashboard??
  };

  const columnLayer = useMemo(() => {
    if (!selectedRoad || pdata.length === 0) return null;

    const pRoadData = pdata[selectedRoad];
    if (!pRoadData) return null;

    const columns = pRoadData.mergedGJ.features
      .map((feature) => {
        const [longitude, latitude] = feature.geometry.coordinates[0][0];
        const elevation =
          pdepth === "car"
            ? parseFloat(feature.properties.l_car_abs)
            : pdepth === "walk"
            ? parseFloat(feature.properties.l_ped_abs)
            : parseFloat(feature.properties.l_cyc_abs);
        return {
          position: [longitude, latitude],
          properties: feature.properties,
          elevation: elevation,
        };
      })
      .filter((column) => column.elevation !== 0);

    return new ColumnLayer({
      id: "columns",
      data: columns,
      diskResolution: 8,
      radius: 60,
      extruded: true,
      elevationScale: 1000,
      getElevation: (d) => d.elevation,
      getFillColor: (d) => {
        return getColumnColor(d.properties);
      },
      getPosition: (d) => d.position,
      pickable: true,
      autoHighlight: true,
      highlightColor: [2, 230, 230, 200],
      visible:
        activeMenu === "acc" &&
        activeMenu === "acc" &&
        isFilter &&
        view.pitch > 45 &&
        view.zoom >= 6 &&
        showProfile,
      onClick: toggleDashBoard,
    });
    // eslint-disable-next-line
  }, [
    getColumnColor,
    activeMenu,
    pdata,
    pdepth,
    isFilter,
    showProfile,
    view.pitch,
    view.zoom,
    selectedRoad,
  ]);

  const circlebound = useMemo(() => {
    if (!boundary) {
      return null;
    }

    return new ScatterplotLayer({
      id: "bounds",
      data: [boundary],
      getPosition: (d) => d,
      getRadius: 600,
      getFillColor: [0, 0, 0, 255 * 0.1],
      stroked: true,
      lineWidthMaxPixels: 2,
      lineWidthMinPixels: 2,
      getLineColor: [255, 255, 255, 255 * 0.9],
      pickable: false,
      onClick: (i) => console.log(i.object),
      visible:
        (activeMenu === "star" || activeMenu === "curr") &&
        isFilter &&
        view.zoom >= 10,
    });
  }, [activeMenu, isFilter, view.zoom, boundary]);

  /////////////////////////////////////////////////////////////////

  const layers = [
    baselayer,
    circlebound,
    layer0,
    layer1,
    layer2,
    layer3,
    layer4,
    layer5,
    layer6,
    layer7,
    layer8,
    layer10,
    layer9, // 10 and 9 are switched intentionally for z index ordering
    layer11,
    columnLayer,
  ];

  // 사고위험지도 setLength
  useEffect(() => {
    if (!acclayer1 || rcbx.every((val) => val === false)) {
      setLength(0);
      return;
    }
    if (rdata && rdepth.type === "car") {
      // 차량
      if (rdepth.index === 1) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_car_bi_1 = Number(feature.properties.l_car_bi_1);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_car_bi_1 && l_car_bi_1 < 0.003) ||
            (rcbx[3] && 0.003 <= l_car_bi_1 && l_car_bi_1 < 0.012) ||
            (rcbx[2] && 0.012 <= l_car_bi_1 && l_car_bi_1 < 0.029) ||
            (rcbx[1] && 0.029 <= l_car_bi_1 && l_car_bi_1 < 0.083) ||
            (rcbx[0] && 0.0823 <= l_car_bi_1 && l_car_bi_1 < 0.19)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 2) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_car_bi_2 = Number(feature.properties.l_car_bi_2);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_car_bi_2 && l_car_bi_2 < 0.0141) ||
            (rcbx[3] && 0.0141 <= l_car_bi_2 && l_car_bi_2 < 0.04707) ||
            (rcbx[2] && 0.04707 <= l_car_bi_2 && l_car_bi_2 < 0.10406) ||
            (rcbx[1] && 0.10406 <= l_car_bi_2 && l_car_bi_2 < 0.23738) ||
            (rcbx[0] && 0.23738 <= l_car_bi_2 && l_car_bi_2 < 0.54188)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 3) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_car_abs = Number(feature.properties.l_car_abs);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_car_abs && l_car_abs < 0.33642) ||
            (rcbx[3] && 0.33642 <= l_car_abs && l_car_abs < 1.33964) ||
            (rcbx[2] && 1.33964 <= l_car_abs && l_car_abs < 4.00281) ||
            (rcbx[1] && 4.00281 <= l_car_abs && l_car_abs < 13.0132) ||
            (rcbx[0] && 13.0132 <= l_car_abs && l_car_abs < 150.4113)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      }
    } else if (rdata && rdepth.type === "walk") {
      // 보행자
      if (rdepth.index === 1) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_ped_bi_1 = Number(feature.properties.l_ped_bi_1);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 >= l_ped_bi_1) ||
            (rcbx[3] && 0 < l_ped_bi_1 && l_ped_bi_1 < 0.002) ||
            (rcbx[2] && 0.002 <= l_ped_bi_1 && l_ped_bi_1 < 0.005) ||
            (rcbx[1] && 0.005 <= l_ped_bi_1 && l_ped_bi_1 < 0.014) ||
            (rcbx[0] && 0.014 <= l_ped_bi_1 && l_ped_bi_1 < 0.04)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 2) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_ped_bi_2 = Number(feature.properties.l_ped_bi_2);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_ped_bi_2 && l_ped_bi_2 < 0.003) ||
            (rcbx[3] && 0.003 <= l_ped_bi_2 && l_ped_bi_2 < 0.013) ||
            (rcbx[2] && 0.013 <= l_ped_bi_2 && l_ped_bi_2 < 0.032) ||
            (rcbx[1] && 0.032 <= l_ped_bi_2 && l_ped_bi_2 < 0.113) ||
            (rcbx[0] && 0.113 <= l_ped_bi_2 && l_ped_bi_2 < 0.27)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 3) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_ped_abs = Number(feature.properties.l_ped_abs);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 >= l_ped_abs) ||
            (rcbx[3] && 0 <= l_ped_abs && l_ped_abs < 0.334) ||
            (rcbx[2] && 0.334 <= l_ped_abs && l_ped_abs < 1.333) ||
            (rcbx[1] && 1.333 <= l_ped_abs && l_ped_abs < 3.667) ||
            (rcbx[0] && 3.667 <= l_ped_abs && l_ped_abs < 20.68)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      }
    } else if (rdata && rdepth.type === "bike") {
      // 자전거
      if (rdepth.index === 1) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_cyc_bi_1 = Number(feature.properties.l_cyc_bi_1);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 >= l_cyc_bi_1) ||
            (rcbx[3] && 0 < l_cyc_bi_1 && l_cyc_bi_1 < 0.001) ||
            (rcbx[2] && 0.001 <= l_cyc_bi_1 && l_cyc_bi_1 < 0.003) ||
            (rcbx[1] && 0.003 <= l_cyc_bi_1 && l_cyc_bi_1 < 0.007) ||
            (rcbx[0] && 0.0007 <= l_cyc_bi_1 && l_cyc_bi_1 < 0.03)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 2) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_cyc_bi_2 = Number(feature.properties.l_cyc_bi_2);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.001) ||
            (rcbx[3] && 0.001 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.005) ||
            (rcbx[2] && 0.005 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.014) ||
            (rcbx[1] && 0.014 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.038) ||
            (rcbx[0] && 0.038 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.08)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 3) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_cyc_abs = Number(feature.properties.l_cyc_abs);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 >= l_cyc_abs) ||
            (rcbx[3] && 0 <= l_cyc_abs && l_cyc_abs < 0.3329) ||
            (rcbx[2] && 0.3329 <= l_cyc_abs && l_cyc_abs < 0.667) ||
            (rcbx[1] && 0.667 <= l_cyc_abs && l_cyc_abs < 1.667) ||
            (rcbx[0] && 1.667 <= l_cyc_abs && l_cyc_abs < 4.7)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      }
    }
  }, [rdata, rdepth, rcbx, acclayer1, setLength]);

  // 도로현황 setLength
  useEffect(() => {
    if (data.nroad && info && depth1 === "도로현황") {
      const {
        roadNo,
        laneOps,
        facilOps,
        speedOps,
        barrierOps,
        lightOps,
        caronlyOps,
        onewayOps,
      } = info;
      const filterConditions = [];
      if (roadNo.selected) {
        filterConditions.push((feature) =>
          roadNo.selected.includes(parseInt(feature.properties.road_no))
        );
      }

      if (laneOps.checkboxes) {
        const laneRanges = ["1", "2", "3", "4", "5"];
        var laneConditions = laneOps.checkboxes
          .map((laneOp, index) => {
            if (laneOp) {
              return (feature) =>
                feature.properties.width === laneRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        laneConditions = [];
      }
      if (facilOps.checkboxes) {
        const facilRanges = ["0", "1", "2", "4", "8"];
        var facilConditions = facilOps.checkboxes
          .map((facilOp, index) => {
            if (facilOp) {
              return (feature) =>
                feature.properties.facil_kind === facilRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        facilConditions = [];
      }
      if (speedOps.checkboxes) {
        const speedRanges = [20, 30, 40, 50, 60, 70, 80];
        var speedConditions = speedOps.checkboxes
          .map((speedOp, index) => {
            if (speedOp) {
              if (index === 8) {
                return (feature) =>
                  feature.properties.max_spd === null ||
                  feature.properties.max_spd === 0;
              } else if (index === 7) {
                return (feature) =>
                  feature.properties.max_spd === 90 ||
                  feature.properties.max_spd === 100 ||
                  feature.properties.max_spd === 110;
              } else {
                return (feature) =>
                  feature.properties.max_spd === speedRanges[index];
              }
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        speedConditions = [];
      }
      if (barrierOps.checkboxes) {
        const barrierRanges = ["0", "1", "2", "3", "4", "5", "15"];
        var barrierConditions = barrierOps.checkboxes
          .map((barrierOp, index) => {
            if (barrierOp) {
              return (feature) =>
                feature.properties.barrier === barrierRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        barrierConditions = [];
      }
      if (lightOps.checkboxes) {
        const lightRanges = [0, 1, 2, 3, 4, null];
        var lightConditions = lightOps.checkboxes
          .map((lightOp, index) => {
            if (lightOp) {
              return (feature) =>
                feature.properties.num_cross === lightRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        lightConditions = [];
      }
      if (caronlyOps.checkboxes) {
        const caronlyRanges = ["0", "1", null];
        var caronlyConditions = caronlyOps.checkboxes
          .map((caronlyOp, index) => {
            if (caronlyOp) {
              return (feature) =>
                feature.properties.auto_exclu === caronlyRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        caronlyConditions = [];
      }
      if (onewayOps.checkboxes) {
        const onewayRanges = ["0", "1"];
        var onewayConditions = onewayOps.checkboxes
          .map((onewayOp, index) => {
            if (onewayOp) {
              return (feature) =>
                feature.properties.oneway === onewayRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        onewayConditions = [];
      }

      const filtered = data.nroad.features.filter((feature) => {
        return (
          filterConditions.every((condition) => condition(feature)) &&
          (laneConditions.length === 0 ||
            laneConditions.some((condition) => condition(feature))) &&
          (facilConditions.length === 0 ||
            facilConditions.some((condition) => condition(feature))) &&
          (speedConditions.length === 0 ||
            speedConditions.some((condition) => condition(feature))) &&
          (barrierConditions.length === 0 ||
            barrierConditions.some((condition) => condition(feature))) &&
          (lightConditions.length === 0 ||
            lightConditions.some((condition) => condition(feature))) &&
          (caronlyConditions.length === 0 ||
            caronlyConditions.some((condition) => condition(feature))) &&
          (onewayConditions.length === 0 ||
            onewayConditions.some((condition) => condition(feature)))
        );
      });

      const totalLength =
        filtered.length !== 0
          ? Math.round(
              filtered.reduce((acc, feature) => {
                return acc + feature.properties.length;
              }, 0) / 1000
            )
          : 0;

      setLength(totalLength);
    } else if (data.emiroad && taasInfo && depth1 === "TAAS") {
      const filtered = data.emiroad.features.filter((feature) => {
        let emi, conditions;

        switch (depth2) {
          case "차량관점":
            emi = feature.properties.emi_v;
            conditions = [
              taasInfo[0] && 0 === emi,
              taasInfo[1] && 0 < emi && emi <= 261.86,
              taasInfo[2] && 261.86 < emi && emi <= 1573.98,
            ];
            break;

          case "보행자관점":
            emi = feature.properties.emi_p;
            conditions = [
              taasInfo[0] && 0 === emi,
              taasInfo[1] && 0 < emi && emi <= 253.88,
              taasInfo[2] && 253.88 < emi && emi <= 599.42,
            ];
            break;
          case "자전거관점":
            emi = feature.properties.emi_b;
            conditions = [
              taasInfo[0] && 0 === emi,
              taasInfo[1] && 0 < emi && emi <= 72.46,
              taasInfo[2] && 72.46 < emi && emi <= 185.56,
            ];
            break;
          default:
            conditions = [];
            break;
        }

        if (conditions.every((val) => val === false)) {
          return emi === -100;
        } else {
          return conditions.some((val) => val === true);
        }
      });

      const totalLength =
        filtered.length !== 0
          ? Math.round(
              filtered.reduce((acc, feature) => {
                return acc + feature.properties.length;
              }, 0) / 1000
            )
          : depth1 === "TAAS"
          ? 14927
          : 0;

      setLength(totalLength);
    } else if (data.nroad && tmsInfo && depth2 === "교통량구간") {
      const filtered = data.nroad.features.filter((feature) => {
        let aadt, conditions;

        aadt = feature.properties.aadt_pred;
        conditions = [
          tmsInfo[0] && 1524 <= aadt && aadt <= 18271,
          tmsInfo[1] && 18271 < aadt && aadt <= 82417,
          tmsInfo[2] && 82417 < aadt && aadt <= 298292,
        ];

        if (conditions.every((val) => val === false)) {
          return aadt === -100;
        } else {
          return conditions.some((val) => val === true);
        }
      });

      const totalLength =
        filtered.length !== 0
          ? Math.round(
              filtered.reduce((acc, feature) => {
                return acc + feature.properties.length;
              }, 0) / 1000
            )
          : depth2 === "교통량구간"
          ? 14933
          : 0;

      setLength(totalLength);
    } else {
      setLength(0);
    }
  }, [depth1, depth2, data.emiroad, taasInfo, data.nroad, info, tmsInfo]);

  // max bounds manual implementation //////////////////////////////////////
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(null);
  const [dragPanEnabled, setDragPanEnabled] = useState(true);

  const startCoords = useRef({ x: 0, y: 0 });

  const maxBounds = [
    [132.294007, 41.57412], // Northeast
    [116.048342, 31.27087], // Southwest
  ];

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      startCoords.current = { x: e.clientX, y: e.clientY };
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragDirection(null);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startCoords.current.x;
    const deltaY = e.clientY - startCoords.current.y;

    if (deltaX !== 0 || deltaY !== 0) {
      const direction =
        Math.abs(deltaX) > Math.abs(deltaY)
          ? deltaX > 0
            ? "right"
            : "left"
          : deltaY > 0
          ? "down"
          : "up";
      setDragDirection(direction);
    }
  };

  const checkBounds = (longitude, latitude, direction) => {
    let withinBounds = true;
    let allowedDirection = null;

    if (longitude > maxBounds[0][0]) {
      withinBounds = false;
      if (direction === "left") allowedDirection = "left";
    } else if (longitude < maxBounds[1][0]) {
      withinBounds = false;
      if (direction === "right") allowedDirection = "right";
    }

    if (latitude > maxBounds[0][1]) {
      withinBounds = false;
      if (direction === "down") allowedDirection = "down";
    } else if (latitude < maxBounds[1][1]) {
      withinBounds = false;
      if (direction === "up") allowedDirection = "up";
    }

    return { withinBounds, allowedDirection };
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line
  }, [isDragging]);

  useEffect(() => {
    const { longitude, latitude } = view;
    const { withinBounds, allowedDirection } = checkBounds(
      longitude,
      latitude,
      dragDirection
    );

    if (!withinBounds && dragDirection !== allowedDirection) {
      setDragPanEnabled(true);
    } else if (!withinBounds) {
      setDragPanEnabled(false);
    } else {
      setDragPanEnabled(true);
    }
    // eslint-disable-next-line
  }, [view, dragDirection]);

  const [topHeight, setTopHeight] = useState(50);
  const [bottomHeight, setBottomHeight] = useState(50);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      let newTopHeight = (e.clientY / window.innerHeight) * 100;
      newTopHeight = Math.max(10, Math.min(newTopHeight, 99));
      setTopHeight(newTopHeight);
      setBottomHeight(100 - newTopHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const startDMResize = () => {
    setIsDragging(true);
  };

  return (
    <div className="main">
      {showDashBoard && ( // 3D test phase
        <div className="dashBoard_container">
          <div className="dashBoard"></div>
        </div>
      )}
      <TopBar
        devMode={devMode}
        setDMBoundary={setDMBoundary}
        heights={[setTopHeight, setBottomHeight]}
        setSelectedDM={setSelectedDM}
        menuToggle={menuToggle}
        setMenuToggle={setMenuToggle}
      />
      <div
        className="container"
        style={{ height: `${detailMap ? `${topHeight}vh` : "100vh"}` }}
      >
        <div>
          <Basemap devMode={devMode} />
          <Controls
            view={view}
            setView={setView}
            INITIAL_VIEW_STATE={INITIAL_VIEW_STATE}
            devMode={devMode}
            selectedDM={selectedDM}
          />

          {activeMenu !== "star" && (
            <div className="lengthSum">
              선택구간 연장 <span>{length ? length : 0}</span> km
            </div>
          )}
          {/* {activeMenu && (
          <button className="dtbutton" onClick={toggleDashBoard}>
            toggle
          </button>
        )} */}

          <DeckGL
            initialViewState={view}
            onViewStateChange={({ viewState }) => {
              setView(viewState);
            }}
            controller={{
              dragRotate: showProfile && mapName === "3D (Beta)" ? true : false,
              // keyboard: false, // toggle for disabling arrow key movement
              dragPan: dragPanEnabled, // toggle when not using manual dragPan limitation
            }}
            layers={layers}
            getTooltip={({ object, layer }) => getTooltip({ object, layer })}
            getCursor={() => "default"}
          >
            {!(basemap === "vworldSatellite" || basemap === "vworldBlack") && (
              <Map mapStyle={basemap} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
            )}
          </DeckGL>
        </div>
      </div>
      {detailMap && (
        <div
          className="size-button"
          onMouseDown={startDMResize}
          style={{
            top: `calc(${topHeight}vh - 12px)`,
            left: RBtoggle ? "45%" : "55%",
          }}
        >
          <BsArrowsExpand />
        </div>
      )}
      {detailMap && (
        <DetailMap
          bottomHeight={bottomHeight}
          devMode={devMode}
          boundary={boundary}
          menuToggle={menuToggle}
        />
      )}
      {LD && (
        <div className="overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
