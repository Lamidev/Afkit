


export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your username",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

// Product form elements
export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter gadget title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter gadget description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "smartphones", label: "Smartphones" },
      { id: "laptops", label: "Laptops" },
      { id: "monitors", label: "Monitors" },
      { id: "accessories", label: "Accessories" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [], // Options will be dynamically loaded in the front-end based on selected category
    visibleIf: { field: "category", value: ["smartphones", "laptops", "monitors"] }, // Brand applies to these
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter gadget price",
  },
  {
    label: "Storage",
    name: "storage",
    componentType: "select",
    options: [], // Options will be dynamically loaded in the front-end based on selected category
    visibleIf: { field: "category", value: ["smartphones", "laptops"] },
  },
  {
    label: "RAM",
    name: "ram",
    componentType: "select",
    options: [], // Options will be dynamically loaded in the front-end based on selected category
    visibleIf: { field: "category", value: ["smartphones", "laptops"] },
  },
  {
    label: "Processor",
    name: "processor",
    componentType: "select",
    options: [], // Options will be dynamically loaded in the front-end based on selected category
    visibleIf: { field: "category", value: "laptops" },
  },
  {
    label: "Display Type",
    name: "displayType",
    componentType: "select",
    options: [], // Options will be dynamically loaded in the front-end based on selected category
    visibleIf: { field: "category", value: "laptops" },
  },
  {
    label: "Laptop Type",
    name: "laptopType",
    componentType: "select",
    options: [], // Options will be dynamically loaded in the front-end based on selected category
    visibleIf: { field: "category", value: "laptops" },
  },
  // NEW: Monitor-specific fields
  {
    label: "Screen Size",
    name: "screenSize",
    componentType: "select",
    options: [], // Options will be dynamically loaded
    visibleIf: { field: "category", value: "monitors" },
  },
  {
    label: "Frame Style",
    name: "frameStyle",
    componentType: "select",
    options: [], // Options will be dynamically loaded
    visibleIf: { field: "category", value: "monitors" },
  },
  {
    label: "Screen Resolution",
    name: "screenResolution",
    componentType: "select",
    options: [], // Options will be dynamically loaded
    visibleIf: { field: "category", value: "monitors" },
  },
  {
    label: "Ports",
    name: "ports",
    componentType: "select",
    options: [], // Options will be dynamically loaded
    visibleIf: { field: "category", value: "monitors" },
  },
  // NEW: Accessory-specific categories and types
  {
    label: "Accessory Type",
    name: "accessoryCategory",
    componentType: "select",
    options: [
      { id: "smartphone-accessories", label: "Smartphone Accessories" },
      { id: "laptop-accessories", label: "Laptop Accessories" },
      { id: "monitor-accessories", label: "Monitor Accessories" },
      { id: "other-accessories", label: "Other Accessories" },
    ],
    visibleIf: { field: "category", value: "accessories" },
  },
  {
    label: "Specific Accessory",
    name: "specificAccessory",
    componentType: "select",
    options: [], // Dynamically loaded based on accessoryCategory
    visibleIf: { field: "accessoryCategory", value: ["smartphone-accessories", "laptop-accessories", "monitor-accessories", "other-accessories"] },
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
  {
    label: "Condition",
    name: "condition",
    componentType: "select",
    options: [
      { id: "Brand New", label: "Brand New" },
      { id: "UK Used", label: "UK Used" },
    ],
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing", // Base path for all products, no category filter initially
  },
  {
    id: "smartphones",
    label: "Smartphones",
    path: "/shop/listing", // All categories will now point to the base listing path
  },
  {
    id: "laptops",
    label: "Laptops",
    path: "/shop/listing", // All categories will now point to the base listing path
  },
  {
    id: "monitors",
    label: "Monitors",
    path: "/shop/listing", // All categories will now point to the base listing path
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing", // All categories will now point to the base listing path
  },
  {
    id: "about",
    label: "About",
    path: "/shop/about",
  },
];


export const categoryOptionsMap = {
  smartphones: "Smartphones",
  laptops: "Laptops",
  monitors: "Monitors",
  accessories: "Accessories",
};

export const brandOptionsMap = {
  apple: "Apple",
  samsung: "Samsung",
  dell: "Dell",
  hp: "HP",
  lenovo: "Lenovo",
  google: "Google",
  asus: "Asus", // Added missing brands
  lg: "Lg" // Added missing brands
};

export const filterOptions = {
  // Common options available for all categories
  priceRange: {
    min: 0,
    max: 5000000,
  },
  condition: [
    { id: "Brand New", label: "Brand New" },
    { id: "UK Used", label: "UK Used" },
  ],

  // Category-specific options (completely separated for filtering)
  smartphones: {
    brand: [
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "google", label: "Google" },
    ],
    storage: [
      { id: "64GB", label: "64GB" },
      { id: "128GB", label: "128GB" },
      { id: "256GB", label: "256GB" },
      { id: "512GB", label: "512GB" },
      { id: "1TB", label: "1TB" },
    ],
    ram: [
      { id: "4GB", label: "4GB" },
      { id: "6GB", label: "6GB" },
      { id: "8GB", label: "8GB" },
      { id: "12GB", label: "12GB" },
      { id: "16GB", label: "16GB" },
    ],
  },

  laptops: {
    brand: [
      { id: "hp", label: "HP" },
      { id: "dell", label: "Dell" },
      { id: "lenovo", label: "Lenovo" },
      { id: "apple", label: "Apple" },
    ],
    processor: [
      { id: "intel-i3", label: "Intel Core i3" },
      { id: "intel-i5", label: "Intel Core i5" },
      { id: "intel-i7", label: "Intel Core i7" },
      { id: "intel-i9", label: "Intel Core i9" },
      { id: "intel-celeron", label: "Intel Celeron" },
      { id: "intel-pentium", label: "Intel Pentium" },
      { id: "amd-ryzen3", label: "AMD Ryzen 3" },
      { id: "amd-ryzen5", label: "AMD Ryzen 5" },
      { id: "amd-ryzen7", label: "AMD Ryzen 7" },
      { id: "apple-m1", label: "Apple M1" },
      { id: "apple-m2", label: "Apple M2" },
    ],
    storage: [
      { id: "500GB-HDD", label: "500GB HDD" },
      { id: "1TB-HDD", label: "1TB HDD" },
      { id: "128GB-SSD", label: "128GB SSD" },
      { id: "256GB-SSD", label: "256GB SSD" },
      { id: "512GB-SSD", label: "512GB SSD" },
      { id: "1TB-SSD", label: "1TB SSD" },
    ],
    ram: [
      { id: "4GB", label: "4GB" },
      { id: "8GB", label: "8GB" },
      { id: "16GB", label: "16GB" },
      { id: "24GB", label: "24GB" },
      { id: "32GB", label: "32GB" },
      { id: "64GB", label: "64GB" },
    ],
    laptopType: [
      { id: "basic", label: "Basic Laptop" },
      { id: "business", label: "Business Laptop" },
      { id: "gaming", label: "Gaming Laptop" },
    ],
    displayType: [
      { id: "non-touchscreen", label: "Non-Touchscreen" },
      { id: "touchscreen", label: "Touchscreen" },
      { id: "x360-convertible", label: "x360 Convertible" },
    ],
  },

  monitors: {
    brand: [
      { id: "hp", label: "HP" },
      { id: "dell", label: "Dell" },
      { id: "samsung", label: "Samsung" },
      { id: "asus", label: "Asus" },
      { id: "lg", label: "Lg" },
    ],
    screenSize: [
      { id: "24", label: "24 inches" },
      { id: "27", label: "27 inches" },
      { id: "28", label: "28 inches" },
      { id: "32", label: "32 inches" },
      { id: "34", label: "34 inches" },
    ],
    frameStyle: [
      { id: "thick", label: "Thick Frame" },
      { id: "tiny", label: "Tiny Frame" },
      { id: "frameless", label: "Frameless" },
    ],
    screenResolution: [
      { id: "1080p", label: "1080p Display" },
      { id: "2k", label: "2K Display" },
      { id: "4k", label: "4K Display" },
    ],
    ports: [
      { id: "hdmi", label: "HDMI" },
      { id: "type-c", label: "Type-C Port" },
      { id: "display-port", label: "Display Port" },
      { id: "vga", label: "VGA Port" },
      { id: "usb", label: "USB Port" },
    ],
  },

  accessories: {
    category: [
      { id: "smartphone-accessories", label: "Smartphone Accessories" },
      { id: "laptop-accessories", label: "Laptop Accessories" },
      { id: "monitor-accessories", label: "Monitor Accessories" },
      { id: "other-accessories", label: "Other Accessories" },
    ],
    smartphoneAccessories: [
      { id: "charger", label: "Charger" },
      { id: "screen-protector", label: "Screen Protectors" },
      { id: "pouch", label: "Pouch" },
    ],
    laptopAccessories: [
      { id: "laptop-bag", label: "Laptop Bags" },
      { id: "flash-drive", label: "Flash Drives" },
      { id: "laptop-charger", label: "Laptop Chargers" },
      { id: "laptop-stand", label: "Laptop Stands" },
    ],
    monitorAccessories: [
      { id: "hdmi-cable", label: "HDMI Cable" },
      { id: "ports-converter", label: "Ports Converter" },
    ],
    otherAccessories: [
      { id: "external-hdd", label: "External HDD" },
      { id: "external-ssd", label: "External SSD" },
      { id: "chargers", label: "Chargers" },
      { id: "gaming-mouse", label: "Gaming Mouse" },
      { id: "gaming-laptop", label: "Gaming Laptop" },
    ],
  },
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const categorySpecificFilters = {
  "all-products": ["category", "priceRange"],
  smartphones: ["brand", "storage", "ram", "condition", "priceRange"],
  laptops: ["brand", "processor", "storage", "ram", "laptopType", "displayType", "condition", "priceRange"],
  monitors: ["brand", "screenSize", "frameStyle", "screenResolution", "ports", "condition", "priceRange"],
  accessories: ["category", "smartphoneAccessories", "laptopAccessories", "monitorAccessories", "otherAccessories", "condition", "priceRange"],
};

export const getFilterOptionsForCategory = (category) => {
  const commonOptions = {
    priceRange: filterOptions.priceRange,
    condition: filterOptions.condition,
  };

  if (category === "all-products") {
    return {
      ...commonOptions,
      category: [
        { id: "smartphones", label: "Smartphones" },
        { id: "laptops", label: "Laptops" },
        { id: "monitors", label: "Monitors" },
        { id: "accessories", label: "Accessories" },
      ],
    };
  }

  return {
    ...commonOptions,
    ...filterOptions[category],
  };
};