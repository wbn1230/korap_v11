const myDB = require("../config/config");
const { Pool } = require("pg");

// CONNECTION -----------------------------------------------------
const dbconn = () => {
  const client = new Pool(myDB.dbConfig);
  return client;
};
const dbconnBeta = () => {
  const clientBeta = new Pool(myDB.dbConfigBeta);
  return clientBeta;
};
const client = dbconn();
const clientBeta = dbconnBeta();
// HELPERS -----------------------------------------------------
const tables = {
  road: "public.national_road_100",
  emi: "taas_emi",
  vpoint: "taas_vehicle_n103",
  ppoint: "taas_pedestrian_n103",
  bpoint: "taas_bicycle_n103",
  roadacc: "lp",
  icacc: "np",
  risk: "riskprofile",
  l1: "main.merged_link_l1",
  l2: "main.homogeneous_link_l2",
  l3: "main.regular_link_l3",
  l4: "main.riskprofile_l4",
  n1: "main.node_properties_n1",
  n2: "main.node_risk_n2",
  a1: "detailmap.a1_node",
  a2: "detailmap.a2_link",
  a3: "detailmap.a3_drivewaysection",
  a4: "detailmap.a4_subsidarysection",
  a5: "detailmap.a5_parkinglot",
  b1: "detailmap.b1_safetysign",
  b2: "detailmap.b2_surfacelinemark",
  b3: "detailmap.b3_surfacemark",
  c1: "detailmap.c1_trafficlight",
  c2: "detailmap.c2_kilopost",
  c3: "detailmap.c3_vehicleprotection",
  c4: "detailmap.c4_speedbump",
  c5: "detailmap.c5_heightbarrier",
  c6: "detailmap.c6_postpoint",
};
const toGeoJson = (sqlRows) => {
  const obj = {
    mergedGJ: {
      type: "FeatureCollection",
      features: [],
    },
  };
  sqlRows.map(function (row) {
    row.UID = row.uid;
    delete row.uid;
    let objRow = { type: "Feature" };
    const { geom_json, ...properties } = row;
    objRow.properties = properties;
    objRow.geometry = geom_json;
    obj.mergedGJ.features.push(objRow);
  });
  return obj;
};

// REQUEST METHODS - 일반국도현황 -----------------------------------------------------------
const getRoadAll2 = async () => {
  const qry = `SELECT uid, oneway, width, road_no, auto_exclu, num_cross, barrier, max_spd, facil_kind, length, geom_json FROM ${tables["road"]}`;
  try {
    const result = await client.query(qry);
    // console.log(result);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};
const getEmi = async () => {
  const qry = `SELECT geom_json, length, road_name, n103_fid, emi_v, fa_co_v, si_co_v, li_co_v, ri_co_v, emi_p, fa_co_p, si_co_p, li_co_p, ri_co_p, emi_b, fa_co_b, si_co_b, li_co_b, ri_co_b FROM ${tables["emi"]}`;
  try {
    const result = await client.query(qry);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};
const getVp = async () => {
  const qry = `SELECT id, geom_json, n103_uid, acdnt_sev, acdnt_type, road_type, tmzon, weather, acdnt_date FROM ${tables["vpoint"]}`;
  try {
    const result = await client.query(qry);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};
const getPp = async () => {
  const qry = `SELECT id, geom_json, n103_uid, acdnt_sev, acdnt_type, road_type, tmzon, weather, acdnt_date FROM ${tables["ppoint"]}`;
  try {
    const result = await client.query(qry);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};
const getBp = async () => {
  const qry = `SELECT id, geom_json, n103_uid, acdnt_sev, acdnt_type, road_type, tmzon, weather, acdnt_date FROM ${tables["bpoint"]}`;
  try {
    const result = await client.query(qry);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};
// REQUEST METHODS - 사고위험지도 -----------------------------------------------------------
const getLp = async () => {
  const qry = `SELECT uid, geom_json, fromnodeid, tonodeid, length_l1, l_aadt, l_car_abs, l_car_bi_1, l_car_bi_2, l_ped_abs, l_ped_bi_1, l_ped_bi_2, l_cyc_abs, l_cyc_bi_1, l_cyc_bi_2, road_no FROM ${tables["roadacc"]}`;
  try {
    const result = await client.query(qry);
    // console.log(result);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};

const getNp = async () => {
  const qry = `SELECT uid, geom_json, node_id, uid_l1, n_car_ai, n_car_bi_1, n_car_bi_2, n_ped_ai, n_ped_bi_1, n_ped_bi_2, n_cyc_ai, n_cyc_bi_1, n_cyc_bi_2, "DP_ROAD_NO", "DP_UID_L3" FROM ${tables["icacc"]}`;
  try {
    const result = await client.query(qry);
    // console.log(result);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};

const getRp = async (roadNo) => {
  const qry = `SELECT "UID_L3", id_l3, uid_l1, road_name, geom_json, length, elevation, slope, road_no, width, facil_kind, max_spd, barrier, num_cross, auto_exclu, oneway, fromnodeid, tonodeid, l_car_abs, l_car_bi_1, l_car_bi_2, l_ped_abs, l_ped_bi_1, l_ped_bi_2, l_cyc_abs, l_cyc_bi_1, l_cyc_bi_2, "CRP_V", "CRP_P", "CRP_B"
  FROM ${tables["risk"]}
  WHERE road_no = $1`;
  try {
    const result = await client.query(qry, [roadNo]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};

// REQUEST METHODS - NEW DATABASE -----------------------------------------------------------

// 사고위험도, 속성
const getL1 = async () => {
  const qry = `SELECT uid, obreg_dt, geom_json, road_no, fromnodeid, tonodeid, length_l1, l_car_abs, l_car_bi_1, l_car_bi_2, l_ped_abs, l_ped_bi_1, l_ped_bi_2, l_cyc_abs, l_cyc_bi_1, l_cyc_bi_2 FROM ${tables["l1"]}`;
  try {
    const result = await clientBeta.query(qry);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};

const getN1 = async () => {
  const qry = `SELECT n1.uid, n1.obreg_dt, n1.node_name, n1.traffic_light, n1.approaches, n1.aadt_pre_n, n1.geom_json, n2.uid AS uid_n4, n2.n_car_ai, n2.n_car_bi_1, n2.n_car_bi_2, n2.n_ped_ai, n2.n_ped_bi_1, n2.n_ped_bi_2, n2.n_cyc_ai, n2.n_cyc_bi_1, n2.n_cyc_bi_2, n2.l_roadno, n2.l_uid_l3 
    FROM ${tables["n1"]} n1
    LEFT JOIN ${tables["n2"]} n2 ON n1.uid = n2.uid_n1`;
  try {
    const result = await clientBeta.query(qry);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log(err);
  }
};

// 정밀지도
const getA1 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, nodetype, geom_json
    FROM ${tables["a1"]}, center
    WHERE ST_DWithin(
      ${tables["a1"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getA2 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, roadrank, roadtype, roadno, linktype, laneno, length, geom_json
    FROM ${tables["a2"]}, center
    WHERE ST_DWithin(
      ${tables["a2"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getA3 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, kind, roadtype, geom_json
    FROM ${tables["a3"]}, center
    WHERE ST_DWithin(
      ${tables["a3"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getA4 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, subtype, direction, gasstation, lpgstation, evcharger, toilet, geom_json
    FROM ${tables["a4"]}, center
    WHERE ST_DWithin(
      ${tables["a4"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getA5 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, type, geom_json
    FROM ${tables["a5"]}, center
    WHERE ST_DWithin(
      ${tables["a5"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getB1 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, type, ref_lane, geom_json
    FROM ${tables["b1"]}, center
    WHERE ST_DWithin(
      ${tables["b1"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getB2 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, type, kind, geom_json
    FROM ${tables["b2"]}, center
    WHERE ST_DWithin(
      ${tables["b2"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getB3 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, type, kind, geom_json
    FROM ${tables["b3"]}, center
    WHERE ST_DWithin(
      ${tables["b3"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getC1 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, type, ref_lane, geom_json
    FROM ${tables["c1"]}, center
    WHERE ST_DWithin(
      ${tables["c1"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getC2 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, distance, ref_lane, geom_json
    FROM ${tables["c2"]}, center
    WHERE ST_DWithin(
      ${tables["c2"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getC3 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, type, iscentral, lowhigh, geom_json
    FROM ${tables["c3"]}, center
    WHERE ST_DWithin(
      ${tables["c3"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getC4 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, type, ref_lane, geom_json
    FROM ${tables["c4"]}, center
    WHERE ST_DWithin(
      ${tables["c4"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getC5 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, type, ref_lane, geom_json
    FROM ${tables["c5"]}, center
    WHERE ST_DWithin(
      ${tables["c5"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

const getC6 = async (midpoint) => {
  if (!midpoint) {
    throw new Error("Midpoint is null");
  }
  const txt = midpoint.split(",");
  const [lon, lat] = [txt[0], txt[1]];
  const qry = `
    WITH center AS (
      SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326) AS geom
    )
    SELECT uid, id, type, geom_json
    FROM ${tables["c6"]}, center
    WHERE ST_DWithin(
      ${tables["c6"]}.geom_geog,
      center.geom::geography,
      500
    );
  `;
  try {
    const result = await clientBeta.query(qry, [lon, lat]);
    return toGeoJson(result.rows);
  } catch (err) {
    console.log("Error executing query:", err);
    throw err;
  }
};

module.exports = {
  getRoadAll2: getRoadAll2,
  getEmi: getEmi,
  getVp: getVp,
  getPp: getPp,
  getBp: getBp,
  getLp: getLp,
  getNp: getNp,
  getRp: getRp,

  /////////////new db
  getL1: getL1,
  getN1: getN1,

  getA1: getA1,
  getA2: getA2,
  getA3: getA3,
  getA4: getA4,
  getA5: getA5,
  getB1: getB1,
  getB2: getB2,
  getB3: getB3,
  getC1: getC1,
  getC2: getC2,
  getC3: getC3,
  getC4: getC4,
  getC5: getC5,
  getC6: getC6,
};
