import { Menu } from "lucide-react";
import { useContext } from "react";
import { SidebarContext } from "@/context/SidebarContext";

export default function Navbar() {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg p-4 flex justify-between items-center px-8 z-50 static">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white">E-Shop Admin</h1>

      {/* Toggle Button for Sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-white p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors duration-200"
      >
        <Menu size={24} />
      </button>
      
      {/* Actions */}
      {/* <div className="space-x-6 text-white">
        <button className="hover:text-gray-400 transition-colors duration-200">Profile</button>
        <button className="hover:text-gray-400 transition-colors duration-200">Settings</button>
        <button className="hover:text-gray-400 transition-colors duration-200">Logout</button>
      </div> */}
    </nav>
  );
}
