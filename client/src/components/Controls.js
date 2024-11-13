import "./Controls.css";
import { React, useState } from "react";
import useInfo from "../hooks/use-info";
import { GiExpand } from "react-icons/gi";
import { MdOutlineLocationOn } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { FlyToInterpolator } from "deck.gl";

function Controls({ view, setView, INITIAL_VIEW_STATE, devMode, selectedDM }) {
  const {
    isFilter,
    setIsFilter,
    activeMenu,
    depth1,
    depth2,
    setLowerView,
    data,
    // taasInfo,
    // tmsInfo,
    acclayer1,
    acclayer2,
    rdepth,
    idepth,
    pdepth,
    idata,
    mdata,
    pdata,
    pointer,
    selectedRoad,
    rcbx,
    icbx,
    detailMap,
  } = useInfo();
  const [isClicked, setIsClicked] = useState(false);

  const zoomtoRoad = () => {
    console.log(selectedDM);
    let node;

    if (activeMenu === "acc") {
      node = pdata[selectedRoad].mergedGJ.features.find(
        (feature) => feature.properties.id_l3 === selectedDM
      );
    } else if (activeMenu === "star") {
      node = data.nroad.features.find(
        (feature) => feature.properties.uid === selectedDM
      );
    }
    if (node) {
      const midPos = Math.floor(node.geometry.coordinates[0].length / 2);
      const [longitude, latitude] = node.geometry.coordinates[0][midPos];

      setView({
        longitude,
        latitude,
        zoom: 15,
        transitionDuration: 600,
        TransitionInterpolator: new FlyToInterpolator(),
      });
    }
  };

  return (
    <div className="toggle_button_div">
      <button
        className="toggle_button"
        onClick={() =>
          setView((prev) => {
            return {
              ...prev,
              zoom: prev.zoom < 20 ? prev.zoom + 1 : prev.zoom,
            };
          })
        }
      >
        +
      </button>

      <button
        className="toggle_button"
        onClick={() =>
          setView((prev) => ({
            ...prev,
            zoom: prev.zoom > 0.87 ? prev.zoom - 1 : prev.zoom,
          }))
        }
      >
        -
      </button>

      <button
        className="toggle_button"
        onClick={() => {
          setView(INITIAL_VIEW_STATE);
          setLowerView(INITIAL_VIEW_STATE);
        }}
      >
        <GiExpand />
      </button>

      <button
        className={`toggle_button ${isClicked ? "clicked" : ""}`}
        onClick={() => {
          setIsFilter(!isFilter);
          setIsClicked(!isClicked);
        }}
      >
        <BiHide />
      </button>

      {selectedDM && (
        <button
          className={`toggle_button`}
          onClick={() => {
            zoomtoRoad();
          }}
        >
          <MdOutlineLocationOn />
        </button>
      )}

      {devMode && (
        <button
          className="toggle_button"
          onClick={() =>
            console.log(
              "\nview:",
              view,
              "\nposition:",
              [view.longitude, view.latitude],
              "\nactivemenu:",
              activeMenu,
              "\ndepth1:",
              "\n",
              depth1,
              "\ndepth2:",
              "\n",
              depth2,
              "\nacclayer1:",
              "\n",
              acclayer1,
              "\nacclayer2:",
              "\n",
              acclayer2,
              "\nrdepth:",
              "\n",
              rdepth,
              "\nidepth:",
              "\n",
              idepth,
              "\npdepth:",
              "\n",
              pdepth,
              "\nidata:",
              "\n",
              idata,
              "\npointer:",
              "\n",
              pointer,
              "\nrcbx&icbx:",
              "\n",
              rcbx,
              icbx,
              "\n",
              "\nmdata:",
              "\n",
              mdata,
              "\npdata:",
              pdata,
              "\ndm:",
              "\n",
              detailMap,
              "\ndata:",
              "\n",
              data
            )
          }
        >
          VS
        </button>
      )}
    </div>
  );
}

export default Controls;
