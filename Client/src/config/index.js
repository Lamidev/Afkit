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
    visibleIf: {
      field: "category",
      value: ["smartphones", "laptops", "monitors"],
    }, // Brand applies to these
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
    label: "Extra Features", // Changed from Display Type
    name: "extraFeatures", // Changed from displayType
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
    label: "Monitor Type", // New field for monitor sub-category
    name: "monitorType",
    componentType: "select",
    options: [
      { id: "office-monitors", label: "Office Monitors" },
      { id: "gaming-monitors", label: "Gaming Monitors" },
      { id: "curved-monitors", label: "Curved Monitors" },
    ],
    visibleIf: { field: "category", value: "monitors" },
  },

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
    visibleIf: {
      field: "accessoryCategory",
      value: [
        "smartphone-accessories",
        "laptop-accessories",
        "monitor-accessories",
        "other-accessories",
      ],
    },
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
  // Added these to map the accessory subcategories for display if needed
  "smartphone-accessories": "Smartphone Accessories",
  "laptop-accessories": "Laptop Accessories",
  "monitor-accessories": "Monitor Accessories",
  "other-accessories": "Other Accessories",
};

export const brandOptionsMap = {
  apple: "Apple",
  samsung: "Samsung",
  dell: "Dell",
  hp: "HP",
  lenovo: "Lenovo",
  "google-pixel": "Google Pixel",
  asus: "Asus",
  lg: "Lg",
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
      { id: "google-pixel", label: "Google Pixel" },
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
    laptopType: [
      { id: "basic", label: "Basic Laptop" },
      { id: "business", label: "Business Laptop" },
      { id: "gaming", label: "Gaming Laptop" },
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

    extraFeatures: [
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
    monitorType: [
      { id: "office-monitors", label: "Office Monitors" },
      { id: "gaming-monitors", label: "Gaming Monitors" },
      { id: "curved-monitors", label: "Curved Monitors" },
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
    accessoryCategory: [
      // Renamed from 'category' to 'accessoryCategory' here
      { id: "smartphone-accessories", label: "Smartphone Accessories" },
      { id: "laptop-accessories", label: "Laptop Accessories" },
      { id: "monitor-accessories", label: "Monitor Accessories" },
      { id: "other-accessories", label: "Other Accessories" },
    ],
    // These will be dynamically picked based on the selected accessoryCategory
    "smartphone-accessories": [
      { id: "charger", label: "Charger" },
      { id: "screen-protector", label: "Screen Protectors" },
      { id: "pouch", label: "Pouch" },
    ],
    "laptop-accessories": [
      { id: "laptop-bag", label: "Laptop Bags" },
      { id: "flash-drive", label: "Flash Drives" },
      { id: "laptop-charger", label: "Laptop Chargers" },
      { id: "laptop-stand", label: "Laptop Stands" },
    ],
    "monitor-accessories": [
      { id: "hdmi-cable", label: "HDMI Cable" },
      { id: "ports-converter", label: "Ports Converter" },
    ],
    "other-accessories": [
      { id: "external-hdd", label: "External HDD" },
      { id: "external-ssd", label: "External SSD" },
      { id: "chargers", label: "Chargers" },
      { id: "gaming-mouse", label: "Gaming Mouse" },
      { id: "gaming-keyboard", label: "Gaming Keyboard" }, // Example: Corrected typo/example
    ],
  },
};

export const sortOptions = [
  { id: "latest-arrival", label: "Latest Arrival" },
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
];

export const categorySpecificFilters = {
  "all-products": ["category", "condition", "priceRange"], // Added condition
  smartphones: ["brand", "storage", "ram", "condition", "priceRange"],
  laptops: [
    "brand",
    "processor",
    "storage",
    "ram",
    "laptopType",
    "extraFeatures",
    "condition",
    "priceRange",
  ],
  monitors: [
    "brand",
    "screenSize",
    "frameStyle",
    "screenResolution",
    "ports",
    "monitorType",
    "condition",
    "priceRange",
  ],
  accessories: [
    "accessoryCategory",
    "specificAccessory",
    "condition",
    "priceRange",
  ], // Updated
};

// This function determines which filter options are relevant for the given category.
export const getFilterOptionsForCategory = (category) => {
  const commonOptions = {
    priceRange: filterOptions.priceRange,
    condition: filterOptions.condition,
  };

  const relevantFilterKeys =
    categorySpecificFilters[category] ||
    categorySpecificFilters["all-products"];
  const categorySpecificOptions = {};

  // Build the category-specific options based on the relevantFilterKeys
  relevantFilterKeys.forEach((key) => {
    // For 'category' filter in 'all-products' view
    if (key === "category" && category === "all-products") {
      categorySpecificOptions.category = [
        { id: "smartphones", label: "Smartphones" },
        { id: "laptops", label: "Laptops" },
        { id: "monitors", label: "Monitors" },
        { id: "accessories", label: "Accessories" },
      ];
    } else if (key === "accessoryCategory" && category === "accessories") {
      categorySpecificOptions.accessoryCategory =
        filterOptions.accessories.accessoryCategory;
    } else if (key === "specificAccessory" && category === "accessories") {
      categorySpecificOptions.specificAccessory = [];
    }
    // For other category-specific filters (brand, storage, ram, etc.)
    else if (filterOptions[category] && filterOptions[category][key]) {
      categorySpecificOptions[key] = filterOptions[category][key];
    }
  });

  return {
    ...commonOptions,
    ...categorySpecificOptions,
  };
};
