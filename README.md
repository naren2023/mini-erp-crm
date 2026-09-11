# Northline Mini ERP + CRM Operations Portal

A full-stack Mini ERP + CRM application designed for wholesale and distribution operations. The system provides role-based authentication, customer relationship management, product and inventory management, sales challan processing, stock tracking, and REST APIs.

## 🚀 Live Demo

👉 **[Open Northline Mini ERP + CRM](https://naren2023.github.io/mini-erp-crm/)**

### Production Services

| Component | Platform | URL |
|---|---|---|
| Frontend | GitHub Pages | [Live Application](https://naren2023.github.io/mini-erp-crm/) |
| Backend API | Render | [Backend API](https://mini-erp-crm-mwin.onrender.com) |
| Database | Render PostgreSQL | Private production database |

---

## 📌 Project Overview

Northline Mini ERP + CRM is a web-based business operations portal for wholesale/distribution workflows.

The application centralizes:

- Customer management
- Customer follow-ups
- Product management
- Inventory management
- Stock movement tracking
- Sales challan management
- Role-based access control
- Dashboard monitoring
- REST API integration

The application follows a client-server architecture where the React frontend communicates with the Express REST API, which uses Prisma ORM to interact with PostgreSQL.

---

## ✨ Key Features

### 🔐 Authentication & Role-Based Access

- JWT-based authentication
- Secure login
- Protected API routes
- Role-based authorization
- Four supported roles:
  - Admin
  - Sales
  - Warehouse
  - Accounts

### 👥 Customer CRM

- Create customers
- Update customers
- Delete customers
- Search customers
- Filter customers
- View customer details
- Customer status management
- Customer type management
- Follow-up history
- Follow-up date and notes

### 📦 Product Management

- Create products
- Edit products
- View products
- Product SKU management
- Product category management
- Product pricing
- Product stock information
- Active/inactive product status

### 📊 Inventory Management

- View current stock
- Stock IN movements
- Stock OUT movements
- Stock movement history
- Inventory audit trail
- Prevention of negative stock

### 🧾 Sales Challans

- Create sales challans
- Add multiple products to a challan
- Specify product quantities
- Automatic challan number generation
- Draft status
- Confirmed status
- Cancelled status
- Product snapshot stored with challan items
- Stock reduction after confirmation
- Insufficient-stock validation
- Transactional stock updates

### 📈 Dashboard

- Business overview
- Customer statistics
- Product statistics
- Inventory information
- Challan information
- Role-aware navigation

### 🌐 REST API

The backend exposes RESTful APIs for:

- Authentication
- Dashboard
- Customers
- Products
- Inventory
- Sales challans

Protected APIs use JWT Bearer authentication.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────────────┐
                    │       GitHub Pages          │
                    │                             │
                    │ React + TypeScript + Vite   │
                    │ Tailwind CSS                │
                    └──────────────┬──────────────┘
                                   │
                                   │ HTTPS REST API
                                   ▼
                    ┌─────────────────────────────┐
                    │          Render             │
                    │                             │
                    │ Node.js + Express + TS      │
                    │ JWT Authentication          │
                    │ REST API                    │
                    └──────────────┬──────────────┘
                                   │
                                   │ Prisma ORM
                                   ▼
                    ┌─────────────────────────────┐
                    │     Render PostgreSQL       │
                    │                             │
                    │ Users                       │
                    │ Customers                   │
                    │ Products                    │
                    │ Stock Movements             │
                    │ Challans                    │
                    │ Challan Items               │
                    └─────────────────────────────┘
