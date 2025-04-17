# Graphical Project Documentation

This repository is a **Turborepo** monorepo that contains three main parts:

- **App**: The main user-facing application.
- **Admin**: The admin interface for managing the application.
- **Tutor**: A tutor interface for educational purposes.

## Project Structure

The project is structured as follows:

### 1. **App**

The `app` section contains the core functionality of the application. It includes user interfaces and business logic to provide the graphical experience.

- **Features**:
  - User dashboard
  - Interactive graphical elements
  - Dynamic content rendering
  - Responsive design

### 2. **Admin**

The `admin` section provides the administrative interface for managing users, data, and settings of the application.

- **Features**:
  - User management
  - Content management
  - Analytics and reports
  - Settings and configurations

### 3. **Tutor**

The `tutor` section is designed for educational purposes, providing an interface to deliver lessons and interact with users.

- **Features**:
  - Lesson management
  - Interactive learning modules
  - Student progress tracking
  - Video tutorials and quizzes

## Setup Instructions

### Prerequisites:

- Node.js (Recommended version: `16.x` or higher)
- Yarn (Recommended for managing packages in Turborepo)
- Git

### Installation:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ezlegini-ir/igraphical.git
   ```

2. **Navigate into the project directory:**:

   ```bash
    cd igraphical
   ```

3. **Install dependencies for all packages in the monorepo:**:

   ```bash
   npm install --legacy-peer-deps
   ```

## Running the Development Environment:

To start the development servers for all parts of the project, run:

```bash
npm run dev
```

This will use Turborepo's caching and task management to run the appropriate tasks for each package.

- **Usage:**:
  - App: Visit the app interface to interact with the graphical features.
  - Interactive learning modules
  - Admin: Visit the admin interface to manage users, data, and settings.
  - Tutor: Use the tutor interface for educational modules.
