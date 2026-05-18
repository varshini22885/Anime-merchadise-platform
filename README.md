# 🎌 Anime Merchandise Platform

Welcome to the **Anime Merchandise Platform**! This is a modern, visually stunning web application designed for anime fans to explore and purchase premium merchandise. The platform provides a seamless shopping experience with dedicated sections for various anime-related products.

## 🌟 Features

- **Dynamic Product Catalog**: Browse through different categories including:
  - 👕 **Clothing** (T-shirts, Hoodies, Cosplay)
  - 🖼️ **Posters** (High-quality prints, Wall scrolls)
  - ⚔️ **Figures** (Action figures, Nendoroids, Scale models)
  - 🎒 **Accessories** (Keychains, Jewelry, Bags)
- **Interactive Shopping Cart**: A fully functional cart system built with JavaScript to add, remove, and manage your items.
- **Responsive Design**: A sleek, modern user interface that looks great on both desktop and mobile devices.
- **Dockerized Deployment**: Ready to be containerized and deployed using Docker and Nginx.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Web Server**: Nginx (configured via `default.conf.template`)
- **Containerization**: Docker (`Dockerfile` included)

## 📁 Project Structure

```text
├── assets/
│   ├── css/       # Stylesheets (styles.css)
│   ├── js/        # JavaScript logic (main.js, cart.js, products.js)
│   └── images/    # Product and UI imagery
├── index.html     # Main landing page
├── clothing.html  # Clothing category page
├── figures.html   # Figures category page
├── posters.html   # Posters category page
├── accessories.html # Accessories category page
├── all-products.html # Full product catalog
├── cart.html      # Shopping cart page
├── Dockerfile     # Docker configuration for deployment
└── default.conf.template # Nginx configuration
```

## 🚀 How to Run Locally

### Using a Local Web Server (Recommended for Development)
1. Clone this repository.
2. Open the project folder.
3. Serve the directory using any local web server. For example, using Python:
   ```bash
   python -m http.server 8000
   ```
4. Open `http://localhost:8000` in your web browser.

### Using Docker (For Production / Staging)
If you have Docker installed, you can build and run the application container:

1. Build the Docker image:
   ```bash
   docker build -t anime-merch-platform .
   ```
2. Run the container:
   ```bash
   docker run -p 8080:80 anime-merch-platform
   ```
3. Open `http://localhost:8080` in your web browser.

## 👤 Author

**Varshini** 
- GitHub: [@varshini22885](https://github.com/varshini22885)

---
*Built with ❤️ for Anime fans everywhere.*