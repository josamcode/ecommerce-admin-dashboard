import {
  Home,
  Box,
  MessageSquare,
  ShoppingCart,
  Grid,
  Users,
} from "lucide-react";
import { useContext } from "react";
import Link from "next/link";
import { SidebarContext } from "@/context/SidebarContext";

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useContext(SidebarContext);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { href: "/dashboard/products", label: "Products", icon: <Box size={20} /> },
    {
      href: "/dashboard/collections",
      label: "Collections",
      icon: <Grid size={20} />,
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: <MessageSquare size={20} />,
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: <Users size={20} />,
    },
    {
      href: "/dashboard/orders",
      label: "Orders",
      icon: <ShoppingCart size={20} />,
    },
  ];

  const handleLinkClick = () => {
    if (isOpen) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`fixed z-50 left-0 top-0 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="space-y-4 mt-20">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={handleLinkClick}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-700 transition-shadow duration-200 shadow-sm hover:shadow-md"
            >
              {item.icon}
              <span className="text-lg">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
