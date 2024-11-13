import { createContext, useState } from "react";

const InfoContext = createContext();

function InfoProvider({ children }) {
  const [info, setInfo] = useState({
    roadNo: { name: "국도번호", selected: [] },
    laneOps: { name: "차로수", selected: [], checkboxes: [] },
    facilOps: { name: "교통시설물", selected: [], checkboxes: [] },
    speedOps: { name: "제한속도", selected: [], checkboxes: [] },
    barrierOps: { name: "중앙분리대유형", selected: [], checkboxes: [] },
    lightOps: { name: "신호등개수", selected: [], checkboxes: [] },
    caronlyOps: { name: "자동차전용도로유무", selected: [], checkboxes: [] },
    onewayOps: { name: "일방통행유무", selected: [], checkboxes: [] },
  });

  const INITIAL_VIEW_STATE = {
    longitude: 127.2,
    latitude: 37.0,
    zoom: 6.920000000000002,
    bearing: 0,
    pitch: 0,
    maxZoom: 19.8,
    minZoom: 5.5,
  };

  const [taasInfo, setTaasInfo] = useState([]);
  const [tmsInfo, setTmsInfo] = useState([]);
  const [tmsdInfo, setTmsdInfo] = useState([]);

  const [depth1, setDepth1] = useState(null);
  const [depth2, setDepth2] = useState(null);

  const [isSelect, setIsSelect] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  const [view, setView] = useState(INITIAL_VIEW_STATE);
  const [lowerView, setLowerView] = useState(INITIAL_VIEW_STATE);
  const [LD, setLD] = useState(false);
  const [data, setData] = useState({ nroad: null, emiroad: null });
  const [rdata, setRdata] = useState(null);
  const [idata, setIdata] = useState(null);
  const [pdata, setPdata] = useState({});

  const [mdata, setMdata] = useState({
    A1: null,
    A2: null,
    A3: null,
    A4: null,
    A5: null,
    B1: null,
    B2: null,
    B3: null,
    C1: null,
    C2: null,
    C3: null,
    C4: null,
    C5: null,
    C6: null,
  });

  const [rdepth, setRdepth] = useState({ index: 3, type: "car" });
  const [idepth, setIdepth] = useState({ index: 3, type: "car" });
  const [pdepth, setPdepth] = useState("car");

  const [activeMenu, setActiveMenu] = useState("acc");
  const [acclayer1, setAcclayer1] = useState(false);
  const [acclayer2, setAcclayer2] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showDashBoard, setShowDashBoard] = useState(false);

  const [rcbx, setRcbx] = useState([false, false, false, false, false]);
  const [icbx, setIcbx] = useState([false, false, false, false, false]);
  const [scbx, setScbx] = useState([true, true, true, true, true, true]);

  const [userHasInteractedR, setUserHasInteractedR] = useState(false);
  const [userHasInteractedI, setUserHasInteractedI] = useState(false);

  const [basemap, setBasemap] = useState(
    "mapbox://styles/redsilver522/cli2ji9m500w901pofuyqhbtz"
  );
  const [mapName, setMapName] = useState("standardmap");
  const [detailMap, setDetailMap] = useState(false);
  const [RBtoggle, setRBToggle] = useState(false);

  const [selectedRoad, setSelectedRoad] = useState("");
  const [selectedDM, setSelectedDM] = useState(null);
  const [pointer, setPointer] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSession, setIsSession] = useState(false);

  return (
    <InfoContext.Provider
      value={{
        info,
        setInfo,
        isSelect,
        setIsSelect,
        taasInfo,
        setTaasInfo,
        tmsInfo,
        setTmsInfo,
        depth1,
        setDepth1,
        depth2,
        setDepth2,
        rdepth,
        setRdepth,
        idepth,
        setIdepth,
        pdepth,
        setPdepth,
        isFilter,
        setIsFilter,
        tmsdInfo,
        setTmsdInfo,
        view,
        setView,
        lowerView,
        setLowerView,
        INITIAL_VIEW_STATE,
        LD,
        setLD,
        data,
        setData,
        rdata,
        setRdata,
        idata,
        setIdata,
        pdata,
        setPdata,
        mdata,
        setMdata,
        activeMenu,
        setActiveMenu,
        acclayer1,
        setAcclayer1,
        acclayer2,
        setAcclayer2,
        showProfile,
        setShowProfile,
        showChart,
        setShowChart,
        showDashBoard,
        setShowDashBoard,
        rcbx,
        setRcbx,
        icbx,
        setIcbx,
        scbx,
        setScbx,
        userHasInteractedR,
        setUserHasInteractedR,
        userHasInteractedI,
        setUserHasInteractedI,
        selectedRoad,
        setSelectedRoad,
        selectedDM,
        setSelectedDM,
        pointer,
        setPointer,
        hoveredIndex,
        setHoveredIndex,
        basemap,
        setBasemap,
        mapName,
        setMapName,
        detailMap,
        setDetailMap,
        RBtoggle,
        setRBToggle,
        isSession,
        setIsSession,
      }}
    >
      {children}
    </InfoContext.Provider>
  );
}

export { InfoProvider };
export default InfoContext;
