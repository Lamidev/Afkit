
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { AlignJustify, LogOut, ChevronDown } from "lucide-react";
import { logoutUser } from "@/store/auth-slice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const adminMenuItems = [
  { id: "all-products", label: "All Products", path: "/admin/products" },
  { id: "smartphones", label: "Smartphones", path: "/admin/products?category=smartphones" },
  { id: "laptops", label: "Laptops", path: "/admin/products?category=laptops" },
  { id: "monitors", label: "Monitors", path: "/admin/products?category=monitors" },
  { id: "accessories", label: "Accessories", path: "/admin/products?category=accessories" },
];

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/shop/home");
    });
    setIsLogoutDialogOpen(false);
  }

  const isActive = (path) => {
    if (path === "/admin/products") {
      return location.pathname === "/admin/products" && !location.search.includes("category=");
    }
    const currentPath = location.pathname + location.search;
    return currentPath === path;
  };

  const getCurrentCategoryLabel = () => {
    const urlParams = new URLSearchParams(location.search);
    const urlCategory = urlParams.get("category");
    if (urlCategory) {
      const categoryItem = adminMenuItems.find((item) => item.id === urlCategory);
      if (categoryItem) return categoryItem.label;
    }
    return "All Products";
  };

  const handleCategoryChange = (path) => {
    navigate(path);
    setIsCategoryDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setOpen(true)}
          className="lg:hidden rounded"
          variant="outline"
          size="icon"
        >
          <AlignJustify size={20} />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="lg:hidden relative" ref={dropdownRef}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {user?.userName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{user?.userName}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="flex items-center space-x-2 min-w-[160px] justify-between px-3 py-2"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          >
            <span className="truncate">{getCurrentCategoryLabel()}</span>
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </Button>

          {isCategoryDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[220px] overflow-hidden">
              <div className="flex flex-col divide-y divide-gray-100">
                {adminMenuItems.map((menuItem) => (
                  <button
                    key={menuItem.id}
                    className={`text-left w-full px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(menuItem.path)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleCategoryChange(menuItem.path)}
                  >
                    {menuItem.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="hidden lg:flex items-center gap-1 mx-auto">
        {adminMenuItems.map((menuItem) => (
          <Link
            key={menuItem.id}
            to={menuItem.path}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(menuItem.path)
                ? "bg-blue-900 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {menuItem.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="hidden md:flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {user?.userName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{user?.userName}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>

        <Button
          onClick={() => setIsLogoutDialogOpen(true)}
          className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium shadow rounded"
          variant="outline"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Log Out</span>
        </Button>
      </div>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to log out?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default AdminHeader;
