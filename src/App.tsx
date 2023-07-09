import Sidebar from "./Components/Sidebar";
import Boards from "./Components/Boards";

function App() {
  return (
    <div
      className="App"
    >
      <Sidebar>
        <Boards />
      </Sidebar>
    </div>
  );
}

export default App;
