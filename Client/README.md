# Afkit | Quality Electronics & Gadgets Online Store

<p align="center">
  <img src="./client/public/apple-touch-icon.png" alt="Afkit Logo" width="150"/>
</p>

Afkit is your trusted online store for quality UK-used electronics & gadgets in Nigeria. We are committed to providing a seamless shopping experience with a focus on reliability, customer satisfaction, and peace of mind. Every product comes with a six-month warranty, swift nationwide delivery, secure payment options, and free online tech support.

---

## 🌟 Key Features

* **Quality UK-Used Electronics & Gadgets**: Carefully sourced and verified products.
* **6-Month Warranty**: Extended assurance on your purchases.
* **Nationwide Swift Delivery**: Get your gadgets quickly, anywhere in Nigeria.
* **Secure Online Payments**: Multiple safe and convenient payment options.
* **Free Online Tech Support**: Dedicated assistance for any post-purchase queries.
* **Intuitive User Interface**: Easy navigation and a pleasant shopping experience.
* **User Authentication**: Secure registration, login, and logout.
* **Email Verification System**: Ensures user accounts are legitimate with email verification.
* **Forgot & Reset Password**: Robust password management for forgotten credentials.
* **Product Listings**: Browse a variety of electronics and gadgets.
* **Shopping Cart**: Add and manage items before checkout.
* **Order Management**: Track past orders and view details.

---

## 🚀 Technologies Used

This project is built using a modern full-stack JavaScript approach.

### Frontend:
* **React**: A JavaScript library for building dynamic user interfaces.
* **Vite**: A next-generation frontend tooling that provides a blazing fast development experience.
* **React Router DOM**: For client-side routing within the React application.
* **Redux Toolkit**: The official, opinionated, batteries-included toolset for efficient Redux development and state management.
* **Axios**: A promise-based HTTP client for making requests to the backend.
* **Framer Motion**: A production-ready motion library for React that simplifies animations and gestures.
* **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
* **Sonner**: A beautifully designed toast notification library for displaying elegant messages.
* **Lucide React**: A lightweight and customizable icon library.

### Backend:
* **Node.js**: A JavaScript runtime environment for building scalable server-side applications.
* **Express.js**: A minimalist web framework for Node.js, used for building robust APIs.
* **MongoDB**: A popular NoSQL database for flexible and scalable data storage.
* **Mongoose**: An elegant MongoDB object modeling for Node.js, simplifying interactions with the database.
* **bcryptjs**: A library for hashing passwords, ensuring secure storage of user credentials.
* **jsonwebtoken (JWT)**: For secure authentication by creating and verifying access tokens.
* **crypto**: Node.js built-in module for cryptographic functionality, used for generating secure tokens (e.g., password reset).
* **Mailtrap / Nodemailer (or similar)**: For sending transactional emails like account verification and password resets.

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

* [**Node.js**](https://nodejs.org/en/) (LTS version recommended)
* [**npm**](https://www.npmjs.com/) (Node Package Manager, comes with Node.js) or [**Yarn**](https://yarnpkg.com/)
* [**MongoDB**](https://www.mongodb.com/docs/manual/installation/) (You can install it locally, or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation Steps

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/Thisslami/Afkit.git](https://github.com/Thisslami/Afkit.git)
    cd Afkit
    ```

2.  **Navigate to the Client (Frontend) directory and install dependencies:**

    ```bash
    cd client
    npm install
    # or if you prefer yarn:
    # yarn install
    ```

3.  **Navigate to the Server (Backend) directory and install dependencies:**

    ```bash
    cd ../server
    npm install
    # or if you prefer yarn:
    # yarn install
    ```

4.  **Set up Environment Variables:**

    * **For the Backend (`server/.env`):**
        Create a file named `.env` in the `server` directory and add the following:

        ```dotenv
        PORT=9050 # Recommended: Explicitly define the port
        NODE_ENV=development
        CLIENT_URL=[https://afkit.ng](https://afkit.ng)
        JWT_SECRET=mysecret # ✨ IMPORTANT: Use a strong, randomly generated secret in production!
        MONGODB_URL=mongodb+srv://akinyemioluwaseunjunior:Mikkyreel18@cluster0.zyejkwv.mongodb.net/afkit-gadgets?retryWrites=true&w=majority&appName=Cluster0
        COOKIE_DOMAIN=.afkit.ng
        COOKIE_SECURE=true
        COOKIE_SAMESITE=none
        MAILTRAP_ENDPOINT=[https://send.api.mailtrap.io/api/send](https://send.api.mailtrap.io/api/send)
        MAILTRAP_TOKEN=4e74396cbfa2f64b166eed87ca12a273
        ```

    * **For the Frontend (`client/.env`):**
        Create a file named `.env` in the `client` directory and add the following:

        ```dotenv
        VITE_API_BASE_URL=http://localhost:9050/api
        # For production, you would change this to: VITE_API_BASE_URL=[https://api.afkit.ng/api](https://api.afkit.ng/api)
        ```

---

### Running the Project

1.  **Start the Backend Server:**

    Open your terminal, navigate to the `server` directory, and run:
    ```bash
    cd server
    npm start # Or 'node server.js' if your package.json doesn't have a 'start' script
    ```
    The backend server should start on `http://localhost:9050` (or the port you specified in your `.env` file).

2.  **Start the Frontend Development Server:**

    Open a **new terminal window**, navigate to the `client` directory, and run:
    ```bash
    cd client
    npm run dev
    ```
    The frontend development server will usually open your application in your default web browser at `http://localhost:5173`.

Now, your Afkit application should be fully operational in your browser!

---

## 📦 Building for Production

To prepare your Afkit application for deployment to a production environment:

1.  **Build the Frontend:**

    Navigate to the `client` directory and run:
    ```bash
    cd client
    npm run build
    ```
    This command will create an optimized, minified, and production-ready build of your React application in a `dist` folder within your `client` directory.

2.  **Prepare Backend for Production:**

    * Ensure your backend `.env` variables (in the `server` directory) are configured for your production environment. This includes setting `NODE_ENV=production`, using your actual production MongoDB URI, and the correct production `CLIENT_URL`.
    * You would then typically deploy your `server` directory along with the `dist` folder generated from the frontend build to your hosting provider.

---

## 📏 Code Style and Linting

This project uses [ESLint](https://eslint.org/) to maintain code quality and consistency.

* To run lint checks:
    ```bash
    npm run lint # Run this in your client directory
    ```
* To automatically fix lint errors (where possible):
    ```bash
    npm run lint -- --fix # Run this in your client directory
    ```

---

## 🤝 Contributing

We welcome contributions to the Afkit project! If you have suggestions for improvements, new features, or want to fix a bug:

1.  Fork the repository on GitHub.
2.  Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name # e.g., feature/add-dark-mode
    ```
3.  Make your changes, ensuring they adhere to the existing code style.
4.  Commit your changes with a clear and descriptive message:
    ```bash
    git commit -m 'feat: Add new awesome feature'
    ```
5.  Push your branch to your forked repository:
    ```bash
    git push origin feature/your-feature-name
    ```
6.  Open a Pull Request from your branch to the `main` branch of the original repository. Please provide a clear description of your changes.

---

## 📄 License

This project is licensed under the MIT License. You can find the full license text in the [LICENSE.md](LICENSE.md) file (you may need to create this file in your project root if it doesn't exist).

---

## 📞 Contact

For any inquiries, support, or feedback regarding Afkit, please reach out to us:

* **Email**: afkitng@gmail.com
* **Phone**: +2348164014304

Connect with us on social media:
* [Twitter](https://twitter.com/your-afkit-page)
* [Instagram](https://www.instagram.com/afkit_official?igsh=MXZ2MGZyOGowaDlmYw==)

---

## 👨‍💻 Developed by

**Akinyemi Oluwatosin (Lamidev)** 
📞 +2347056501913  
📧 akinyemioluwaseunjunior@gmail.com  
🌐 [Portfolio](https://my-portfolio-xfch.onrender.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/akinyemi-oluwatosin-95519130b)