
---

## Core Modules

### 1. API Modules
- `localStorage.js`: Interface for localStorage to simulate a database

### 2. Authentication
- `auth.js`: Session management and user authentication

### 3. UI Components
- `modal.js`: Modal window system  
- `toast.js`: Floating notification system  

### 4. Page Modules
- `dashboard.js`: Main dashboard logic  
- `inventory.js`: Inventory display and management  
- `operations.js`: Logic for warehouse operations  
- `reports.js`: Reporting generation and visualization  
- `settings.js`: System settings and configuration  

### 5. Services
- `inventory-service.js`: Inventory business logic  
- `operations-service.js`: Business logic for operations  
- `reports-service.js`: Report generation logic  

### 6. Utilities
- `animations.js`: Animation effects  
- `date-formatter.js`: Date formatting and conversion  
- `form-validator.js`: Form validation  
- `i18n.js`: Internationalization and translation support  
- `permissions.js`: Permissions and access management  

---

## Usage Guide

### System Installation
1. Download or clone the project
2. Open `index.html` in a modern browser

### Login Credentials
Use one of the following accounts:

| Role             | Username | Password  |
|------------------|----------|-----------|
| College Dean     | admin    | admin123  |
| College Director | director | dir123    |
| Storekeeper      | store    | store123  |
| Warehouse Staff  | staff    | staff123  |

### System Usage
- **Dashboard**: View inventory statistics and recent operations  
- **Operations**: Perform warehouse operations (add, withdraw, etc.)  
- **Inventory**: View and edit stock across different warehouses  
- **Reports**: Generate and view inventory-related reports  
- **Settings**: Customize the system and manage accounts  

---

## Future Development

- Integrate a real database instead of using localStorage  
- Improve the permissions and role-based access system  
- Add barcode scanning functionality for items  
- Develop a mobile application  
- Implement automatic low-stock notifications  

---

## Contributing

We welcome contributions to enhance this system. Please follow these steps:

1. Fork the repository  
2. Create a new branch for your feature  
3. Submit a pull request with a detailed explanation of your changes  

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
