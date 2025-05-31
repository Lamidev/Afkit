// import { LogOut, Menu, ShoppingCart, User, Search } from "lucide-react";
// import {
//   Link,
//   useNavigate,
//   useSearchParams,
//   useLocation,
// } from "react-router-dom";
// import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { shoppingViewHeaderMenuItems } from "@/config"; // This import path remains the same
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuContent,
// } from "../ui/dropdown-menu";
// import {
//   Tooltip,
//   TooltipProvider,
//   TooltipContent,
//   TooltipTrigger,
// } from "../ui/tooltip";
// import { logoutUser } from "@/store/auth-slice";
// import { useEffect, useState } from "react";
// import { fetchCartItems } from "@/store/shop/cart-slice";
// import { Label } from "../ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "../ui/dialog";
// import Afkitlogo from "../../assets/afkit-logo.png";
// import UserCartWrapper from "../../components/shopping-view/cart-wrapper";

// function MenuItems({ closeSheet }) {
//   const navigate = useNavigate();
//   const location = useLocation(); // Keep if needed for other logic, but not for category handling here
//   const [searchParams, setSearchParams] = useSearchParams(); // Keep to manipulate URL search params

//   function handleNavigate(menuItem) {
//     // It's good practice to clear this, though with URL params, it's less critical for state persistence.
//     sessionStorage.removeItem("filters");

//     let targetPath = menuItem.path;
//     let newSearchParams = new URLSearchParams(searchParams); // Start with current search params

//     if (menuItem.path === "/shop/listing" && menuItem.id !== "products") {
//       newSearchParams.set("category", menuItem.id);
//       targetPath = "/shop/listing"; // Ensure we are always navigating to the base listing path
//     } else {
//     }

//     // Construct the full URL with or without search parameters
//     const fullPath = newSearchParams.toString()
//       ? `${targetPath}?${newSearchParams.toString()}`
//       : targetPath;

//     navigate(fullPath);
//     closeSheet(); // Close the sheet after navigation
//   }

//   return (
//     <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row lg:gap-8">
//       {shoppingViewHeaderMenuItems.map((menuItem) => (
//         <div key={menuItem.id} className="relative">
//           <Label
//             onClick={() => handleNavigate(menuItem)}
//             className="text-base font-medium cursor-pointer flex items-center gap-2 pb-1 hover:text-primary transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
//           >
//             {menuItem.label}
//           </Label>
//         </div>
//       ))}
//     </nav>
//   );
// }

// function HeaderRightContent({ closeSheet }) {
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const [openCartSheet, setOpenCartSheet] = useState(false);
//   const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   function handleLogout() {
//     dispatch(logoutUser());
//     setIsLogoutDialogOpen(false);
//     closeSheet();
//   }

//   useEffect(() => {
//     if (user?.Id) {
//       dispatch(fetchCartItems(user?.Id));
//     }
//   }, [dispatch, user?.Id]);

//   return (
//     <TooltipProvider>
//       <div className="flex lg:items-center lg:flex-row flex-col gap-6">
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={() => {
//                 navigate("/shop/search");
//                 closeSheet();
//               }}
//               variant="outline"
//               size="icon"
//               className="relative h-11 w-11"
//             >
//               <Search className="w-7 h-7" strokeWidth={2.5} />
//               <span className="sr-only">Search</span>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Search</TooltipContent>
//         </Tooltip>

//         <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
//           <SheetTrigger asChild>
//             <Tooltip>
//               <Button
//                 onClick={() => setOpenCartSheet(true)}
//                 variant="outline"
//                 size="icon"
//                 className="relative h-11 w-11"
//               >
//                 <ShoppingCart className="w-7 h-7" strokeWidth={2.5} />
//                 {cartItems?.items?.length > 0 && (
//                   <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">
//                     {cartItems.items.length}
//                   </span>
//                 )}
//                 <span className="sr-only">User cart</span>
//               </Button>
//               <TooltipContent>Cart</TooltipContent>
//             </Tooltip>
//           </SheetTrigger>

//           <UserCartWrapper
//             cartItems={cartItems?.items || []}
//             setOpenCartSheet={setOpenCartSheet}
//           />
//         </Sheet>

//         <Tooltip>
//           <TooltipTrigger asChild>
//             {user?.userName ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="icon" className="h-11 w-11">
//                     <User className="h-7 w-7" strokeWidth={2.5} />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent side="right" className="w-56">
//                   <DropdownMenuLabel>
//                     Logged in as {user?.userName}
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   {/* <DropdownMenuItem
//                     onClick={() => {
//                       navigate("/shop/account");
//                       closeSheet();
//                     }}
//                   >
//                     <User className="mr-2 h-5 w-5" /> Account
//                   </DropdownMenuItem> */}
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
//                     <LogOut className="mr-2 h-5 w-5" /> Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-11 w-11"
//                 onClick={() => {
//                   navigate("/auth/login");
//                   closeSheet();
//                 }}
//               >
//                 <User className="h-7 w-7" strokeWidth={2.5} />
//               </Button>
//             )}
//           </TooltipTrigger>
//           <TooltipContent>
//             {user?.userName ? "Account" : "Login"}
//           </TooltipContent>
//         </Tooltip>

//         <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Confirm Logout</DialogTitle>
//             </DialogHeader>
//             <p>Are you sure you want to log out?</p>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsLogoutDialogOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button variant="destructive" onClick={handleLogout}>
//                 Logout
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </TooltipProvider>
//   );
// }

// function ShoppingHeader() {
//   const [isSheetOpen, setIsSheetOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-background">
//       <div className="flex h-20 items-center justify-between px-4 md:px-6">
//         <Link to="/shop/home" className="flex items-center gap-2">
//           <img
//             src={Afkitlogo}
//             alt="Afkit Logo"
//             className="w-38 md:w-45 font-bold object-contain"
//           />
//         </Link>

//         <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
//           <SheetTrigger asChild>
//             <Button
//               variant="outline"
//               size="icon"
//               className="lg:hidden h-11 w-11"
//             >
//               <Menu className="h-7 w-7" strokeWidth={2.5} />
//               <span className="sr-only">Toggle header menu</span>
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-full max-w-xs">
//             {/* Pass closeSheet to MenuItems and HeaderRightContent */}
//             <MenuItems closeSheet={() => setIsSheetOpen(false)} />
//             <HeaderRightContent closeSheet={() => setIsSheetOpen(false)} />
//           </SheetContent>
//         </Sheet>

//         {/* Desktop menu items and right content */}
//         <div className="hidden lg:block">
//           <MenuItems closeSheet={() => setIsSheetOpen(false)} />
//         </div>

//         <div className="hidden lg:block">
//           <HeaderRightContent closeSheet={() => setIsSheetOpen(false)} />
//         </div>
//       </div>
//     </header>
//   );
// }

// export default ShoppingHeader;

import { LogOut, Menu, ShoppingCart, User, Search } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function MenuItems({ closeSheet }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function handleNavigate(menuItem) {
    sessionStorage.removeItem("filters");
    
    if (menuItem.id === "products") {
      // Base products page - clear all filters
      navigate("/shop/listing");
    } else if (menuItem.path === "/shop/listing") {
      // Category page - set category and clear other filters
      navigate(`/shop/listing?category=${menuItem.id}`);
    } else {
      // Regular pages (home, about, etc)
      navigate(menuItem.path);
    }
    
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
      <div className="flex items-center gap-4">
        {/* Search - Hidden on mobile */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => {
                navigate("/shop/search");
                closeSheet();
              }}
              className="hidden lg:flex p-2 hover:bg-accent rounded-full transition-colors"
            >
              <Search className="h-5 w-5 stroke-[2.5px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>

        {/* Cart */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => setOpenCartSheet(true)}
              className="p-2 hover:bg-accent rounded-full transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5 stroke-[2.5px]" />
              {cartItems?.items?.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {cartItems.items.length}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>Cart</TooltipContent>
        </Tooltip>

        {/* User */}
        <Tooltip>
          <TooltipTrigger asChild>
            {user?.userName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-accent rounded-full transition-colors">
                    <User className="h-5 w-5 stroke-[2.5px]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                  <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
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
                className="p-2 hover:bg-accent rounded-full transition-colors"
              >
                <User className="h-5 w-5 stroke-[2.5px]" />
              </button>
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

        <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
          <UserCartWrapper
            cartItems={cartItems?.items || []}
            setOpenCartSheet={setOpenCartSheet}
          />
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

function ShoppingHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        {/* Mobile Left Side (Hamburger + Logo) */}
        <div className="flex items-center gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-1 -ml-1 lg:hidden">
                <Menu className="h-6 w-6 stroke-[2.5px]" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <div className="flex flex-col h-full justify-between">
                <div className="pt-6">
                  <MenuItems closeSheet={() => setIsSheetOpen(false)} />
                </div>
                
                {/* User section at bottom */}
                {!user && (
                  <div className="pb-6 space-y-3">
                    <Button 
                      onClick={() => {
                        navigate("/auth/login");
                        setIsSheetOpen(false);
                      }}
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        navigate("/auth/register");
                        setIsSheetOpen(false);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/shop/home" className="ml-1">
            <img
              src={Afkitlogo}
              alt="Afkit Logo"
              className="h-8 object-contain"
            />
          </Link>
        </div>

        {/* Desktop Menu Items (center) */}
        <div className="hidden lg:block">
          <MenuItems closeSheet={() => setIsSheetOpen(false)} />
        </div>

        {/* Right Icons (Cart + User) - visible on all screens */}
        <HeaderRightContent closeSheet={() => setIsSheetOpen(false)} />
      </div>
    </header>
  );
}

export default ShoppingHeader;
