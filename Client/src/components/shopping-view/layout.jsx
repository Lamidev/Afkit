
// import { Outlet } from "react-router-dom";
// import ShoppingHeader from "./header";
// import Footer from "./footer";
// import { FaWhatsapp } from "react-icons/fa";
// import SearchMenu from "@/components/shopping-view/search-menu";

// const ShoppingLayout = () => {
//   return (
//     <div className="flex flex-col min-h-screen bg-white overflow-hidden">
//       {/* Fixed Header Section */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
//         <ShoppingHeader />
//         <div className="py-3 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
//           <SearchMenu />
//         </div>
//       </div>

//       {/* Scrollable Content */}
//       <div className="pt-[160px]"> {/* Adjust this value based on your header height */}
//         <main className="flex-grow w-full">
//           <Outlet />
//         </main>
//       </div>

//       {/* Floating WhatsApp Button */}
//       <a
//         href="https://wa.me/2348164014304?text=Hi,%20I%20would%20love%20to%20place%20an%20order"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="fixed bottom-6 right-6 text-green-500 p-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 z-50"
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
import SearchMenu from "@/components/shopping-view/search-menu";
import whatappimg from "../../assets/whatsppicon.webp"

const ShoppingLayout = () => {
  const whatsappPhoneNumber = "2348164014304";
  const whatsappMessage = "Hi, I would love to place an order";
  const whatsappLink = `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

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

      {/* Floating WhatsApp Button using the provided image */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 p-0 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-50"
        style={{ width: '60px', height: '60px', overflow: 'hidden' }} // Example size, adjust as needed
      >
        <img
          src={whatappimg} // Adjust this path based on where you put the image file
          alt="WhatsApp Chat"
          className="w-full h-full object-cover" // Ensure the image covers the container
        />
      </a>


      {/* Common Footer */}
      <Footer />
    </div>
  );
};

export default ShoppingLayout;