import axios from "axios";
import useInfo from "./use-info";

const apiURL = process.env.REACT_APP_API_URL || "";

const useFetch = () => {
  const {
    setLD,
    setData,
    setRdata,
    setIdata,
    setPdata,
    setMdata,
    setIsSelect,
    setIsFilter,
  } = useInfo();

  const fetchaadtonly = async () => {
    setLD(true);
    try {
      const aadtRes = await axios.get(
        "https://d39zat15xiy1a1.cloudfront.net/aadt.geojson"
      );
      setData((prev) => ({
        ...prev,
        nroad: aadtRes.data,
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLD(false);
      // console.log("aadt fetched");
      setIsSelect(false);
      setIsFilter(true);
    }
  };

  const fetchaadt = async () => {
    setLD(true);
    try {
      const [aadtRes, aadtDot] = await Promise.all([
        axios.get("https://d39zat15xiy1a1.cloudfront.net/aadt.geojson"),
        axios.get("https://d39zat15xiy1a1.cloudfront.net/aadtdot.geojson"),
      ]);

      setData((prev) => ({
        ...prev,
        nroad: aadtRes.data,
        aadtDot: aadtDot.data,
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLD(false);
      // console.log("aadt fetched");
      setIsSelect(false);
      setIsFilter(true);
    }
  };

  const fetchemi = async () => {
    setLD(true);
    try {
      const [emiRes, vpRes, ppRes, bpRes] = await Promise.all([
        axios.get("https://d39zat15xiy1a1.cloudfront.net/emi_sorted.geojson"),
        axios.get(
          "https://d39zat15xiy1a1.cloudfront.net/vcount_sorted.geojson"
        ),
        axios.get(
          "https://d39zat15xiy1a1.cloudfront.net/pcount_sorted.geojson"
        ),
        axios.get(
          "https://d39zat15xiy1a1.cloudfront.net/bcount_sorted.geojson"
        ),
      ]);

      setData((prev) => ({
        ...prev,
        emiroad: emiRes.data,
        vpoint: vpRes.data,
        ppoint: ppRes.data,
        bpoint: bpRes.data,
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLD(false);
      setIsFilter(true);
    }
  };

  const fetchRoadacc = async () => {
    setLD(true);
    try {
      const lpRes = await axios.get(`${apiURL}/l1`);
      setRdata(lpRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLD(false);
      // console.log("lp fetched");
      setIsSelect(false);
      setIsFilter(true);
    }
  };

  const fetchIntacc = async () => {
    setLD(true);
    try {
      const npRes = await axios.get(`${apiURL}/n1`);
      setIdata(npRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLD(false);
      // console.log("np fetched");
      setIsSelect(false);
      setIsFilter(true);
    }
  };

  const fetchRiskProfile = async (roadNo) => {
    setLD(true);
    try {
      const rpRes = await axios.get(`${apiURL}/riskprofile/${roadNo}`);
      setPdata((prevData) => ({
        ...prevData,
        [roadNo]: rpRes.data,
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLD(false);
      setIsSelect(false);
      setIsFilter(true);
    }
  };

  const fetchdetailmap = async (midpoint) => {
    setLD(true);
    try {
      const [a1, a2, a3, a4, a5, b1, b2, b3, c1, c2, c3, c4, c5, c6] =
        await Promise.all([
          axios.get(`${apiURL}/a1/${midpoint}`),
          axios.get(`${apiURL}/a2/${midpoint}`),
          axios.get(`${apiURL}/a3/${midpoint}`),
          axios.get(`${apiURL}/a4/${midpoint}`),
          axios.get(`${apiURL}/a5/${midpoint}`),
          axios.get(`${apiURL}/b1/${midpoint}`),
          axios.get(`${apiURL}/b2/${midpoint}`),
          axios.get(`${apiURL}/b3/${midpoint}`),
          axios.get(`${apiURL}/c1/${midpoint}`),
          axios.get(`${apiURL}/c2/${midpoint}`),
          axios.get(`${apiURL}/c3/${midpoint}`),
          axios.get(`${apiURL}/c4/${midpoint}`),
          axios.get(`${apiURL}/c5/${midpoint}`),
          axios.get(`${apiURL}/c6/${midpoint}`),
        ]);
      setMdata((prev) => ({
        ...prev,
        A1: a1.data,
        A2: a2.data,
        A3: a3.data,
        A4: a4.data,
        A5: a5.data,
        B1: b1.data,
        B2: b2.data,
        B3: b3.data,
        C1: c1.data,
        C2: c2.data,
        C3: c3.data,
        C4: c4.data,
        C5: c5.data,
        C6: c6.data,
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsSelect(false);
      setIsFilter(true);
      setLD(false);
    }
  };

  return {
    fetchaadtonly,
    fetchaadt,
    fetchemi,
    fetchRoadacc,
    fetchIntacc,
    fetchRiskProfile,
    fetchdetailmap,
  };
};

export default useFetch;
