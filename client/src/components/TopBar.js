import { useState } from "react";
import "./TopBar.css";
import Modal from "./Modal";
import { CgFileDocument } from "react-icons/cg";
import guide from "../img/guide0429.png";
import LogoSVG from "../img/Logo.svg";
// import { FaCircleUser } from "react-icons/fa6";
import LBacc from "./LBacc";
import LBroad from "./LBroad";
import LBstar from "./LBstar";
import useInfo from "../hooks/use-info";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/use-fetch";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const TopBar = ({
  devMode,
  setDMBoundary,
  heights,
  setSelectedDM,
  menuToggle,
  setMenuToggle,
}) => {
  //Modal/////////////////////////////////////////////////////////////
  const {
    activeMenu,
    setActiveMenu,
    setDepth1,
    setDepth2,
    setTaasInfo,
    setTmsInfo,
    data,
    setMdata,
    setPdata,
    acclayer1,
    acclayer2,
    setAcclayer1,
    setAcclayer2,
    setRcbx,
    setIcbx,
    setRBToggle,
    showProfile,
    setShowProfile,
    setShowChart,
    setSelectedRoad,
    setDetailMap,
    setLowerView,
    INITIAL_VIEW_STATE,
  } = useInfo();
  const { fetchaadtonly } = useFetch();
  const [showModal, setShowModal] = useState(false);

  const toggleMenu = () => {
    setMenuToggle((prev) => !prev);
  };

  const handleModOpen = () => {
    setShowModal(true);
  };

  const handleModClose = () => {
    setShowModal(false);
  };

  const modal = (
    <Modal onClose={handleModClose}>
      <img src={guide} alt="guide1" height="800%" />
    </Modal>
  );

  const resetMdata = (isTotalReset) => {
    if (isTotalReset) setRBToggle(false);
    setMdata({
      A1: null,
      A2: null,
      A3: null,
      A4: null,
      A5: null,
      B1: null,
      B2: null,
      B3: null,
      C3: null,
      C4: null,
    });
    setDMBoundary(null);
    setLowerView(INITIAL_VIEW_STATE);
    heights[0](50);
    heights[1](50);
  };

  const resetVisuals = () => {
    setShowProfile(false);
    setPdata({});
    setDetailMap(false);
    setSelectedRoad(null);
    resetMdata(true);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    resetVisuals();

    switch (menu) {
      case "acc":
        setShowChart(false);
        if (!acclayer1 && !acclayer2) {
          setDepth1(null);
          setDepth2(null);
          setRcbx([false, false, false, false, false]);
          setIcbx([false, false, false, false, false]);
        }
        if (showProfile) {
          setAcclayer2(false);
        }
        break;

      case "curr":
        setDepth1(null);
        setDepth2(null);
        setAcclayer1(false);
        setAcclayer2(false);
        setRcbx([false, false, false, false, false]);
        setIcbx([false, false, false, false, false]);
        setSelectedDM(null);
        break;

      case "star":
        setTaasInfo([]);
        setTmsInfo([]);
        setDepth1("별점평가");
        setDepth2(null);
        if (!data.nroad) {
          fetchaadtonly();
        }
        break;

      default:
        break;
    }
  };

  const { t } = useTranslation();

  const handleDemonstrator = () => {
    console.log("R");
  };

  // const toggleIsSession = () => {
  //   setIsSession((prev) => !prev);
  // };
  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  // };
  ///////////////////////////////////////////////////////////////
  return (
    <div>
      <div className="topbar_ct">
        <div className="top_column">
          <a href="./">
            <img src={LogoSVG} alt="KoRAP Logo" className="logo_image" />
          </a>
          <div onClick={() => handleMenuClick("acc")}>{t("riskmap")}</div>
          <div onClick={() => handleMenuClick("star")}>별점평가</div>
          <div onClick={() => handleMenuClick("curr")}>{t("generalroad")}</div>
        </div>
        <div className="top_right_column">
          <button className="demonstrator" onClick={() => handleDemonstrator()}>
            별점평가 실험기
          </button>
          <div className="guide" onClick={handleModOpen}>
            <div className="dscrp">{t("datamanual")}&nbsp;</div>
            <CgFileDocument className="dscrp_ic" />
          </div>
          {/* <button className="login-button" onClick={() => toggleIsSession()}>
            <FaCircleUser />
          </button> */}
          {/* <div className="language-selector">
          <button onClick={() => changeLanguage("kor")}>한국어</button>
          <div className="divider"></div>
          <button onClick={() => changeLanguage("en")}>English</button>
        </div> */}
        </div>
      </div>
      {showModal && modal}

      {activeMenu === "acc" ? (
        <div>
          <LBacc
            devMode={devMode}
            menuToggle={menuToggle}
            setSelectedDM={setSelectedDM}
          />
        </div>
      ) : activeMenu === "curr" ? (
        <div>
          <LBroad menuToggle={menuToggle} />
        </div>
      ) : (
        <div>
          <LBstar
            setDMBoundary={setDMBoundary}
            resetMdata={resetMdata}
            setSelectedDM={setSelectedDM}
            menuToggle={menuToggle}
          />
        </div>
      )}
      <div
        className={`toggle-button ${menuToggle ? "" : "hidden"}`}
        onClick={toggleMenu}
      >
        {menuToggle ? <MdArrowBackIos /> : <MdArrowForwardIos />}
      </div>
    </div>
  );
};

export default TopBar;
