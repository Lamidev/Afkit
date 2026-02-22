import { motion } from "framer-motion";
import {
  LogOut,
  Menu,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { logoutUser } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { fetchCartItems, setOpenCartSheet } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import Afkitlogo from "../../assets/afkit-logo.png";
import UserCartWrapper from "../../components/shopping-view/cart-wrapper";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import NotificationCenter from "./notification-center";

function MenuItems({ closeSheet }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const subCategories = {
    products: [
      { id: "all-products", label: "All Products", path: "/shop/listing" },
    ],
    smartphones: [
      {
        id: "all-smartphones",
        label: "All Smartphones",
        path: "/shop/listing?category=smartphones",
      },
      {
        id: "apple",
        label: "Apple",
        path: "/shop/listing?category=smartphones&brand=apple",
      },
      {
        id: "samsung",
        label: "Samsung",
        path: "/shop/listing?category=smartphones&brand=samsung",
      },
      {
        id: "google-pixel",
        label: "Google Pixel",
        path: "/shop/listing?category=smartphones&brand=google-pixel",
      },
    ],
    laptops: [
      {
        id: "all-laptops",
        label: "All Laptops",
        path: "/shop/listing?category=laptops",
      },
      {
        id: "basic",
        label: "Basic Laptops",
        path: "/shop/listing?category=laptops&laptopType=basic",
      },
      {
        id: "business",
        label: "Business Laptops",
        path: "/shop/listing?category=laptops&laptopType=business",
      },
      {
        id: "gaming",
        label: "Gaming Laptops",
        path: "/shop/listing?category=laptops&laptopType=gaming",
      },
    ],
    monitors: [
      {
        id: "all-monitors",
        label: "All Monitors",
        path: "/shop/listing?category=monitors",
      },
      {
        id: "office-monitors",
        label: "Office Monitors",
        path: "/shop/listing?category=monitors&monitorType=office-monitors",
      },
      {
        id: "gaming-monitors",
        label: "Gaming Monitors",
        path: "/shop/listing?category=monitors&monitorType=gaming-monitors",
      },
      {
        id: "curved-monitors",
        label: "Curved Monitors",
        path: "/shop/listing?category=monitors&monitorType=curved-monitors",
      },
    ],
    accessories: [
      {
        id: "all-accessories",
        label: "All Accessories",
        path: "/shop/listing?category=accessories",
      },
      {
        id: "smartphone-accessories",
        label: "Phone Accessories",
        path: "/shop/listing?category=accessories&accessoryCategory=smartphone-accessories",
      },
      {
        id: "laptop-accessories",
        label: "Laptop Accessories",
        path: "/shop/listing?category=accessories&accessoryCategory=laptop-accessories",
      },
      {
        id: "monitor-accessories",
        label: "Monitor Accessories",
        path: "/shop/listing?category=accessories&accessoryCategory=monitor-accessories",
      },
      {
        id: "other-accessories",
        label: "Other Accessories",
        path: "/shop/listing?category=accessories&accessoryCategory=other-accessories",
      },
    ],
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleNavigate(menuItem) {
    sessionStorage.removeItem("filters");
    sessionStorage.removeItem("priceRange");
    sessionStorage.removeItem("sort");

    let path =
      menuItem.id === "products"
        ? "/shop/listing"
        : menuItem.id === "smartphones"
        ? "/shop/listing?category=smartphones"
        : menuItem.id === "laptops"
        ? "/shop/listing?category=laptops"
        : menuItem.id === "monitors"
        ? "/shop/listing?category=monitors"
        : menuItem.id === "accessories"
        ? "/shop/listing?category=accessories"
        : menuItem.path;

    // Consistency: Apply latest-arrival sort to category links if not present
    if (path.includes("/shop/listing") && !path.includes("sort=")) {
      const separator = path.includes("?") ? "&" : "?";
      path = `${path}${separator}sort=latest-arrival`;
    }

    navigate(path);
    closeSheet();
  }

  function handleSubItemNavigate(subItem) {
    sessionStorage.removeItem("filters");
    sessionStorage.removeItem("priceRange");
    sessionStorage.removeItem("sort");
    
    let path = subItem.path;
    // Consistency: Apply latest-arrival sort to category links if not present
    if (path.includes("/shop/listing") && !path.includes("sort=")) {
      const separator = path.includes("?") ? "&" : "?";
      path = `${path}${separator}sort=latest-arrival`;
    }
    
    navigate(path);
    closeSheet();
  }

  function toggleSubMenu(menuId) {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  }

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center lg:gap-8 gap-1">
      {shoppingViewHeaderMenuItems.map((menuItem) => {
        const isCategoryWithSubItems = [
          "products",
          "smartphones",
          "laptops",
          "monitors",
          "accessories",
        ].includes(menuItem.id);
        const relevantSubCategories = subCategories[menuItem.id];

        return (
          <div key={menuItem.id} className="relative">
            {isMobile && isCategoryWithSubItems ? (
              <div className="flex flex-col">
                <div
                  className="flex items-center justify-between py-3 border-b border-slate-50 lg:border-none"
                  onClick={() => toggleSubMenu(menuItem.id)}
                >
                  <span className="text-base font-bold cursor-pointer flex items-center gap-2 hover:text-primary transition-colors text-slate-700">
                    {menuItem.label}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      expandedMenu === menuItem.id ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {expandedMenu === menuItem.id && (
                  <div className="ml-4 mt-2 space-y-2 mb-2">
                    {relevantSubCategories?.map((subItem) => (
                      <span
                        key={subItem.id}
                        onClick={() => handleSubItemNavigate(subItem)}
                        className="text-sm font-semibold cursor-pointer flex items-center gap-2 py-2 hover:text-primary transition-colors pl-4 border-l-2 border-orange-100 text-slate-600"
                      >
                        {subItem.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigate(menuItem)}
                className="text-base font-bold lg:font-medium cursor-pointer flex items-center gap-2 py-3 lg:py-2 hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full border-b border-slate-50 lg:border-none w-full lg:w-auto text-left text-slate-700 lg:text-inherit focus-visible:outline-none"
              >
                {menuItem.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function HeaderRightContent({ closeSheet, setIsLogoutDialogOpen }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems, openCartSheet } = useSelector((state) => state.shopCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems({ userId: user?.id }));
    }
  }, [dispatch, user?.id]);

  const setOpenCartSheetLocal = (val) => {
    dispatch(setOpenCartSheet(val));
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        {user ? (
          <NotificationCenter />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  navigate("/shop/search");
                  closeSheet();
                }}
                className="flex p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Search className="h-5 w-5 stroke-[2.5px] text-primary" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setOpenCartSheetLocal(true)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5 stroke-[2.5px] text-primary" />
              {cartItems?.items?.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {cartItems.items.length}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>Cart</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            {user?.userName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden lg:flex p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <User className="h-5 w-5 stroke-[2.5px] text-primary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                  <DropdownMenuLabel>
                    Logged in as {user?.userName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                    <User className="mr-2 h-5 w-5" /> Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                    <LogOut className="mr-2 h-5 w-5" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => {
                  navigate("/auth/login");
                  closeSheet();
                }}
                className="hidden lg:flex p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <User className="h-5 w-5 stroke-[2.5px] text-primary" />
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {user?.userName ? "Account" : "Login"}
          </TooltipContent>
        </Tooltip>

        <Sheet open={openCartSheet} onOpenChange={setOpenCartSheetLocal}>
          <UserCartWrapper
            cartItems={cartItems?.items || []}
            setOpenCartSheet={setOpenCartSheetLocal}
          />
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

function ShoppingHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      navigate("/shop/home");
      window.location.reload(); // Force a clean state refresh
    });
    setIsLogoutDialogOpen(false);
    setIsSheetOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-1 -ml-1 lg:hidden">
                <Menu className="h-6 w-6 stroke-[2.5px]" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] px-4">
              <div className="flex flex-col h-full justify-between">
                <div className="pt-2 sm:pt-4 space-y-6">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <img
                      src={Afkitlogo}
                      alt="Afkit Logo"
                      className="h-6 object-contain"
                    />
                  </div>
                  <MenuItems closeSheet={() => setIsSheetOpen(false)} />
                </div>

                <div className="pb-6 space-y-4">
                  {user ? (
                    <>
                      <div className="px-2 py-4 border-t border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active User</p>
                        <p className="text-sm font-bold text-slate-900">{user.userName}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/shop/account");
                          setIsSheetOpen(false);
                        }}
                        className="w-full justify-start gap-3 rounded-xl h-12 border-slate-200"
                      >
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-bold">My Account</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsLogoutDialogOpen(true)}
                        className="w-full justify-start gap-3 rounded-xl h-12 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-bold">Logout</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          navigate("/auth/login");
                          setIsSheetOpen(false);
                        }}
                        className="w-full rounded-xl h-12 font-bold"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => {
                          navigate("/auth/register");
                          setIsSheetOpen(false);
                        }}
                        variant="outline"
                        className="w-full rounded-xl h-12 font-bold border-slate-200"
                      >
                        Register
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/shop/home" className="ml-1">
            <img
              src={Afkitlogo}
              alt="Afkit Logo"
              className="h-6 object-contain"
            />
          </Link>
        </div>

        <div className="hidden lg:block">
          <MenuItems closeSheet={() => setIsSheetOpen(false)} />
        </div>

        <HeaderRightContent 
          closeSheet={() => setIsSheetOpen(false)} 
          setIsLogoutDialogOpen={setIsLogoutDialogOpen}
        />
      </div>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="rounded-3xl max-w-[340px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-slate-500 font-medium">Are you sure you want to exit your Afkit session?</p>
          <DialogFooter className="flex-col sm:flex-row gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
              className="w-full sm:flex-1 rounded-xl h-12 font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="w-full sm:flex-1 rounded-xl h-12 font-black uppercase tracking-tight shadow-lg shadow-red-200"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default ShoppingHeader;
