import "./Basemap.css";
import React, { useState, useEffect, useRef } from "react";
import useInfo from "../hooks/use-info";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { useTranslation } from "react-i18next";

const Basemap = ({ devMode }) => {
  const { t } = useTranslation();
  const [mapExp, setMapExp] = useState(false);
  const { INITIAL_VIEW_STATE, setView, setBasemap, mapName, setMapName } =
    useInfo();
  const divEl = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (divEl.current && !divEl.current.contains(event.target)) {
        setMapExp(false);
      }
    };

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div ref={divEl}>
      <div
        className="map_toggle_button"
        onClick={(e) => {
          e.stopPropagation();
          setMapExp((prev) => !prev);
        }}
      >
        <div id="map_tg_name">{t(mapName)}</div>
        <div id="map_tg_icon">
          {mapExp ? <GoTriangleUp /> : <GoTriangleDown />}
        </div>
      </div>
      {mapExp && (
        // disable stopPropagation() until required in parent component
        <div id="map_exp">
          <ul>
            <li
              onClick={(e) => {
                // e.stopPropagation();
                setBasemap(
                  "mapbox://styles/redsilver522/cli2ji9m500w901pofuyqhbtz"
                );
                setMapName("standardmap");
              }}
            >
              {t("standardmap")}
            </li>
            <li
              onClick={(e) => {
                // e.stopPropagation();
                setBasemap(
                  // "mapbox://styles/redsilver522/cll63rilr00aj01q08hjfa03s" // Mapbox satellite
                  "vworldSatellite"
                );
                setMapName("satellitemap");
              }}
            >
              {t("satellitemap")}
            </li>
            <li
              onClick={(e) => {
                // e.stopPropagation();
                setBasemap(
                  "mapbox://styles/redsilver522/cll6424pf00al01q0c5kz3w07"
                );
                setMapName("satelliteblack");
              }}
            >
              {t("satelliteblack")}
            </li>
            <li
              onClick={(e) => {
                // e.stopPropagation();
                setBasemap("mapbox://styles/mapbox/dark-v11");
                setMapName("blackmap");
              }}
            >
              {t("blackmap")}
            </li>
            {devMode && (
              <li
                onClick={(e) => {
                  // e.stopPropagation();
                  setBasemap("vworldBlack");
                  setView(INITIAL_VIEW_STATE);
                  setMapName("3D (Beta)");
                }}
              >
                3D (Beta)
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Basemap;
