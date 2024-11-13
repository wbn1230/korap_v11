import LandingPage from "./pages/LandingPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  const devEnable = true; // toggle /dev

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage devMode={false} />} />
        <Route
          path="/dev"
          element={
            devEnable ? <LandingPage devMode={true} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
