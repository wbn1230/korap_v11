import { useMemo, useState, useEffect } from "react";
import * as turf from "@turf/turf";
import earcut from "earcut";
import { Map } from "react-map-gl";
import DeckGL, { GeoJsonLayer, ScatterplotLayer, LineLayer } from "deck.gl";
import "mapbox-gl/dist/mapbox-gl.css"; //remove console log error
import "../pages/LandingPage.css";
import "./DetailMap.css";
import slope_icon from "../img/slope_icon.svg";
import { TbRulerMeasure } from "react-icons/tb";
import { FaUndo } from "react-icons/fa";
import useInfo from "../hooks/use-info";
import Basemap from "./Basemap";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const DetailMap = ({ bottomHeight, devMode, boundary, menuToggle }) => {
  const {
    depth1,
    isFilter,
    lowerView,
    setLowerView,
    mdata,
    activeMenu,
    RBtoggle,
  } = useInfo();
  const [toolbox, showToolbox] = useState(false);
  const [distMode, setDistMode] = useState(false);
  const [slopeMode, setSlopeMode] = useState(false);
  const [points, setPoints] = useState([]);
  const [pointZs, setPointZs] = useState([]);
  const [distance, setDistance] = useState(0);
  const [slope, setSlope] = useState(0);
  const [mousePos, setMousePos] = useState(null);
  const [toolbox_selecting, setTSselecting] = useState(true);
  const [dmlayerVisibility, setDMLayerVisibility] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);

  const layerIdToMdata = {
    a1_주행노드: mdata.A1,
    a2_주행링크: mdata.A2,
    a3_차도구간: mdata.A3,
    a4_부속구간: mdata.A4,
    a5_주차면: mdata.A5,
    b1_안전표지: mdata.B1,
    b2_노면선표지: mdata.B2,
    b3_횡단보도: mdata.B3,
    c1_신호등: mdata.C1,
    c2_킬로포스트: mdata.C2,
    c3_차량방호: mdata.C3,
    c4_과속방지턱: mdata.C4,
    c5_높이장애물: mdata.C5,
    c6_지주: mdata.C6,
  };

  // disable right click context menu
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
      if (distMode) {
        setMousePos(null);
        setTSselecting(false);
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [distMode]);

  // --------------------------- Methods for z value interpolation for slope calculating --------------------------- //
  const deleteZ = (coordinates) => {
    if (Array.isArray(coordinates[0])) {
      return coordinates.map(deleteZ);
    }
    return coordinates.slice(0, 2);
  };

  const flattenData = (d) => {
    return {
      ...d.mergedGJ,
      features: d.mergedGJ.features.map((feature) => ({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: deleteZ(feature.geometry.coordinates),
        },
      })),
    };
  };

  // b1_안전표지
  const findClosestVertexZ = (point, flat, original) => {
    let minDistance = 2147483648;
    let closestIndex = -1;
    const flatdata = flat.coordinates[0][0];
    const originaldata = original.coordinates[0][0];

    flatdata.forEach((coord, index) => {
      const [x, y] = coord;
      const distance = Math.sqrt((point[0] - x) ** 2 + (point[1] - y) ** 2);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== -1) {
      const closest_original = originaldata[closestIndex];
      return closest_original[2];
    }

    return null;
  };

  // Polygon
  const triangulatePolygon = (coordinates) => {
    const flattened = coordinates.flat(2);
    const triangles = earcut(flattened);
    return triangles;
  };

  const isPointTriangle = (px, py, ax, ay, bx, by, cx, cy) => {
    const v0x = cx - ax;
    const v0y = cy - ay;
    const v1x = bx - ax;
    const v1y = by - ay;
    const v2x = px - ax;
    const v2y = py - ay;

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return u >= 0 && v >= 0 && u + v < 1;
  };

  const interpolateZ_Polygon = (px, py, ax, ay, az, bx, by, bz, cx, cy, cz) => {
    const inputs = [px, py, ax, ay, az, bx, by, bz, cx, cy, cz];
    if (inputs.some((val) => !isFinite(val))) {
      console.error("Invalid input to interpolateZ_Polygon");
      return null;
    }

    const v0x = bx - ax;
    const v0y = by - ay;
    const v1x = cx - ax;
    const v1y = cy - ay;
    const v2x = px - ax;
    const v2y = py - ay;

    const d00 = v0x * v0x + v0y * v0y;
    const d01 = v0x * v1x + v0y * v1y;
    const d11 = v1x * v1x + v1y * v1y;
    const d20 = v2x * v0x + v2y * v0y;
    const d21 = v2x * v1x + v2y * v1y;

    const denom = d00 * d11 - d01 * d01;

    const v = (d11 * d20 - d01 * d21) / denom;
    const w = (d00 * d21 - d01 * d20) / denom;
    const u = 1 - v - w;

    const res = u * az + v * bz + w * cz;

    if (isNaN(res)) {
      console.error("NaN result in interpolateZ_Polygon");
      return null;
    }

    return res;
  };

  const getPolygonZ = (point, flatdata, polygon) => {
    const triangles = triangulatePolygon(flatdata.coordinates[0]);
    for (let i = 0; i < triangles.length; i += 3) {
      const a = polygon.coordinates[0][0][triangles[i]];
      const b = polygon.coordinates[0][0][triangles[i + 1]];
      const c = polygon.coordinates[0][0][triangles[i + 2]];

      if (
        isPointTriangle(point[0], point[1], a[0], a[1], b[0], b[1], c[0], c[1])
      ) {
        return interpolateZ_Polygon(
          point[0],
          point[1],
          a[0],
          a[1],
          a[2],
          b[0],
          b[1],
          b[2],
          c[0],
          c[1],
          c[2]
        );
      }
    }
    return null; // VERY RARE CASE WHERE NO POINT EXISTS
  };

  // Line
  const pointToLineDistance = (point, start, end) => {
    const [px, py] = point;
    const [sx, sy] = start;
    const [ex, ey] = end;

    const dx = ex - sx;
    const dy = ey - sy;
    const lsquared = dx * dx + dy * dy;

    if (lsquared === 0) return Math.sqrt((px - sx) ** 2 + (py - sy) ** 2);

    const t = ((px - sx) * dx + (py - sy) * dy) / lsquared;
    const clampedT = Math.max(0, Math.min(1, t));

    const closestX = sx + clampedT * dx;
    const closestY = sy + clampedT * dy;

    return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
  };

  const interpolateZ_Line = (point, start, end) => {
    const [px, py] = point;
    const [sx, sy, sz] = start;
    const [ex, ey, ez] = end;

    const inputs = [px, py, sx, sy, sz, ex, ey, ez];
    if (inputs.some((val) => !isFinite(val))) {
      console.error("Invalid input to interpolateZ_Line");
      return null;
    }

    const totalDist = Math.sqrt((ex - sx) ** 2 + (ey - sy) ** 2);
    const pointDist = Math.sqrt((px - sx) ** 2 + (py - sy) ** 2);

    const t = pointDist / totalDist;

    const res = sz + t * (ez - sz);

    if (isNaN(res)) {
      console.error("NaN result in interpolateZ_Line");
      return null;
    }

    return res;
  };

  const getLineZ = (point, flat, line) => {
    let closestSegment = null;
    let min = 2147483648;
    const flatdata = flat.coordinates[0];
    const lineString = line.coordinates[0];

    for (let i = 0; i < flatdata.length - 1; i++) {
      const start = flatdata[i];
      const end = flatdata[i + 1];

      const distance = pointToLineDistance(point, start, end);

      if (distance < min) {
        min = distance;
        closestSegment = { start, end };
      }
    }

    if (closestSegment) {
      const original_start = lineString.find(
        (coord) =>
          coord[0] === closestSegment.start[0] &&
          coord[1] === closestSegment.start[1]
      );

      const original_end = lineString.find(
        (coord) =>
          coord[0] === closestSegment.end[0] &&
          coord[1] === closestSegment.end[1]
      );

      if (original_start && original_end) {
        return interpolateZ_Line(point, original_start, original_end);
      }
    }

    return null; // NO CLOSEST SEGMENT ON LINE (CHANCES OF REACHING HERE IS ALMOST ZERO)
  };

  const handleSlopeCalc = (i) => {
    const data = layerIdToMdata[i.layer.id];
    if (!data) {
      console.error("Error: non existent layer for:", i.layer.id);
      return;
    }
    const originalFeature = data.mergedGJ.features.find(
      (f) => f.properties.id === i.object.properties.id
    );
    if (originalFeature) {
      if (i.layer.id === "b1_안전표지") {
        // console.log(
        //   "b1 z(etc):",
        //   findClosestVertexZ(
        //     i.coordinate,
        //     i.object.geometry,
        //     originalFeature.geometry
        //   )
        // );
        return findClosestVertexZ(
          i.coordinate,
          i.object.geometry,
          originalFeature.geometry
        );
      } else if (i.object.geometry.type === "MultiPolygon") {
        // console.log(
        //   "final z(polygon):",
        //   getPolygonZ(i.coordinate, i.object.geometry, originalFeature.geometry)
        // );
        return getPolygonZ(
          i.coordinate,
          i.object.geometry,
          originalFeature.geometry
        );
      } else if (i.object.geometry.type === "MultiLineString") {
        // console.log(
        //   "final z(line):",
        //   getLineZ(i.coordinate, i.object.geometry, originalFeature.geometry)
        // );
        return getLineZ(
          i.coordinate,
          i.object.geometry,
          originalFeature.geometry
        );
      } else {
        // console.log("final z(point):", originalFeature.geometry.coordinates[2]);
        return originalFeature.geometry.coordinates[2];
      }
    }
  };

  // --------------------------------------------------------------------------------------------------------------- //

  const circleboundL = useMemo(() => {
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
        lowerView.zoom >= 10,
    });
  }, [activeMenu, isFilter, lowerView.zoom, boundary]);

  const dmlayerA1 = useMemo(() => {
    if (!mdata || !mdata.A1) return null;

    return new GeoJsonLayer({
      id: "a1_주행노드",
      data: flattenData(mdata.A1),
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 3,
      getLineColor: [15, 19, 22],
      getFillColor: [117, 147, 169],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 15 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[0],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerA2 = useMemo(() => {
    if (!mdata || !mdata.A2) return null;

    return new GeoJsonLayer({
      id: "a2_주행링크",
      data: flattenData(mdata.A2),
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      getLineWidth: 700,
      getLineColor: [117, 147, 169],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 8 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[1],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerA3 = useMemo(() => {
    if (!mdata || !mdata.A3) return null;

    return new GeoJsonLayer({
      id: "a3_차도구간",
      data: flattenData(mdata.A3),
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      getLineWidth: 10,
      getLineColor: [0, 0, 0, 255 * 0.9],
      getFillColor: (d) => {
        switch (d.properties.roadtype) {
          case "1":
            return [213, 201, 156, 255 * 0.3];
          case "2":
            return [88, 167, 56, 255 * 0.3];
          case "3":
            return [112, 196, 191, 255 * 0.3];
          case "4":
            return [255, 255, 255, 255 * 0.2];
          case "5":
            return [0, 0, 0, 255 * 0.3];
          default:
            return [213, 201, 156, 255 * 0.3];
        }
      },
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 8 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[2],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerA4 = useMemo(() => {
    if (!mdata || !mdata.A4) return null;

    return new GeoJsonLayer({
      id: "a4_부속구간",
      data: flattenData(mdata.A4),
      extruded: false,
      getElevation: () => 0,
      depthTest: false,
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      getLineWidth: 1,
      getLineColor: (d) =>
        d.properties.subtype === "3" ? [0, 0, 0] : [255, 255, 255],
      getFillColor: (d) =>
        d.properties.subtype === "3" ? [45, 63, 80] : [76, 30, 23],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 8 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[3],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerA5 = useMemo(() => {
    if (!mdata || !mdata.A5) return null;

    return new GeoJsonLayer({
      id: "a5_주차면",
      data: flattenData(mdata.A5),
      lineWidthMaxPixels: 2,
      lineWidthMinPixels: 2,
      getLineWidth: 10,
      getLineColor: [46, 117, 182, 255 * 0.9],
      getFillColor: [0, 0, 0, 0],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 15 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[4],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerB1 = useMemo(() => {
    if (!mdata || !mdata.B1) return null;

    return new GeoJsonLayer({
      id: "b1_안전표지",
      data: flattenData(mdata.B1),
      lineWidthMaxPixels: 3,
      lineWidthMinPixels: 3,
      getLineWidth: 10,
      getLineColor: (d) => {
        switch (d.properties.type) {
          case "1":
            return [250, 175, 24];
          case "2":
            return [1, 84, 160, 255 * 0.8];
          case "3":
            return [230, 0, 60];
          case "4":
            return [10, 10, 10];
          default:
            return [250, 175, 24];
        }
      },
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 16 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[9],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerB2 = useMemo(() => {
    if (!mdata || !mdata.B2) return null;

    return new GeoJsonLayer({
      id: "b2_노면선표지",
      data: flattenData(mdata.B2),
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      getLineWidth: 100,
      getLineColor: [255, 255, 255, 255 * 1],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 8 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[5],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerB3 = useMemo(() => {
    if (!mdata || !mdata.B3) return null;

    return new GeoJsonLayer({
      id: "b3_횡단보도",
      data: flattenData(mdata.B3),
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      getLineWidth: 10,
      getLineColor: [0, 0, 0, 255 * 0.9],
      getFillColor: (d) =>
        d.properties.type === "1"
          ? [112, 196, 191]
          : [250, 250, 250, 255 * 0.8],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 16 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[6],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerC1 = useMemo(() => {
    if (!mdata || !mdata.C1) return null;

    return new GeoJsonLayer({
      id: "c1_신호등",
      data: flattenData(mdata.C1),
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 5,
      getLineColor: [0, 0, 0, 255 * 0.75],
      getFillColor: [247, 255, 127],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 16 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[7],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerC2 = useMemo(() => {
    if (!mdata || !mdata.C2) return null;

    return new GeoJsonLayer({
      id: "c2_킬로포스트",
      data: flattenData(mdata.C2),
      lineWidthMaxPixels: 2,
      lineWidthMinPixels: 2,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 5,
      getLineColor: [0, 0, 0, 255 * 0.8],
      getFillColor: [255, 255, 255, 255 * 0.8],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 16 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[8],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerC3 = useMemo(() => {
    if (!mdata || !mdata.C3) return null;

    return new GeoJsonLayer({
      id: "c3_차량방호",
      data: flattenData(mdata.C3),
      lineWidthMaxPixels: 3,
      lineWidthMinPixels: 3,
      getLineWidth: 700,
      getLineColor: [191, 238, 179],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 8 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[11],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerC4 = useMemo(() => {
    if (!mdata || !mdata.C4) return null;

    return new GeoJsonLayer({
      id: "c4_과속방지턱",
      data: flattenData(mdata.C4),
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      getLineWidth: 10,
      getLineColor: [0, 0, 0, 255 * 0.9],
      getFillColor: [255, 181, 0, 255 * 0.8],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 16 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[13],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerC5 = useMemo(() => {
    if (!mdata || !mdata.C5) return null;

    return new GeoJsonLayer({
      id: "c5_높이장애물",
      data: flattenData(mdata.C5),
      lineWidthMaxPixels: 3,
      lineWidthMinPixels: 1,
      getLineWidth: 10,
      getLineColor: [220, 173, 173],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 16 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[12],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const dmlayerC6 = useMemo(() => {
    if (!mdata || !mdata.C6) return null;

    return new GeoJsonLayer({
      id: "c6_지주",
      data: flattenData(mdata.C6),
      lineWidthMaxPixels: 1,
      lineWidthMinPixels: 1,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 5,
      getLineColor: [0, 0, 0, 255 * 0.75],
      getFillColor: [0, 146, 82],
      pickable: true,
      autoHighlight: false,
      visible:
        activeMenu === "star" &&
        lowerView.zoom >= 16 &&
        isFilter &&
        depth1 === "별점평가" &&
        dmlayerVisibility[10],
      onClick: (i) => {
        console.log(i);
      },
    });
    //eslint-disable-next-line
  }, [depth1, isFilter, lowerView.zoom, dmlayerVisibility, activeMenu, mdata]);

  const turfLayer1 = useMemo(() => {
    if (!toolbox) return null;

    const allPoints = [...points];
    if (mousePos) {
      allPoints.push(mousePos);
    }

    return new ScatterplotLayer({
      id: "dpoints",
      data: allPoints,
      getPosition: (d) => d,
      stroked: true,
      lineWidthScale: 9,
      lineWidthMaxPixels: 4,
      lineWidthMinPixels: 2,
      radiusMinPixels: 2,
      radiusMaxPixels: 8,
      getLineColor: distMode
        ? [220, 77, 77, 255 * 0.9]
        : [77, 77, 220, 255 * 0.9],
      getFillColor: [222, 222, 222],
      pickable: false,
    });
  }, [distMode, points, toolbox, mousePos]);

  const turfLayer2 = useMemo(() => {
    if (!toolbox || points.length < 1) return null;

    const lineData = points.slice(0, -1).map((point, i) => ({
      source: point,
      target: points[i + 1],
    }));

    if (mousePos && points.length > 0) {
      lineData.push({
        source: points[points.length - 1],
        target: mousePos,
      });
    }

    return new LineLayer({
      id: "dlines",
      data: lineData,
      getSourcePosition: (d) => d.source,
      getTargetPosition: (d) => d.target,
      getWidth: 4,
      getColor: distMode
        ? [255, 121, 121, 255 * 0.9]
        : [121, 121, 255, 255 * 0.9],
    });
  }, [distMode, points, toolbox, mousePos]);

  const dmlayers = [
    // 순서대로 렌더링 됨 (z-index 조절 가능)
    circleboundL,
    dmlayerA3,
    dmlayerA4,
    dmlayerA1,
    dmlayerB3,
    dmlayerA5,
    dmlayerC4,
    dmlayerC3,
    dmlayerB2,
    dmlayerA2,
    dmlayerB1,
    dmlayerC5,
    dmlayerC2,
    dmlayerC1,
    dmlayerC6,
    turfLayer2,
    turfLayer1,
  ];

  const resetTools = () => {
    setPoints([]);
    setPointZs([]);
    setDistance(0);
    setSlope(0);
    setTSselecting(true);
  };

  const toggleTools = (mode) => {
    if (mode === "dist") {
      if (distMode) {
        showToolbox(false);
        setDistMode(false);
        setSlopeMode(false);
      } else {
        showToolbox(true);
        setDistMode(true);
        setSlopeMode(false);
      }
    } else if (mode === "slope") {
      if (slopeMode) {
        showToolbox(false);
        setDistMode(false);
        setSlopeMode(false);
      } else {
        showToolbox(true);
        setDistMode(false);
        setSlopeMode(true);
      }
    }

    resetTools();
  };

  const handlePointFollow = (event) => {
    if (!toolbox || (slopeMode && points.length > 1)) return;
    const { coordinate } = event;
    setMousePos(coordinate);
  };

  const handlePointClick = (i) => {
    if ((slopeMode && !i.layer) || !toolbox) return;

    if (toolbox_selecting) {
      if (slopeMode && points.length >= 2) {
        setPoints([i.coordinate]);
        setPointZs([handleSlopeCalc(i)]);
        setDistance(0);
        setSlope(0);
      } else {
        setPoints((prev) => {
          const newPoints = [...prev, i.coordinate];
          if (newPoints.length > (slopeMode ? 2 : 5)) {
            newPoints.shift();
          }
          setMousePos(null);
          return newPoints;
        });

        if (slopeMode) {
          setPointZs((prev) => {
            const newZs = [...prev, handleSlopeCalc(i)];
            if (newZs.length > 2) {
              newZs.shift();
            }
            setMousePos(null);
            return newZs;
          });
        }
      }
    }
  };

  const calculateSlope = (length, z1, z2) => {
    const deltaZ = z2 - z1;
    const slope = (deltaZ / length) * 100;

    return Math.abs(slope);
  };

  useEffect(() => {
    if (points.length > 1) {
      const line = turf.lineString(points);
      const length = turf.length(line, { units: "meters" });

      if (distMode) {
        setDistance(length);
      } else if (slopeMode) {
        setDistance(length);
        setSlope(calculateSlope(length, pointZs[0], pointZs[1]));
      }
    }
  }, [distMode, slopeMode, points, pointZs]);

  const [cursor, setCursor] = useState("default");
  const [tooltipPos, setTooltipPos] = useState([]);

  const hoverHandle = (e) => {
    if (toolbox) {
      setCursor("crosshair");
    } else {
      setCursor("default");
    }
    if (toolbox_selecting) handlePointFollow(e);

    if (slopeMode && e.coordinate && e.layer) {
      setTooltipPos([e.x, e.y]);
    } else setTooltipPos([]);
  };

  const toggleVisibility = (index) => {
    setDMLayerVisibility((prev) =>
      prev.map((visibility, i) => (i === index ? !visibility : visibility))
    );
  };

  const [subLegend, setSubLegend] = useState(0);
  const toggleSubLegend = (i) => {
    switch (i) {
      case 2:
        setSubLegend(1);
        break;
      case 3:
        setSubLegend(2);
        break;
      case 6:
        setSubLegend(4);
        break;
      case 9:
        setSubLegend(3);
        break;
      default:
        setSubLegend(0);
    }
  };

  ///////////////////////////////////////////////////////////////////////

  const legendItems = [
    {
      name: "주행경로노드",
      color: dmlayerVisibility[0] ? "rgba(117, 147, 169, 1)" : "rgba(0,0,0,0)",
      width: "8px",
      height: "8px",
      border: "none",
      borderRadius: "12px",
    },
    {
      name: "주행경로링크",
      color: dmlayerVisibility[1] ? "rgba(117, 147, 169, 1)" : "rgba(0,0,0,0)",
      width: "20px",
      height: "2px",
      border: "none",
      borderRadius: "0px",
    },
    {
      name: "차도구간",
      color: dmlayerVisibility[2]
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(0,0,0,0)",
      width: "20px",
      height: "20px",
      border: dmlayerVisibility[2]
        ? "1px solid gray"
        : "1px solid rgba(0,0,0,0)",
      borderRadius: "0px",
    },
    {
      name: "부속구간",
      color: dmlayerVisibility[3] ? "rgba(45, 63, 80, 1)" : "rgba(0,0,0,0)",
      width: "20px",
      height: "20px",
      border: dmlayerVisibility[3]
        ? "1px solid gray"
        : "1px solid rgba(0,0,0,0)",
      borderRadius: "0px",
    },
    {
      name: "주차면",
      color: dmlayerVisibility[4] ? "rgba(0,0,0,0)" : "rgba(0,0,0,0)",
      width: "19px",
      height: "19px",
      border: dmlayerVisibility[4]
        ? "2px solid rgb(46, 117, 182)"
        : "2px solid rgba(0, 0, 0, 0)",
      borderRadius: "0px",
    },
    {
      name: "노면선표시",
      color: dmlayerVisibility[5] ? "rgba(255,255,255, 0.9)" : "rgba(0,0,0,0)",
      width: "20px",
      height: "2px",
      border: "none",
      borderRadius: "0px",
    },
    {
      name: "횡단보도/노면표시",
      color: dmlayerVisibility[6] ? "rgba(255,255,255, 0.9)" : "rgba(0,0,0,0)",
      width: "20px",
      height: "20px",
      borderRadius: "0px",
    },
    {
      name: "신호등",
      color: dmlayerVisibility[7] ? "rgba(247, 255, 127, 1)" : "rgba(0,0,0,0)",
      width: "12px",
      height: "12px",
      border: "none",
      borderRadius: "12px",
    },
    {
      name: "킬로포스트",
      color: dmlayerVisibility[8] ? "rgba(255, 255, 255, 1)" : "rgba(0,0,0,0)",
      width: "10px",
      height: "10px",
      border: dmlayerVisibility[8]
        ? "1px solid black"
        : "1px solid rgba(0,0,0,0)",
      borderRadius: "12px",
    },
    {
      name: "안전표지",
      color: dmlayerVisibility[9] ? "rgba(230, 0, 60, 1)" : "rgba(0,0,0,0)",
      width: "20px",
      height: "5px",
      border: "none",
      borderRadius: "0px",
    },
    {
      name: "지주",
      color: dmlayerVisibility[10] ? "rgba(0, 146, 82, 1)" : "rgba(0,0,0,0)",
      width: "10px",
      height: "10px",
      border: "none",
      borderRadius: "12px",
    },
    {
      name: "차량방호안전시설",
      color: dmlayerVisibility[11] ? "rgba(191, 238, 179, 1)" : "rgba(0,0,0,0)",
      width: "20px",
      height: "3px",
      border: "none",
      borderRadius: "0px",
    },
    {
      name: "높이장애물",
      color: dmlayerVisibility[12] ? "rgba(220, 173, 173, 1)" : "rgba(0,0,0,0)",
      width: "20px",
      height: "3px",
      border: "none",
      borderRadius: "0px",
    },
    {
      name: "과속방지턱",
      color: dmlayerVisibility[13] ? "rgba(255, 181, 0, 1)" : "rgba(0,0,0,0)",
      width: "20px",
      height: "20px",
      borderRadius: "0px",
    },
  ];

  const subLegendItems = [
    [
      {
        name: "일반도로",
        color: "rgba(213, 201, 156, 0.3)",
        width: "20px",
        height: "20px",
        border: "1px solid gray",
        borderRadius: "0px",
      },
      {
        name: "터널",
        color: "rgba(88, 167, 56, 0.3)",
        width: "20px",
        height: "20px",
        border: "1px solid gray",
        borderRadius: "0px",
      },
      {
        name: "교량",
        color: "rgba(112, 196, 191, 0.3)",
        width: "20px",
        height: "20px",
        border: "1px solid gray",
        borderRadius: "0px",
      },
      {
        name: "지하도로",
        color: "rgba(255, 255, 255, 0.2)",
        width: "20px",
        height: "20px",
        border: "1px solid gray",
        borderRadius: "0px",
      },
      {
        name: "고가도로",
        color: "rgba(0, 0, 0, 0.3)",
        width: "20px",
        height: "20px",
        border: "1px solid gray",
        borderRadius: "0px",
      },
    ],
    [
      {
        name: "보도",
        color: "rgb(45, 63, 80)",
        width: "20px",
        height: "20px",
        border: "1px solid rgba(19, 50, 80)",
        borderRadius: "0px",
      },
      {
        name: "자전거도로",
        color: "rgb(76, 30, 23)",
        width: "20px",
        height: "20px",
        border: "1px solid rgba(255,255,255)",
        borderRadius: "0px",
      },
    ],
    [
      {
        name: "주의표지",
        color: "rgba(250, 175, 24)",
        width: "20px",
        height: "5px",
        border: "none",
        borderRadius: "0px",
      },
      {
        name: "지시표지",
        color: "rgba(1, 84, 160, 0.8)",
        width: "20px",
        height: "5px",
        border: "none",
        borderRadius: "0px",
      },
      {
        name: "규제표지",
        color: "rgba(208, 30, 37)",
        width: "20px",
        height: "5px",
        border: "none",
        borderRadius: "0px",
      },
      {
        name: "보조표지",
        color: "rgba(10, 10, 10)",
        width: "20px",
        height: "5px",
        border: "none",
        borderRadius: "0px",
      },
    ],
    [
      {
        name: "횡단보도",
        color: "rgba(250, 250, 250, 0.8)",
        width: "20px",
        height: "20px",
        borderRadius: "0px",
      },
      {
        name: "노면표시",
        color: "rgba(112, 196, 191)",
        width: "20px",
        height: "20px",
        borderRadius: "0px",
      },
    ],
  ];

  ///////////////////////////////////////////////////////////////////////

  return (
    <div className="lower_container" style={{ height: `${bottomHeight}vh` }}>
      <div>
        <Basemap devMode={devMode} />
        <button
          className="slope_button"
          onClick={() => toggleTools("slope")}
          style={{
            left: menuToggle ? "240px" : "20px",
            bottom: toolbox ? "120px" : "70px",
            opacity: slopeMode ? "0.5" : "",
            visibility: bottomHeight < 9 ? "hidden" : "",
          }}
        >
          <img src={slope_icon} alt="경사도 측정" className="slope_tool" />
          <span className="slope-text">경사도 측정</span>
        </button>
        <button
          className="tool_button"
          onClick={() => toggleTools("dist")}
          style={{
            left: menuToggle ? "240px" : "20px",
            bottom: toolbox ? "70px" : "20px",
            backgroundColor: distMode ? "rgba(255,255,255,0.5)" : "",
            visibility: bottomHeight < 5 ? "hidden" : "",
          }}
        >
          <TbRulerMeasure />
          <span className="dist-text">거리 측정</span>
        </button>
        {toolbox && (
          <button
            className="tool_undo_button"
            onClick={() => {
              resetTools();
            }}
            style={{
              left: menuToggle ? "240px" : "20px",
              visibility: bottomHeight < 5 ? "hidden" : "",
            }}
          >
            <FaUndo />
          </button>
        )}
        <div className="legend" style={{ right: RBtoggle ? "430px" : "20px" }}>
          {legendItems.map((item, index) => (
            <div key={index} className="legend-item" style={{ width: "100%" }}>
              <div
                style={{
                  width: "20%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  className="legend-color"
                  style={{
                    backgroundColor: item.color,
                    width: item.width,
                    height: item.height,
                    border: item.border,
                    borderRadius: item.borderRadius,
                    marginBottom:
                      index === 1 || index === 4 || index === 6 || index === 9
                        ? "11px"
                        : "",
                  }}
                  onClick={() => toggleVisibility(index)}
                  onMouseEnter={() => toggleSubLegend(index)}
                  onMouseLeave={() => setSubLegend(0)}
                ></div>
              </div>
              <div style={{ width: "85%" }}>
                <span
                  className="dm-legendname"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => toggleVisibility(index)}
                  onMouseEnter={() => toggleSubLegend(index)}
                  onMouseLeave={() => setSubLegend(0)}
                >
                  {item.name}
                </span>
                {(index === 1 || index === 4 || index === 6 || index === 9) && (
                  <div
                    className="legend_midline"
                    style={{
                      position: "relative",
                      left: "-20%",
                      width: "110%",
                      height: "1%",
                      border: "1px solid #cccccc",
                      marginTop: "5px",
                      marginBottom: "1px",
                    }}
                  ></div>
                )}
              </div>
            </div>
          ))}
        </div>
        {subLegend && (
          <div
            className="sub-legend"
            style={{ right: RBtoggle ? "610px" : "210px" }}
          >
            {subLegendItems[subLegend - 1].map((item, index) => (
              <div key={index} className="sub-legend-item">
                <div
                  className="sub-legend-color"
                  style={{
                    backgroundColor: item.color,
                    width: item.width,
                    height: item.height,
                    marginRight: item.marginRight,
                    border: item.border,
                    borderRadius: item.borderRadius,
                    boxSizing: "border-box",
                  }}
                ></div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}

        {toolbox && (
          <div
            className="distSum"
            style={{
              right: RBtoggle ? "430px" : "20px",
              visibility: bottomHeight < 5 ? "hidden" : "",
            }}
          >
            {distMode ? "선택구간 측정 길이 " : "선택구간 측정 경사 "}
            <span>
              {distMode
                ? distance === 0
                  ? "0"
                  : distance > 1000
                  ? (distance / 1000).toFixed(2)
                  : distance.toFixed(2)
                : slope === 0
                ? "0"
                : slope.toFixed(2)}
            </span>
            {distMode ? (distance > 1000 ? " km" : " m") : " %"}
          </div>
        )}

        <DeckGL
          initialViewState={lowerView}
          onViewStateChange={({ viewState }) => {
            setLowerView(viewState);
          }}
          controller={{ dragRotate: false }}
          layers={dmlayers}
          onClick={(i) => handlePointClick(i)}
          onHover={(e) => hoverHandle(e)}
          getCursor={() => cursor}
          // getTooltip={(info) =>
          //   getTooltip(
          //     info,
          //     slopeMode,
          //     distance,
          //     bottomHeight,
          //     pointZs[0] - pointZs[1]
          //   )
          // }
        >
          <Map
            mapStyle={"mapbox://styles/mapbox/dark-v11"}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          />
          {tooltipPos.length && (
            <div
              className="custom_tooltip"
              style={{
                position: "absolute",
                width: "max-content",
                height: "auto",
                backgroundColor: "rgba(233, 233, 255, 1)",
                borderRadius: "0",
                border: "solid 2px #cccccc",
                boxShadow: "0px 0px 2px 2px rgba(0, 0, 0, 0.1)",
                padding: "5px 8px",
                color: "#333333",
                fontWeight: "bold",
                fontSize: "1rem",
                lineHeight: "2",
                top: `${tooltipPos[1]}px`,
                left: `${tooltipPos[0]}px`,
              }}
            >
              {`측정 거리: ${distance === 0 ? "0" : distance.toFixed(2)} m`}
              <br />
              {`측정 고도 차이: ${
                pointZs[0] - pointZs[1] === 0 || !(pointZs[0] - pointZs[1])
                  ? "0"
                  : (pointZs[0] - pointZs[1]).toFixed(2)
              } m`}
            </div>
          )}
        </DeckGL>
      </div>
    </div>
  );
};

export default DetailMap;
