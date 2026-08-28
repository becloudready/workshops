import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import TraineeView from './pages/TraineeView';
import PlanBuilder from './pages/PlanBuilder';
import ManagerDash from './pages/ManagerDash';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TraineeView />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/progress" element={<TraineeView />} />
        <Route path="/plan-builder" element={<PlanBuilder />} />
        <Route path="/manager" element={<ManagerDash />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;