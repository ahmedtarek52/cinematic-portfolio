import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MainLayout from "./components/layout/MainLayout";
import AppRouter from './router/AppRouter';


function App() {
  const [count, setCount] = useState(0)

 return <AppRouter />;
}

export default App
