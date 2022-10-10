import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTransition, animated, config } from "react-spring";
import FeedScreen from "./screens/FeedScreen";
import { DetailScreen } from "./screens/DetailScreen";

function App() {
  const location = useLocation();
  const transitions = useTransition(location, {
    from: {
      opacity: 0,
      transform: "translate3d(0,40%,0) ",
      position: "absolute",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0,0,0) ",
      position: "absolute",
    },
    leave: {
      opacity: 0,
      transform: "translate3d(0,-40%,0) ",
      position: "absolute",
    },
    config: config.default,
  });

  return transitions((style) => (
    <animated.div style={{ ...style, position: "absolute" }}>
      <Routes>
        <Route path="/" element={<FeedScreen />} />
        <Route path="/details" element={<DetailScreen />} />
      </Routes>
    </animated.div>
  ));
}

export default App;
