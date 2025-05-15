import React, { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom"; // Import Route and Routes, NOT BrowserRouter
import Wizard from './pages/Wizard';
import Header from './components/Header';
import Results from './pages/Results';
import Evaluation from './pages/Evaluation';
import Tutorial from './pages/Tutorial';
import { AppProvider } from './context';

function App() {
  const [category, setCategory] = useState('');
  const [procedureList, setProcedureList] = useState([]);
  const [procedure, setProcedure] = useState('');
  const [tasksData, setTasksData] = useState({});

  useEffect(() => {
    fetch("/Configs/tasks_list.json")
      .then(res => res.json())
      .then(data => setTasksData(data))
      .catch(err => console.error('Errore nel caricamento dei task:', err));
  }, []);
  
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    setProcedure('');
    if (tasksData[selected]) {
      setProcedureList(tasksData[selected]);
    } else {
      setProcedureList([]);
    }
  };
  
  return (
    <AppProvider>
      <Header />
      <Routes>
        <Route path='/' element={<Wizard />} />
        <Route path='/results' element={<Results />} />
        <Route path='/evaluation' element={<Evaluation />} />
        <Route path='/tutorial' element={<Tutorial />} />
      </Routes>
    </AppProvider>
  );
}

export default App;