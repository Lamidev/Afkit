

export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
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
    options: [
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "dell", label: "Dell" },
      { id: "hp", label: "HP" },
      { id: "lenovo", label: "Lenovo" },
      { id: "google", label: "Google" },
    ],
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
    options: [
      { id: "64GB", label: "64GB" },
      { id: "128GB", label: "128GB" },
      { id: "256GB", label: "256GB" },
      { id: "512GB", label: "512GB" },
      { id: "1TB", label: "1TB" },
      { id: "256GB-SSD", label: "256GB SSD" },
      { id: "512GB-SSD", label: "512GB SSD" },
      { id: "1TB-SSD", label: "1TB SSD" },
      { id: "500GB-HDD", label: "500GB HDD" },
      { id: "1TB-HDD", label: "1TB HDD" },
      { id: "2TB-HDD", label: "2TB HDD" },
    ],
  },
  {
    label: "RAM",
    name: "ram",
    componentType: "select",
    options: [
      { id: "4GB", label: "4GB" },
      { id: "6GB", label: "6GB" },
      { id: "8GB", label: "8GB" },
      { id: "12GB", label: "12GB" },
      { id: "16GB", label: "16GB" },
      { id: "32GB", label: "32GB" },
    ],
    visibleIf: { field: "category", value: ["smartphones", "laptops"] },
  },
  {
    label: "Processor",
    name: "processor",
    componentType: "select",
    options: [
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
    visibleIf: { field: "category", value: "laptops" },
  },
  {
    label: "Display Type",
    name: "displayType",
    componentType: "select",
    options: [
      { id: "non-touchscreen", label: "Non-Touchscreen" },
      { id: "touchscreen", label: "Touchscreen" },
      { id: "x360-convertible", label: "x360 Convertible" },
    ],
    visibleIf: { field: "category", value: "laptops" },
  },
  {
    label: "Laptop Type",
    name: "laptopType",
    componentType: "select",
    options: [
      { id: "basic", label: "Basic Laptop" },
      { id: "business", label: "Business Laptop" },
      { id: "gaming", label: "Gaming Laptop" },
    ],
    visibleIf: { field: "category", value: "laptops" },
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
    path: "/shop/listing",
  },
  {
    id: "smartphones",
    label: "Smartphones",
    path: "/shop/listing",
  },
  {
    id: "monitors",
    label: "Monitors",
    path: "/shop/listing",
  },
  {
    id: "laptops",
    label: "Laptops",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
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
};

export const filterOptions = {
  category: [
    { id: "smartphones", label: "Smartphones" },
    { id: "laptops", label: "Laptops" },
    { id: "monitors", label: "Monitors" },
    { id: "accessories", label: "Accessories" },
  ],
  brand: [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "dell", label: "Dell" },
    { id: "hp", label: "HP" },
    { id: "lenovo", label: "Lenovo" },
    { id: "google", label: "Google" },
  ],

  laptopType: [
    { id: "basic", label: "Basic Laptop" },
    { id: "business", label: "Business Laptop" },
    { id: "gaming", label: "Gaming Laptop" },
  ],

  storage: [
    { id: "64GB", label: "64GB" },
    { id: "128GB", label: "128GB" },
    { id: "256GB", label: "256GB" },
    { id: "512GB", label: "512GB" },
    { id: "1TB", label: "1TB" },
    { id: "2TB", label: "2TB" },
    // Added HDD/SSD options for laptops in filters
    { id: "128GB-SSD", label: "128GB SSD" },
    { id: "256GB-SSD", label: "256GB SSD" },
    { id: "512GB-SSD", label: "512GB SSD" },
    { id: "1TB-SSD", label: "1TB SSD" },
    { id: "500GB-HDD", label: "500GB HDD" },
    { id: "1TB-HDD", label: "1TB HDD" },
    { id: "2TB-HDD", label: "2TB HDD" },
  ],
  ram: [
    { id: "4GB", label: "4GB" },
    { id: "6GB", label: "6GB" },
    { id: "8GB", label: "8GB" },
    { id: "12GB", label: "12GB" },
    { id: "16GB", label: "16GB" },
    { id: "32GB", label: "32GB" },
    { id: "64GB", label: "64GB" },
  ],
  processor: [
    { id: "intel-i3", label: "Intel Core i3" },
    { id: "intel-i5", label: "Intel Core i5" },
    { id: "intel-i7", label: "Intel Core i7" },
    { id: "intel-i9", label: "Intel Core i9" },
    { id: "intel-celeron", label: "Intel Celeron" }, // Added Celeron
    { id: "intel-pentium", label: "Intel Pentium" }, // Added Pentium
    { id: "amd-ryzen5", label: "AMD Ryzen 5" },
    { id: "amd-ryzen7", label: "AMD Ryzen 7" },
    { id: "apple-m1", label: "Apple M1" },
    { id: "apple-m2", label: "Apple M2" },
  ],
  displayType: [
    { id: "non-touchscreen", label: "Non-Touchscreen" },
    { id: "touchscreen", label: "Touchscreen" },
    { id: "x360-convertible", label: "x360 Convertible" },
  ],
  priceRange: {
    min: 0,
    max: 5000000,
  },
  condition: [
    { id: "Brand New", label: "Brand New" },
    { id: "UK Used", label: "UK Used" }, // Changed from Premium Used
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

// New: Define category-specific filters
export const categorySpecificFilters = {
  smartphones: ["brand", "storage", "ram", "condition", "priceRange"],
  laptops: ["brand", "storage", "ram", "processor", "displayType", "laptopType", "condition", "priceRange"],
  monitors: ["brand", "condition", "priceRange"],
  accessories: ["brand", "condition", "priceRange"],
  "all-products": Object.keys(filterOptions).filter(key => key !== 'priceRange'),
};