import { useContext } from "react";
import InfoContext from "../context/info";

function useInfo() {
  return useContext(InfoContext);
}

export default useInfo;
