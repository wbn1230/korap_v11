const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

require("log-timestamp")(function () {
  const date = new Date();
  const options = { timeZone: "Asia/Seoul", hour12: false };
  const timestamp = date.toLocaleString("en-US", options).replace(",", "");

  return `${timestamp} %s`;
});

app.use(cors());
app.use(express.json());

//--------------------------------------------------------------------------------------
const dbRequest = require("./lib/dbrequest");
const staticRequest = {
  getRoadAll2: async function () {
    return await dbRequest.getRoadAll2();
  },
  getEmi: async function () {
    return await dbRequest.getEmi();
  },
  getVp: async function () {
    return await dbRequest.getVp();
  },
  getPp: async function () {
    return await dbRequest.getPp();
  },
  getBp: async function () {
    return await dbRequest.getBp();
  },
  getLp: async function () {
    return await dbRequest.getLp();
  },
  getNp: async function () {
    return await dbRequest.getNp();
  },
  getRp: async function (roadNo) {
    return await dbRequest.getRp(roadNo);
  },
  /////////////////////////////////////////// new db
  getL1: async function () {
    return await dbRequest.getL1();
  },
  getN1: async function () {
    return await dbRequest.getN1();
  },
};
// 정밀지도

const dynamicLayerNames = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "B1",
  "B2",
  "B3",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
];

const requestType = { ...staticRequest };

dynamicLayerNames.forEach((layer) => {
  requestType[`get${layer}`] = async function (midpoint) {
    return await dbRequest[`get${layer}`](midpoint);
  };
});

//--------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////

app.get("/nationalroad", async (req, res) => {
  try {
    const rtrvd = await staticRequest["getRoadAll2"]();
    console.log("nationalroad fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching nationalroad");
  }
});

app.get("/emi", async (req, res) => {
  try {
    const rtrvd = await staticRequest["getEmi"]();
    console.log("emi fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching emi");
  }
});

app.get("/vp", async (req, res) => {
  try {
    const rtrvd = await staticRequest["getVp"]();
    console.log("vpfetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching vp");
  }
});

app.get("/pp", async (req, res) => {
  try {
    const rtrvd = await staticRequest["getPp"]();
    console.log("ppfetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching pp");
  }
});

app.get("/bp", async (req, res) => {
  try {
    const rtrvd = await staticRequest["getBp"]();
    console.log("bpfetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching bp");
  }
});

////////////////////////////////////////////////////////////////////////////////////////
app.get("/lp", async (req, res) => {
  try {
    const rtrvd = await staticRequest["getLp"]();
    console.log("lpfetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching lp");
  }
});

app.get("/np", async (req, res) => {
  try {
    const rtrvd = await staticRequest["getNp"]();
    console.log("npfetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching np");
  }
});

app.get("/riskprofile/:roadNo", async (req, res) => {
  try {
    const roadNo = req.params.roadNo;
    const rtrvd = await staticRequest["getRp"](roadNo);
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////////////
app.get("/l1", async (req, res) => {
  try {
    const rtrvd = await staticRequest["getL1"]();
    console.log("l1fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching l1");
  }
});

app.get("/n1", async (req, res) => {
  try {
    const rtrvd = await staticRequest["getN1"]();
    console.log("n1fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching n1");
  }
});

app.get("/a1/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getA1"](midpoint);
    // console.log("a1 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching a1");
  }
});

app.get("/a2/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getA2"](midpoint);
    // console.log("a2 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching a2");
  }
});

app.get("/a3/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getA3"](midpoint);
    // console.log("a3 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching a3");
  }
});

app.get("/a4/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getA4"](midpoint);
    // console.log("a4 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching a4");
  }
});

app.get("/a5/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getA5"](midpoint);
    // console.log("a5 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching a5");
  }
});

app.get("/b1/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getB1"](midpoint);
    // console.log("b1 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching b1");
  }
});

app.get("/b2/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getB2"](midpoint);
    // console.log("b2 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching b2");
  }
});

app.get("/b3/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getB3"](midpoint);
    // console.log("b3 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching b3");
  }
});

app.get("/c1/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getC1"](midpoint);
    // console.log("c1 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching c1");
  }
});

app.get("/c2/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getC2"](midpoint);
    // console.log("c2 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching c2");
  }
});

app.get("/c3/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getC3"](midpoint);
    // console.log("c3 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching c3");
  }
});

app.get("/c4/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getC4"](midpoint);
    // console.log("c4 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching c4");
  }
});

app.get("/c5/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getC5"](midpoint);
    // console.log("c5 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching c5");
  }
});

app.get("/c6/:midpoint", async (req, res) => {
  try {
    const midpoint = req.params.midpoint;
    const rtrvd = await requestType["getC6"](midpoint);
    // console.log("c6 fetched");
    res.send(rtrvd);
  } catch (err) {
    console.error(err);
    res.status(500).send("error fetching c6");
  }
});

////////////////////////////////////////////////////////////////////////////////////////
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "./build");
app.use(express.static(buildPath));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("server started");
});
