import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Projects from "../pages/Projects/Projects";
import ProjectDetails from "../pages/Projects/ProjectDetails";
import Services from "../pages/Services/Services";
import About from "../pages/About/About";
import Careers from "../pages/Careers/Careers";
import Contact from "../pages/Contact/Contact";
import Showreel from "../pages/Showreel/Showreel";
import MainLayout from "../components/layout/MainLayout";

const AppRouter = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/showreel" element={<Showreel />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRouter;
