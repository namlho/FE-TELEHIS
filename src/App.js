import { Route, Routes } from 'react-router-dom';
import './App.css';
import RouteApp from './routes';

function App() {
  return (
    <Routes>
      <Route path="*" element={<RouteApp />}></Route>
    </Routes>
  );
}

export default App;
