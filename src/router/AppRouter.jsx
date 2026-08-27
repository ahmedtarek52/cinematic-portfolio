import { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ScrollToTop from "../components/layout/ScrollToTop";

// Lazy-loaded public pages (code-split per route)
const Home = lazy(() => import("../pages/Home/Home"));
const Projects = lazy(() => import("../pages/Projects/Projects"));
const ProjectDetails = lazy(() => import("../pages/Projects/ProjectDetails"));
const Services = lazy(() => import("../pages/Services/Services"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const Showreel = lazy(() => import("../pages/Showreel/Showreel"));
const Trailers = lazy(() => import("../pages/Trailers/Trailers"));

// Lazy-loaded admin pages
const ProtectedRoute = lazy(() => import("../components/admin/ProtectedRoute"));
const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));
const Login = lazy(() => import("../pages/admin/Login"));
const DashboardHome = lazy(() => import("../pages/admin/DashboardHome"));
const ProjectsList = lazy(() => import("../pages/admin/ProjectsList"));
const ProjectForm = lazy(() => import("../pages/admin/ProjectForm"));
const TrailersList = lazy(() => import("../pages/admin/TrailersList"));
const TrailerForm = lazy(() => import("../pages/admin/TrailerForm"));
const AboutEditor = lazy(() => import("../pages/admin/AboutEditor"));
const ServicesList = lazy(() => import("../pages/admin/ServicesList"));
const CareersList = lazy(() => import("../pages/admin/CareersList"));
const ContactInfoEditor = lazy(() => import("../pages/admin/ContactInfoEditor"));
const MessagesInbox = lazy(() => import("../pages/admin/MessagesInbox"));

// Minimal loading fallback — matches the dark background for zero-flash experience
const PageLoader = () => (
  <div className="min-h-screen bg-space-900 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-zinc-600 border-t-zinc-200 rounded-full animate-spin" />
  </div>
);

// Wrapper that renders MainLayout with Outlet for nested public routes
const PublicLayout = () => (
  <MainLayout>
    <ScrollToTop />
    <Outlet />
  </MainLayout>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
};

export default AppRouter;
