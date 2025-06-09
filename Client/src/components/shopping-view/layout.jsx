
// import { Outlet } from "react-router-dom";
// import ShoppingHeader from "./header";
// import Footer from "./footer";
// import { FaWhatsapp } from "react-icons/fa";
// import SearchMenu from "@/components/shopping-view/search-menu"; // Adjust path if needed

// const ShoppingLayout = () => {
//   return (
//     <div className="flex flex-col min-h-screen bg-white overflow-hidden">
//       {/* Common header */}
//       <ShoppingHeader />

//       {/* Search Menu - Appears on all pages */}
//       <div className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-100 border-b border-gray-200">
//         <SearchMenu />
//       </div>

//       {/* Main Content */}
//       <main className="flex-grow w-full">
//         <Outlet />
//       </main>

//       {/* Floating WhatsApp Button */}
//       <a
//         href="https://wa.me/2348164014304?text=Hi,%20I%20would%20love%20to%20place%20an%20order"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="fixed bottom-6 right-6 bg-peach-500 text-green p-3 rounded-full shadow-lg hover:bg-peach-600 transition-all duration-300 flex items-center gap-2 z-50"
//       >
//         <FaWhatsapp size={35} />
//       </a>

//       {/* Common Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default ShoppingLayout;

import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";
import { FaWhatsapp } from "react-icons/fa";
import SearchMenu from "@/components/shopping-view/search-menu";

const ShoppingLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Fixed Header Section */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <ShoppingHeader />
        <div className="py-3 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
          <SearchMenu />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-[160px]"> {/* Adjust this value based on your header height */}
        <main className="flex-grow w-full">
          <Outlet />
        </main>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2348164014304?text=Hi,%20I%20would%20love%20to%20place%20an%20order"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 text-green-500 p-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 z-50"
      >
        <FaWhatsapp size={35} />
      </a>

      {/* Common Footer */}
      <Footer />
    </div>
  );
};

export default ShoppingLayout;