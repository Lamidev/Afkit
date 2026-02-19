
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Mapping of paths to readable names
  const breadcrumbNameMap = {
    shop: "Shop",
    listing: "Products",
    home: "Home",
    checkout: "Checkout",
    account: "Account",
    product: "Product Detail",
    debate: "Debate Contest",
    search: "Search Results",
  };

  if (
    location.pathname === "/shop/home" ||
    location.pathname === "/shop/" ||
    location.pathname === "/shop/checkout"
  ) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-400 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link
        to="/shop/home"
        className="flex items-center hover:text-primary transition-colors gap-1"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        
        let name = breadcrumbNameMap[value] || value;
        
        // Skip 'shop' as we already have 'Home' link or it's redundant
        if (value === "shop") return null;

        // Enhanced: If it's a product URL segment (contains a 24-char ID or GAD ID)
        if (pathnames[index - 1] === "product") {
          const gadMatch = value.toUpperCase().match(/GAD-[A-Z0-9]{6}/);
          name = gadMatch ? gadMatch[0] : "Product Detail";
        } else if (value.length >= 24) {
          name = "Product Detail";
        }

        // Don't make 'product' part of path clickable if it's the parent of an ID
        const isProductParent = value === "product" && !last;

        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            {last || isProductParent ? (
              <span className={last ? "text-slate-900" : ""}>{name}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-primary transition-colors"
              >
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
