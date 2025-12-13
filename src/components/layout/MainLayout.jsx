// MainLayout.jsx
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-space-900 text-white">
      {/* Navbar full width */}
      <div className="w-full ">
        <Navbar />
      </div>
{/* 
      <div className="flex">

        <div className="hidden lg:block mt-6 ml-8 border border-[#2a2a2a] rounded-xl min-w-[250px] p-4">
          <Sidebar />
        </div>

      </div> */}

        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
