import { Routes, Route, Outlet } from "react-router-dom";
import Home from "../pages/Home/Home";
import Projects from "../pages/Projects/Projects";
import ProjectDetails from "../pages/Projects/ProjectDetails";
import Services from "../pages/Services/Services";
import About from "../pages/About/About";
// import Careers from "../pages/Careers/Careers";
import Contact from "../pages/Contact/Contact";
import Showreel from "../pages/Showreel/Showreel";
import Trailers from "../pages/Trailers/Trailers";
import MainLayout from "../components/layout/MainLayout";
import ScrollToTop from "../components/layout/ScrollToTop";

// Admin imports
import ProtectedRoute from "../components/admin/ProtectedRoute";
import AdminLayout from "../components/admin/AdminLayout";
import Login from "../pages/admin/Login";
import DashboardHome from "../pages/admin/DashboardHome";
import ProjectsList from "../pages/admin/ProjectsList";
import ProjectForm from "../pages/admin/ProjectForm";
import TrailersList from "../pages/admin/TrailersList";
import TrailerForm from "../pages/admin/TrailerForm";
import AboutEditor from "../pages/admin/AboutEditor";
import ServicesList from "../pages/admin/ServicesList";
import CareersList from "../pages/admin/CareersList";
import ContactInfoEditor from "../pages/admin/ContactInfoEditor";
import MessagesInbox from "../pages/admin/MessagesInbox";

// Wrapper that renders MainLayout with Outlet for nested public routes
const PublicLayout = () => (
  <MainLayout>
    <ScrollToTop />
    <Outlet />
  </MainLayout>
);

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes — wrapped in MainLayout (Navbar + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/trailers" element={<Trailers />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/careers" element={<Careers />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/showreel" element={<Showreel />} />
      </Route>

      {/* Admin Login (no layout) */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Protected Routes — wrapped in AdminLayout (Sidebar) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />
        <Route path="trailers" element={<TrailersList />} />
        <Route path="trailers/new" element={<TrailerForm />} />
        <Route path="trailers/:id/edit" element={<TrailerForm />} />
        <Route path="about" element={<AboutEditor />} />
        <Route path="services" element={<ServicesList />} />
        <Route path="careers" element={<CareersList />} />
        <Route path="contact" element={<ContactInfoEditor />} />
        <Route path="messages" element={<MessagesInbox />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
