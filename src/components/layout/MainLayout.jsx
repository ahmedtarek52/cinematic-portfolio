// MainLayout.jsx
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-space-900 text-white">
      {/* Navbar full width */}
      <div className="w-full border-b border-gray-600">
        <Navbar />
      </div>

      <div className="flex">
        {/* Sidebar only visible on desktop */}
        <div className="hidden lg:block mt-6 ml-8 border border-[#2a2a2a] rounded-xl min-w-[250px] p-4">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main className="flex-1 px-6 py-4">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
