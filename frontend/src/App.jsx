import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import JobForm from './pages/Form';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <BrowserRouter>

    <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/form" element={<JobForm />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;