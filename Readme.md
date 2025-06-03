# MERN Stack Authentication & Authorization

A MERN (MongoDB, Express.js, React, Node.js) application implementing user authentication and authorization with dynamic subdomain support. Features include signup, signin, a dashboard with a profile modal, and shop-specific dashboards, with secure JWT-based session handling across subdomains.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Live Demo](#live-demo)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Notes](#notes)
- [Submission](#submission)
- [Troubleshooting](#troubleshooting)

## Features

### Signup Page
- **Fields**:
  - Username (required)
  - Password (required, 8+ characters, 1 number, 1 special character)
  - 3–4 Shop Names (required, globally unique)
- **Functionality**:
  - Real-time field-specific error messages (e.g., "Username already exists") that clear on input change.
  - Ensures shop name uniqueness in MongoDB.
  - Stores hashed passwords and user data.
  - Redirects to signin page on success.
  - Uses Tailwind CSS and react-hot-toast for UI and notifications.

### Signin Page
- **Fields**:
  - Username (required)
  - Password (required)
  - "Remember Me" checkbox
- **Functionality**:
  - Validates credentials with specific errors (e.g., "User not found", "Incorrect password").
  - Session duration: 7 days with "Remember Me", else 30 minutes.
  - Stores JWT token in `localStorage` for cross-subdomain access.
  - Redirects to dashboard on success.

### Dashboard
- **Features**:
  - Displays username and a "Profile" button.
  - Profile modal pops up in top-right corner with 300ms slide-in animation.
  - Modal shows clickable shop names and a logout button with react-hot-toast confirmation.
  - Closes on outside click or re-clicking "Profile".
- **Session**: JWT token ensures persistent authentication.

### Shop-Specific Dashboard
- **Functionality**:
  - Redirects to `http://<shopname>.localhost:5173` (e.g., `http://beautyhub.localhost:5173`).
  - Displays "This is <shopname> shop".
  - Shows loading spinner during JWT verification.
  - Supports direct subdomain access with preserved authentication.
- **Session**: JWT token in `localStorage` ensures cross-subdomain auth.

## Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Vite (React frontend)
- Browser with subdomain support (e.g., Chrome)

## Installation

### Clone Repository
```bash
git clone https://github.com/your-username/mern-auth-app.git
cd mern-auth-app