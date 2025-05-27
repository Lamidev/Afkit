


import { LogOut, Menu, ShoppingCart, User, Search } from "lucide-react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { logoutUser } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
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

function MenuItems({ closeSheet }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");

    if (
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "about"
    ) {
      const currentFilter = { category: [getCurrentMenuItem.id] };
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));

      if (location.pathname.includes("listing")) {
        setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
        return;
      }
    }

    navigate(getCurrentMenuItem.path);
    closeSheet();
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row lg:gap-8">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="relative">
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-base font-medium cursor-pointer flex items-center gap-2 pb-1 hover:text-primary transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            {menuItem.label}
          </Label>
        </div>
      ))}
    </nav>
  );
}

function HeaderRightContent({ closeSheet }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    setIsLogoutDialogOpen(false);
    closeSheet();
  }

  useEffect(() => {
    if (user?.Id) {
      dispatch(fetchCartItems(user?.Id));
    }
  }, [dispatch, user?.Id]);

  return (
    <TooltipProvider>
      <div className="flex lg:items-center lg:flex-row flex-col gap-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                navigate("/shop/search");
                closeSheet();
              }}
              variant="outline"
              size="icon"
              className="relative h-11 w-11"
            >
              <Search className="w-7 h-7" strokeWidth={2.5} />
              <span className="sr-only">Search</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>

        <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
          <SheetTrigger asChild>
            <Tooltip>
              <Button
                onClick={() => setOpenCartSheet(true)}
                variant="outline"
                size="icon"
                className="relative h-11 w-11"
              >
                <ShoppingCart className="w-7 h-7" strokeWidth={2.5} />
                {cartItems?.items?.length > 0 && (
                  <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">
                    {cartItems.items.length}
                  </span>
                )}
                <span className="sr-only">User cart</span>
              </Button>
              <TooltipContent>Cart</TooltipContent>
            </Tooltip>
          </SheetTrigger>

          <UserCartWrapper
            cartItems={cartItems?.items || []}
            setOpenCartSheet={setOpenCartSheet}
          />
        </Sheet>

        <Tooltip>
          <TooltipTrigger asChild>
            {user?.userName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-11 w-11">
                    <User className="h-7 w-7" strokeWidth={2.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                  <DropdownMenuLabel>
                    Logged in as {user?.userName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuItem
                    onClick={() => {
                      navigate("/shop/account");
                      closeSheet();
                    }}
                  >
                    <User className="mr-2 h-5 w-5" /> Account
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                    <LogOut className="mr-2 h-5 w-5" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
                onClick={() => {
                  navigate("/auth/login");
                  closeSheet();
                }}
              >
                <User className="h-7 w-7" strokeWidth={2.5} />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>{user?.userName ? "Account" : "Login"}</TooltipContent>
        </Tooltip>

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
      </div>
    </TooltipProvider>
  );
}

function ShoppingHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <img
            src={Afkitlogo}
            alt="Afkit Logo"
            className="w-38 md:w-45 font-bold object-contain"
          />
        </Link>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden h-11 w-11">
              <Menu className="h-7 w-7" strokeWidth={2.5} />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems closeSheet={() => setIsSheetOpen(false)} />
            <HeaderRightContent closeSheet={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
        
        <div className="hidden lg:block">
          <MenuItems closeSheet={() => setIsSheetOpen(false)} />
        </div>
        
        <div className="hidden lg:block">
          <HeaderRightContent closeSheet={() => setIsSheetOpen(false)} />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;