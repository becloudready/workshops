import TraineeHeader from "./components/TraineeHeader";
import TraineeSidebar from "./components/TraineeSidebar";

function App() {
  return (
    <div className="app-layout">
      <TraineeSidebar />

      <div className="app-main">
        <TraineeHeader />

        <main className="main-content">
          <p>hello</p>
        </main>
      </div>
    </div>
  );
}

export default App;
