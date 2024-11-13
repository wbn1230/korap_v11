import useInfo from "./use-info";

const useColor = () => {
  const {
    info,
    taasInfo,
    tmsInfo,
    depth1,
    rdepth,
    idepth,
    pdepth,
    rcbx,
    icbx,
    scbx,
    selectedRoad,
    selectedDM,
  } = useInfo();
  const getEmiVColor = (emi) => {
    if (taasInfo.every((val) => val === false)) {
      if (0 === emi) {
        return [0, 166, 172, 255 * 0.8];
      } else if (0 < emi && emi <= 2.26) {
        return [43, 150, 175, 255 * 0.8];
      } else if (2.26 < emi && emi <= 4.78) {
        return [86, 134, 178, 255 * 0.8];
      } else if (4.78 < emi && emi <= 9.82) {
        return [129, 118, 181, 255 * 0.8];
      } else if (9.82 < emi && emi <= 21.24) {
        return [164, 126, 161, 255 * 0.8];
      } else if (21.24 < emi && emi <= 36.74) {
        return [198, 133, 140, 255 * 0.8];
      } else if (36.74 < emi && emi <= 63.66) {
        return [233, 141, 120, 255 * 0.8];
      } else if (63.66 < emi && emi <= 115.36) {
        return [218, 94, 84, 255 * 0.8];
      } else if (115.36 < emi && emi <= 261.86) {
        return [204, 47, 47, 255 * 0.8];
      } else if (261.86 < emi && emi <= 1573.98) {
        return [189, 0, 11, 255 * 0.8];
      } else {
        return [255, 0, 0, 255 * 0.8];
      }
    } else {
      if (0 === emi) {
        return taasInfo[0] ? [0, 166, 172, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (0 < emi && emi <= 2.26) {
        return taasInfo[1] ? [43, 150, 175, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (2.26 < emi && emi <= 4.78) {
        return taasInfo[1] ? [86, 134, 178, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (4.78 < emi && emi <= 9.82) {
        return taasInfo[1] ? [129, 118, 181, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (9.82 < emi && emi <= 21.24) {
        return taasInfo[1] ? [164, 126, 161, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (21.24 < emi && emi <= 36.74) {
        return taasInfo[1] ? [198, 133, 140, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (36.74 < emi && emi <= 63.66) {
        return taasInfo[1] ? [233, 141, 120, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (63.66 < emi && emi <= 115.36) {
        return taasInfo[1] ? [218, 94, 84, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (115.36 < emi && emi <= 261.86) {
        return taasInfo[1] ? [204, 47, 47, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (261.86 < emi && emi <= 1573.98) {
        return taasInfo[2] ? [189, 0, 11, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else {
        return [255, 0, 0, 255 * 0.8];
      }
    }
  };

  const getEmiPColor = (emi) => {
    if (taasInfo.every((val) => val === false)) {
      if (0 === emi) {
        return [0, 166, 172, 255 * 0.8];
      } else if (0 < emi && emi <= 2.26) {
        return [43, 150, 175, 255 * 0.8];
      } else if (2.26 < emi && emi <= 7.3) {
        return [86, 134, 178, 255 * 0.8];
      } else if (7.3 < emi && emi <= 20.5) {
        return [129, 118, 181, 255 * 0.8];
      } else if (20.5 < emi && emi <= 33.96) {
        return [164, 126, 161, 255 * 0.8];
      } else if (33.96 < emi && emi <= 48.94) {
        return [198, 133, 140, 255 * 0.8];
      } else if (48.94 < emi && emi <= 74.6) {
        return [233, 141, 120, 255 * 0.8];
      } else if (74.6 < emi && emi <= 121.66) {
        return [218, 94, 84, 255 * 0.8];
      } else if (121.66 < emi && emi <= 253.88) {
        return [204, 47, 47, 255 * 0.8];
      } else if (253.88 < emi && emi <= 599.42) {
        return [189, 0, 11, 255 * 0.8];
      } else {
        return [255, 0, 0, 255 * 0.8];
      }
    } else {
      if (0 === emi) {
        return taasInfo[0] ? [0, 166, 172, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (0 < emi && emi <= 2.26) {
        return taasInfo[1] ? [43, 150, 175, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (2.26 < emi && emi <= 7.3) {
        return taasInfo[1] ? [86, 134, 178, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (7.3 < emi && emi <= 20.5) {
        return taasInfo[1] ? [129, 118, 181, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (20.5 < emi && emi <= 33.96) {
        return taasInfo[1] ? [164, 126, 161, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (33.96 < emi && emi <= 48.94) {
        return taasInfo[1] ? [198, 133, 140, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (48.94 < emi && emi <= 74.6) {
        return taasInfo[1] ? [233, 141, 120, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (74.6 < emi && emi <= 121.66) {
        return taasInfo[1] ? [218, 94, 84, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (121.66 < emi && emi <= 253.88) {
        return taasInfo[1] ? [204, 47, 47, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (253.88 < emi && emi <= 599.42) {
        return taasInfo[2] ? [189, 0, 11, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else {
        return [255, 0, 0, 255 * 0.8];
      }
    }
  };

  const getEmiBColor = (emi) => {
    if (taasInfo.every((val) => val === false)) {
      if (0 === emi) {
        return [0, 166, 172, 255 * 0.8];
      } else if (0 < emi && emi <= 2) {
        return [43, 150, 175, 255 * 0.8];
      } else if (2 < emi && emi <= 2.26) {
        return [86, 134, 178, 255 * 0.8];
      } else if (2.26 < emi && emi <= 4.78) {
        return [129, 118, 181, 255 * 0.8];
      } else if (4.78 < emi && emi <= 14.46) {
        return [164, 126, 161, 255 * 0.8];
      } else if (14.46 < emi && emi <= 19.5) {
        return [198, 133, 140, 255 * 0.8];
      } else if (19.5 < emi && emi <= 31.7) {
        return [233, 141, 120, 255 * 0.8];
      } else if (31.7 < emi && emi <= 43.64) {
        return [218, 94, 84, 255 * 0.8];
      } else if (43.64 < emi && emi <= 72.46) {
        return [204, 47, 47, 255 * 0.8];
      } else if (72.46 < emi && emi <= 185.56) {
        return [189, 0, 11, 255 * 0.8];
      } else {
        return [255, 0, 0, 255 * 0.8];
      }
    } else {
      if (0 === emi) {
        return taasInfo[0] ? [0, 166, 172, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (0 < emi && emi <= 2) {
        return taasInfo[1] ? [43, 150, 175, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (2 < emi && emi <= 2.26) {
        return taasInfo[1] ? [86, 134, 178, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (2.26 < emi && emi <= 4.78) {
        return taasInfo[1] ? [129, 118, 181, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (4.78 < emi && emi <= 14.46) {
        return taasInfo[1] ? [164, 126, 161, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (14.46 < emi && emi <= 19.5) {
        return taasInfo[1] ? [198, 133, 140, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (19.5 < emi && emi <= 31.7) {
        return taasInfo[1] ? [233, 141, 120, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (31.7 < emi && emi <= 43.64) {
        return taasInfo[1] ? [218, 94, 84, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (43.64 < emi && emi <= 72.46) {
        return taasInfo[1] ? [204, 47, 47, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (72.46 < emi) {
        return taasInfo[2] ? [189, 0, 11, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else {
        return [255, 0, 0, 255 * 0.8];
      }
    }
  };

  const getTmsColor = (d) => {
    if (tmsInfo.every((val) => val === false)) {
      if (1524 <= d && d <= 3220) {
        return [0, 166, 172, 255 * 0.8];
      } else if (3220 < d && d <= 10114) {
        return [43, 150, 175, 255 * 0.8];
      } else if (10114 < d && d <= 18271) {
        return [86, 134, 178, 255 * 0.8];
      } else if (18271 < d && d <= 28562) {
        return [129, 118, 181, 255 * 0.8];
      } else if (28562 < d && d <= 41859) {
        return [164, 126, 161, 255 * 0.8];
      } else if (41859 < d && d <= 59391) {
        return [198, 133, 140, 255 * 0.8];
      } else if (59391 < d && d <= 82417) {
        return [233, 141, 120, 255 * 0.8];
      } else if (82417 < d && d <= 119530) {
        return [218, 94, 84, 255 * 0.8];
      } else if (119530 < d && d <= 188392) {
        return [204, 47, 47, 255 * 0.8];
      } else if (188392 < d && d <= 298292) {
        return [189, 0, 11, 255 * 0.8];
      } else {
        return [255, 0, 0, 255 * 0.8];
      }
    } else {
      if (1524 <= d && d <= 3220) {
        return tmsInfo[0] ? [0, 166, 172, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (3220 < d && d <= 10114) {
        return tmsInfo[0] ? [43, 150, 175, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (10114 < d && d <= 18271) {
        return tmsInfo[0] ? [86, 134, 178, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (18271 < d && d <= 28562) {
        return tmsInfo[1] ? [129, 118, 181, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (28562 < d && d <= 41859) {
        return tmsInfo[1] ? [164, 126, 161, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (41859 < d && d <= 59391) {
        return tmsInfo[1] ? [198, 133, 140, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (59391 < d && d <= 82417) {
        return tmsInfo[1] ? [233, 141, 120, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (82417 < d && d <= 119530) {
        return tmsInfo[2] ? [218, 94, 84, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (119530 < d && d <= 188392) {
        return tmsInfo[2] ? [204, 47, 47, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else if (188392 < d && d <= 298292) {
        return tmsInfo[2] ? [189, 0, 11, 255 * 0.8] : [0, 0, 0, 255 * 0.05];
      } else {
        return [255, 0, 0, 255 * 0.8];
      }
    }
  };

  const getTmsdColor = (d) => {
    if (tmsInfo.every((val) => val === false)) {
      if (46700 < d && d <= 92842) {
        return [0, 166, 172, 255 * 1];
      } else if (20834 < d && d <= 46700) {
        return [43, 150, 175, 255 * 1];
      } else if (8511 < d && d <= 20834) {
        return [86, 134, 178, 255 * 1];
      } else if (874 < d && d <= 8511) {
        return [129, 118, 181, 255 * 1];
      } else if (-4186 < d && d <= 874) {
        return [164, 126, 161, 255 * 1];
      } else if (-9069 < d && d <= -4186) {
        return [198, 133, 140, 255 * 1];
      } else if (-18044 < d && d <= -9069) {
        return [233, 141, 120, 255 * 1];
      } else if (-39698 < d && d <= -18044) {
        return [218, 94, 84, 255 * 1];
      } else if (-103702 < d && d <= -39698) {
        return [204, 47, 47, 255 * 1];
      } else if (-138359 <= d && d <= -103702) {
        return [189, 0, 11, 255 * 1];
      } else {
        return [255, 0, 0, 255 * 1];
      }
    } else {
      if (46700 < d && d <= 92842) {
        return tmsInfo[0] ? [0, 166, 172, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else if (20834 < d && d <= 46700) {
        return tmsInfo[0] ? [43, 150, 175, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else if (8511 < d && d <= 20834) {
        return tmsInfo[0] ? [86, 134, 178, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else if (874 < d && d <= 8511) {
        return tmsInfo[1] ? [129, 118, 181, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else if (-4186 < d && d <= 874) {
        return tmsInfo[1] ? [164, 126, 161, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else if (-9069 < d && d <= -4186) {
        return tmsInfo[1] ? [198, 133, 140, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else if (-18044 < d && d <= -9069) {
        return tmsInfo[1] ? [233, 141, 120, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else if (-39698 < d && d <= -18044) {
        return tmsInfo[2] ? [218, 94, 84, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else if (-103702 < d && d <= -39698) {
        return tmsInfo[2] ? [204, 47, 47, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else if (-138359 <= d && d <= -103702) {
        return tmsInfo[2] ? [189, 0, 11, 255 * 1] : [0, 0, 0, 255 * 0.05];
      } else {
        return [255, 0, 0, 255 * 1];
      }
    }
  };

  const getPaccColor = (p) => {
    return selectedRoad === p.road_no
      ? [235, 65, 65, 255 * 0.8]
      : [117, 147, 169, 255 * 0.2];
  };

  const getRaccColor = (p) => {
    if (rdepth.index === 1) {
      // 기본지표 1
      if (rcbx.every((val) => val === false)) {
        return [117, 147, 169, 255 * 0.2];
      }
      if (rdepth.type === "car") {
        // L_CAR_BI_1
        if (0 <= p.l_car_bi_1 && p.l_car_bi_1 < 0.003) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[4] ? [72, 165, 220] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.003 <= p.l_car_bi_1 && p.l_car_bi_1 < 0.012) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[3] ? [66, 180, 80] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.012 <= p.l_car_bi_1 && p.l_car_bi_1 < 0.029) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[2] ? [245, 205, 75] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.029 <= p.l_car_bi_1 && p.l_car_bi_1 < 0.083) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[1] ? [255, 115, 0] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.0823 <= p.l_car_bi_1 && p.l_car_bi_1 < 0.19) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[0] ? [221, 0, 22] : [117, 147, 169, 255 * 0.2])
          );
        }
      } else if (rdepth.type === "walk") {
        // L_PED_BI_1
        if (0 >= p.l_ped_bi_1) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[4] ? [72, 165, 220] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0 < p.l_ped_bi_1 && p.l_ped_bi_1 < 0.002) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[3] ? [66, 180, 80] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.002 <= p.l_ped_bi_1 && p.l_ped_bi_1 < 0.005) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[2] ? [245, 205, 75] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.005 <= p.l_ped_bi_1 && p.l_ped_bi_1 < 0.014) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[1] ? [255, 115, 0] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.014 <= p.l_ped_bi_1 && p.l_ped_bi_1 < 0.04) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[0] ? [221, 0, 22] : [117, 147, 169, 255 * 0.2])
          );
        }
      } else if (rdepth.type === "bike") {
        // L_CYC_BI_1
        if (0 >= p.l_cyc_bi_1) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[4] ? [72, 165, 220] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0 < p.l_cyc_bi_1 && p.l_cyc_bi_1 < 0.001) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[3] ? [66, 180, 80] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.001 <= p.l_cyc_bi_1 && p.l_cyc_bi_1 < 0.003) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[2] ? [245, 205, 75] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.003 <= p.l_cyc_bi_1 && p.l_cyc_bi_1 < 0.007) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[1] ? [255, 115, 0] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.0007 <= p.l_cyc_bi_1 && p.l_cyc_bi_1 < 0.03) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[0] ? [221, 0, 22] : [117, 147, 169, 255 * 0.2])
          );
        }
      }
    } else if (rdepth.index === 2) {
      /// 기본지표 2
      if (rcbx.every((val) => val === false)) {
        return [117, 147, 169, 255 * 0.2];
      }
      if (rdepth.type === "car") {
        // L_CAR_BI_2
        if (0 <= p.l_car_bi_2 && p.l_car_bi_2 < 0.0141) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[4] ? [72, 165, 220] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.0141 <= p.l_car_bi_2 && p.l_car_bi_2 < 0.04707) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[3] ? [66, 180, 80] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.04707 <= p.l_car_bi_2 && p.l_car_bi_2 < 0.10406) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[2] ? [245, 205, 75] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.10406 <= p.l_car_bi_2 && p.l_car_bi_2 < 0.23738) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[1] ? [255, 115, 0] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.23738 <= p.l_car_bi_2 && p.l_car_bi_2 < 0.54188) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[0] ? [221, 0, 22] : [117, 147, 169, 255 * 0.2])
          );
        }
      } else if (rdepth.type === "walk") {
        // L_PED_BI_2
        if (0 <= p.l_ped_bi_2 && p.l_ped_bi_2 < 0.003) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[4] ? [72, 165, 220] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.003 <= p.l_ped_bi_2 && p.l_ped_bi_2 < 0.013) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[3] ? [66, 180, 80] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.013 <= p.l_ped_bi_2 && p.l_ped_bi_2 < 0.032) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[2] ? [245, 205, 75] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.032 <= p.l_ped_bi_2 && p.l_ped_bi_2 < 0.113) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[1] ? [255, 115, 0] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.113 <= p.l_ped_bi_2 && p.l_ped_bi_2 < 0.27) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[0] ? [221, 0, 22] : [117, 147, 169, 255 * 0.2])
          );
        }
      } else if (rdepth.type === "bike") {
        // L_CYC_BI_2
        if (0 <= p.l_cyc_bi_2 && p.l_cyc_bi_2 < 0.001) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[4] ? [72, 165, 220] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.001 <= p.l_cyc_bi_2 && p.l_cyc_bi_2 < 0.005) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[3] ? [66, 180, 80] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.005 <= p.l_cyc_bi_2 && p.l_cyc_bi_2 < 0.014) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[2] ? [245, 205, 75] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.014 <= p.l_cyc_bi_2 && p.l_cyc_bi_2 < 0.038) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[1] ? [255, 115, 0] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.038 <= p.l_cyc_bi_2 && p.l_cyc_bi_2 < 0.08) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[0] ? [221, 0, 22] : [117, 147, 169, 255 * 0.2])
          );
        }
      }
    } else if (rdepth.index === 3) {
      // 평균 사고 건수
      if (rcbx.every((val) => val === false)) {
        return [117, 147, 169, 255 * 0.2];
      }
      if (rdepth.type === "car") {
        // L_CAR_ABS
        if (0 <= p.l_car_abs && p.l_car_abs < 0.33642) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[4] ? [72, 165, 220] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.33642 <= p.l_car_abs && p.l_car_abs < 1.33964) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[3] ? [66, 180, 80] : [117, 147, 169, 255 * 0.2])
          );
        } else if (1.33964 <= p.l_car_abs && p.l_car_abs < 4.00281) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[2] ? [245, 205, 75] : [117, 147, 169, 255 * 0.2])
          );
        } else if (4.00281 <= p.l_car_abs && p.l_car_abs < 13.0132) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[1] ? [255, 115, 0] : [117, 147, 169, 255 * 0.2])
          );
        } else if (13.0132 <= p.l_car_abs && p.l_car_abs < 150.4113) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[0] ? [221, 0, 22] : [117, 147, 169, 255 * 0.2])
          );
        }
      } else if (rdepth.type === "walk") {
        // L_PED_ABS
        if (0 >= p.l_ped_abs) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[4] ? [72, 165, 220] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0 <= p.l_ped_abs && p.l_ped_abs < 0.334) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[3] ? [66, 180, 80] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.334 <= p.l_ped_abs && p.l_ped_abs < 1.333) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[2] ? [245, 205, 75] : [117, 147, 169, 255 * 0.2])
          );
        } else if (1.333 <= p.l_ped_abs && p.l_ped_abs < 3.667) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[1] ? [255, 115, 0] : [117, 147, 169, 255 * 0.2])
          );
        } else if (3.667 <= p.l_ped_abs && p.l_ped_abs < 20.68) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[0] ? [221, 0, 22] : [117, 147, 169, 255 * 0.2])
          );
        }
      } else if (rdepth.type === "bike") {
        // L_CYC_ABS
        if (0 >= p.l_cyc_abs) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[4] ? [72, 165, 220] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0 <= p.l_cyc_abs && p.l_cyc_abs < 0.3329) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[3] ? [66, 180, 80] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.3329 <= p.l_cyc_abs && p.l_cyc_abs < 0.667) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[2] ? [245, 205, 75] : [117, 147, 169, 255 * 0.2])
          );
        } else if (0.667 <= p.l_cyc_abs && p.l_cyc_abs < 1.667) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[1] ? [255, 115, 0] : [117, 147, 169, 255 * 0.2])
          );
        } else if (1.667 <= p.l_cyc_abs && p.l_cyc_abs < 4.7) {
          return (
            rcbx.every((val) => val === false) ||
            (rcbx[0] ? [221, 0, 22] : [117, 147, 169, 255 * 0.2])
          );
        }
      }
    } else {
      return [0, 0, 0, 255 * 0.8];
    }
  };

  const getIaccColor = (p) => {
    if (icbx.every((val) => val === false)) {
      return [197, 217, 227, 255 * 0.1];
    }
    if (idepth.index === 1) {
      // 기본지표1
      if (idepth.type === "car") {
        // N_CAR_BI_1
        if (0 <= p.n_car_bi_1 && p.n_car_bi_1 < 0.04812) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[4] ? [72, 165, 220] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.04812 <= p.n_car_bi_1 && p.n_car_bi_1 < 0.14797) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[3] ? [66, 180, 80] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.14797 <= p.n_car_bi_1 && p.n_car_bi_1 < 0.30996) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[2] ? [245, 205, 75] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.30996 <= p.n_car_bi_1 && p.n_car_bi_1 < 0.86637) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[1] ? [255, 115, 0] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.86637 <= p.n_car_bi_1 && p.n_car_bi_1 < 2.44526) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[0] ? [221, 0, 22] : [197, 217, 227, 255 * 0.1])
          );
        }
      } else if (idepth.type === "walk") {
        // N_PED_BI_1
        if (0 <= p.n_ped_bi_1 && p.n_ped_bi_1 < 0.01106) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[4] ? [72, 165, 220] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.01106 <= p.n_ped_bi_1 && p.n_ped_bi_1 < 0.03665) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[3] ? [66, 180, 80] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.03665 <= p.n_ped_bi_1 && p.n_ped_bi_1 < 0.07358) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[2] ? [245, 205, 75] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.07358 <= p.n_ped_bi_1 && p.n_ped_bi_1 < 0.14339) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[1] ? [255, 115, 0] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.14339 <= p.n_ped_bi_1 && p.n_ped_bi_1 < 0.27762) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[0] ? [221, 0, 22] : [197, 217, 227, 255 * 0.1])
          );
        }
      } else if (idepth.type === "bike") {
        // N_CYC_BI_1
        if (0 >= p.n_cyc_bi_1) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[4] ? [72, 165, 220] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0 <= p.n_cyc_bi_1 && p.n_cyc_bi_1 < 0.03045) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[3] ? [66, 180, 80] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.03045 <= p.n_cyc_bi_1 && p.n_cyc_bi_1 < 0.05548) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[2] ? [245, 205, 75] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.05548 <= p.n_cyc_bi_1 && p.n_cyc_bi_1 < 0.13315) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[1] ? [255, 115, 0] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.13315 <= p.n_cyc_bi_1 && p.n_cyc_bi_1 < 0.2214) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[0] ? [221, 0, 22] : [197, 217, 227, 255 * 0.1])
          );
        }
      }
    } else if (idepth.index === 2) {
      // 기본지표2
      if (icbx.every((val) => val === false)) {
        return [197, 217, 227, 255 * 0.1];
      }
      if (idepth.type === "car") {
        // N_CAR_BI_2
        if (0 <= p.n_car_bi_2 && p.n_car_bi_2 < 0.11628) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[4] ? [72, 165, 220] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.11628 <= p.n_car_bi_2 && p.n_car_bi_2 < 0.43333) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[3] ? [66, 180, 80] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.43333 <= p.n_car_bi_2 && p.n_car_bi_2 < 0.93479) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[2] ? [245, 205, 75] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.93479 <= p.n_car_bi_2 && p.n_car_bi_2 < 1.94468) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[1] ? [255, 115, 0] : [197, 217, 227, 255 * 0.1])
          );
        } else if (1.94468 <= p.n_car_bi_2 && p.n_car_bi_2 < 9.91349) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[0] ? [221, 0, 22] : [197, 217, 227, 255 * 0.1])
          );
        }
      } else if (idepth.type === "walk") {
        // N_PED_BI_2
        if (0 <= p.n_ped_bi_2 && p.n_ped_bi_2 < 0.05022) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[4] ? [72, 165, 220] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.05022 <= p.n_ped_bi_2 && p.n_ped_bi_2 < 0.17939) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[3] ? [66, 180, 80] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.17939 <= p.n_ped_bi_2 && p.n_ped_bi_2 < 0.4134) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[2] ? [245, 205, 75] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.4134 <= p.n_ped_bi_2 && p.n_ped_bi_2 < 0.93092) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[1] ? [255, 115, 0] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.93092 <= p.n_ped_bi_2 && p.n_ped_bi_2 < 1.81229) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[0] ? [221, 0, 22] : [197, 217, 227, 255 * 0.1])
          );
        }
      } else if (idepth.type === "bike") {
        // N_CYC_BI_2
        if (0 <= p.n_cyc_bi_2 && p.n_cyc_bi_2 < 0.03148) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[4] ? [72, 165, 220] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.03148 <= p.n_cyc_bi_2 && p.n_cyc_bi_2 < 0.1096) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[3] ? [66, 180, 80] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.1096 <= p.n_cyc_bi_2 && p.n_cyc_bi_2 < 0.22998) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[2] ? [245, 205, 75] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.22998 <= p.n_cyc_bi_2 && p.n_cyc_bi_2 < 0.44484) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[1] ? [255, 115, 0] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.44484 <= p.n_cyc_bi_2 && p.n_cyc_bi_2 < 1.38214) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[0] ? [221, 0, 22] : [197, 217, 227, 255 * 0.1])
          );
        }
      }
    } else if (idepth.index === 3) {
      // 평균 사고 건수
      if (icbx.every((val) => val === false)) {
        return [197, 217, 227, 255 * 0.1];
      }
      if (idepth.type === "car") {
        // N_CAR_AI
        if (0 >= p.n_car_ai) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[4] ? [72, 165, 220] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0 <= p.n_car_ai && p.n_car_ai < 0.66529) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[3] ? [66, 180, 80] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.66529 <= p.n_car_ai && p.n_car_ai < 1.66445) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[2] ? [245, 205, 75] : [197, 217, 227, 255 * 0.1])
          );
        } else if (1.66445 <= p.n_car_ai && p.n_car_ai < 4.00281) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[1] ? [255, 115, 0] : [197, 217, 227, 255 * 0.1])
          );
        } else if (4.00281 <= p.n_car_ai && p.n_car_ai < 23.04675) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[0] ? [221, 0, 22] : [197, 217, 227, 255 * 0.1])
          );
        }
      } else if (idepth.type === "walk") {
        // N_PED_AI
        if (0 >= p.n_ped_ai) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[4] ? [72, 165, 220] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0 <= p.n_ped_ai && p.n_ped_ai < 0.33642) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[3] ? [66, 180, 80] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.33642 <= p.n_ped_ai && p.n_ped_ai < 0.66529) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[2] ? [245, 205, 75] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.66529 <= p.n_ped_ai && p.n_ped_ai < 1.33964) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[1] ? [255, 115, 0] : [197, 217, 227, 255 * 0.1])
          );
        } else if (1.33964 <= p.n_ped_ai && p.n_ped_ai < 3.34923) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[0] ? [221, 0, 22] : [197, 217, 227, 255 * 0.1])
          );
        }
      } else if (idepth.type === "bike") {
        // N_CYC_AI
        if (0 >= p.n_cyc_ai) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[4] ? [72, 165, 220] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0 <= p.n_cyc_ai && p.n_cyc_ai < 0.3329) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[3] ? [66, 180, 80] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.3329 <= p.n_cyc_ai && p.n_cyc_ai < 0.6665) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[2] ? [245, 205, 75] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.6665 <= p.n_cyc_ai && p.n_cyc_ai < 0.6675) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[1] ? [255, 115, 0] : [197, 217, 227, 255 * 0.1])
          );
        } else if (0.6675 <= p.n_cyc_ai && p.n_cyc_ai < 1.6671) {
          return (
            icbx.every((val) => val === false) ||
            (icbx[0] ? [221, 0, 22] : [197, 217, 227, 255 * 0.1])
          );
        }
      }
    } else {
      return [0, 0, 0, 255 * 0.8];
    }
  };

  const getColumnColor = (p) => {
    if (pdepth === "car") {
      // L_CAR_ABS
      if (0 <= p.l_car_abs && p.l_car_abs < 0.33642) {
        return [72, 165, 220, 255 * 0.5];
      } else if (0.33642 <= p.l_car_abs && p.l_car_abs < 1.33964) {
        return [66, 180, 80, 255 * 0.5];
      } else if (1.33964 <= p.l_car_abs && p.l_car_abs < 4.00281) {
        return [245, 205, 75, 255 * 0.5];
      } else if (4.00281 <= p.l_car_abs && p.l_car_abs < 13.0132) {
        return [255, 115, 0, 255 * 0.5];
      } else if (13.0132 <= p.l_car_abs && p.l_car_abs < 150.4113) {
        return [221, 0, 22, 255 * 0.5];
      }
    } else if (pdepth === "walk") {
      // L_PED_ABS
      if (0 >= p.l_ped_abs) {
        return [72, 165, 220];
      } else if (0 <= p.l_ped_abs && p.l_ped_abs < 0.334) {
        return [66, 180, 80];
      } else if (0.334 <= p.l_ped_abs && p.l_ped_abs < 1.333) {
        return [245, 205, 75];
      } else if (1.333 <= p.l_ped_abs && p.l_ped_abs < 3.667) {
        return [255, 115, 0];
      } else if (3.667 <= p.l_ped_abs && p.l_ped_abs < 20.68) {
        return [221, 0, 22];
      }
    } else if (pdepth === "bike") {
      // L_CYC_ABS
      if (0 >= p.l_cyc_abs) {
        return [72, 165, 220];
      } else if (0 <= p.l_cyc_abs && p.l_cyc_abs < 0.3329) {
        return [66, 180, 80];
      } else if (0.3329 <= p.l_cyc_abs && p.l_cyc_abs < 0.667) {
        return [245, 205, 75];
      } else if (0.667 <= p.l_cyc_abs && p.l_cyc_abs < 1.667) {
        return [255, 115, 0];
      } else if (1.667 <= p.l_cyc_abs && p.l_cyc_abs < 4.7) {
        return [221, 0, 22];
      }
    }
  };

  const getStarColor = (p) => {
    if (p.uid === selectedDM) {
      return [22, 17, 250, 255 * 0.9];
    } else if (!selectedRoad || selectedRoad === p.road_no) {
      switch (p.star_rating_class) {
        case 5:
          return scbx[0] ? [0, 153, 0, 255 * 0.8] : [117, 147, 169, 255 * 0.2];
        case 4:
          return scbx[1] ? [255, 255, 68] : [117, 147, 169, 255 * 0.2];
        case 3:
          return scbx[2]
            ? [255, 170, 0, 255 * 0.8]
            : [117, 147, 169, 255 * 0.2];
        case 2:
          return scbx[3] ? [255, 0, 0, 255 * 0.8] : [117, 147, 169, 255 * 0.2];
        case 1:
          return scbx[4] ? [0, 0, 0, 255 * 0.8] : [117, 147, 169, 255 * 0.2];
        default:
          return [117, 147, 169, 255 * 0.2];
      }
    } else {
      return [117, 147, 169, 255 * 0.2];
    }
  };

  const getRoadColor = (feature) => {
    if (depth1 === "도로현황") {
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

      if (
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
      ) {
        return [235, 65, 65, 255 * 0.6];
      } else {
        return [0, 0, 0, 255 * 0.05];
      }
    }
  };
  return {
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
  };
};

export default useColor;
