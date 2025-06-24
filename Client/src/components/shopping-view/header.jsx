import { LogOut, Menu, ShoppingCart, User, Search, ChevronDown } from "lucide-react";
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
    const [searchParams] = useSearchParams(); // Keep if you still need to read search params in MenuItems for other logic
    const [expandedMenu, setExpandedMenu] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Subcategories mapping
    const subCategories = {
        products: [
            { id: "all-products", label: "All Products", path: "/shop/listing" }
        ],
        smartphones: [
            { id: "all-smartphones", label: "All Smartphones", path: "/shop/listing?category=smartphones" },
            { id: "apple", label: "Apple", path: "/shop/listing?category=smartphones&brand=apple" },
            { id: "samsung", label: "Samsung", path: "/shop/listing?category=smartphones&brand=samsung" },
            { id: "google-pixel", label: "Google Pixel", path: "/shop/listing?category=smartphones&brand=google-pixel" }
        ],
        laptops: [
            { id: "all-laptops", label: "All Laptops", path: "/shop/listing?category=laptops" },
            { id: "basic", label: "Basic Laptops", path: "/shop/listing?category=laptops&laptopType=basic" },
            { id: "business", label: "Business Laptops", path: "/shop/listing?category=laptops&laptopType=business" },
            { id: "gaming", label: "Gaming Laptops", path: "/shop/listing?category=laptops&laptopType=gaming" }
        ],
        monitors: [
            { id: "all-monitors", label: "All Monitors", path: "/shop/listing?category=monitors" },
            { id: "office-monitors", label: "Office Monitors", path: "/shop/listing?category=monitors&monitorType=office-monitors" },
            { id: "gaming-monitors", label: "Gaming Monitors", path: "/shop/listing?category=monitors&monitorType=gaming-monitors" },
            { id: "curved-monitors", label: "Curved Monitors", path: "/shop/listing?category=monitors&monitorType=curved-monitors" }
        ],
        accessories: [
            { id: "all-accessories", label: "All Accessories", path: "/shop/listing?category=accessories" },
            { id: "smartphone-accessories", label: "Phone Accessories", path: "/shop/listing?category=accessories&accessoryCategory=smartphone-accessories" },
            { id: "laptop-accessories", label: "Laptop Accessories", path: "/shop/listing?category=accessories&accessoryCategory=laptop-accessories" },
            { id: "monitor-accessories", label: "Monitor Accessories", path: "/shop/listing?category=accessories&accessoryCategory=monitor-accessories" },
            { id: "other-accessories", label: "Other Accessories", path: "/shop/listing?category=accessories&accessoryCategory=other-accessories" }
        ]
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function handleNavigate(menuItem) {
        // Clear all stored filters, price range, and sort when navigating via header
        sessionStorage.removeItem("filters");
        sessionStorage.removeItem("priceRange");
        sessionStorage.removeItem("sort");

        const path = menuItem.id === "products" ? "/shop/listing" :
            menuItem.id === "smartphones" ? "/shop/listing?category=smartphones" :
                menuItem.id === "laptops" ? "/shop/listing?category=laptops" :
                    menuItem.id === "monitors" ? "/shop/listing?category=monitors" :
                        menuItem.id === "accessories" ? "/shop/listing?category=accessories" :
                            menuItem.path;

        navigate(path);
        closeSheet();
    }

    function handleSubItemNavigate(subItem) {
        // Clear all stored filters, price range, and sort before applying new ones
        sessionStorage.removeItem("filters");
        sessionStorage.removeItem("priceRange");
        sessionStorage.removeItem("sort");
        navigate(subItem.path); // Use the subItem's path directly
        closeSheet();
    }

    function toggleSubMenu(menuId) {
        setExpandedMenu(expandedMenu === menuId ? null : menuId);
    }

    return (
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row lg:gap-8">
            {shoppingViewHeaderMenuItems.map((menuItem) => {
                const isCategoryWithSubItems = ["products", "smartphones", "laptops", "monitors", "accessories"].includes(menuItem.id);
                const relevantSubCategories = subCategories[menuItem.id];

                return (
                    <div key={menuItem.id} className="relative">
                        {isMobile && isCategoryWithSubItems ? (
                            <div className="flex flex-col">
                                <div
                                    className="flex items-center justify-between"
                                    onClick={() => toggleSubMenu(menuItem.id)}
                                >
                                    <Label
                                        className="text-base font-medium cursor-pointer flex items-center gap-2 pb-1 hover:text-primary transition-colors"
                                    >
                                        {menuItem.label}
                                    </Label>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${expandedMenu === menuItem.id ? 'rotate-180' : ''}`}
                                    />
                                </div>

                                {expandedMenu === menuItem.id && (
                                    <div className="ml-4 mt-2 space-y-2">
                                        {relevantSubCategories?.map((subItem) => (
                                            <Label
                                                key={subItem.id}
                                                onClick={() => handleSubItemNavigate(subItem)}
                                                className="text-sm font-medium cursor-pointer flex items-center gap-2 pb-1 hover:text-primary transition-colors pl-2 border-l-2 border-gray-200"
                                            >
                                                {subItem.label}
                                            </Label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Label
                                onClick={() => handleNavigate(menuItem)}
                                className="text-base font-medium cursor-pointer flex items-center gap-2 pb-1 hover:text-primary transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {menuItem.label}
                            </Label>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

// ... (HeaderRightContent and ShoppingHeader components remain unchanged)
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