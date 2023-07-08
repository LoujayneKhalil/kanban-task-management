import { RootState } from "./Store/store";
import Sidebar from "./Components/Sidebar";
import { useSelector } from "react-redux";
import Boards from "./Components/Boards";

function App() {
  const theme = useSelector((state: RootState) => state.theme);
  return (
    <div
      className="App"
      style={{ backgroundColor: theme === "dark" ? "#20212c" : "#f4f7fd" }}
    >
      <Sidebar>
        <Boards />
      </Sidebar>
    </div>
  );
}

export default App;
