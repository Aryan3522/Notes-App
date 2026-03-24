# 📝 Notes App (Next.js + Node.js)

A full-stack **Notes Application** built with **Next.js (frontend)** and **Node.js (backend)** that allows users to create, manage, and organize notes efficiently.

This project is designed with a **clean full-stack architecture** and is **open for open-source contributions**, making it a great project for both beginners and experienced developers who want to contribute to a real-world application.

---

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Open Source](https://img.shields.io/badge/Open%20Source-Welcome-orange)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blue)

---

# 🚀 Project Overview

The Notes App allows users to:

* Create notes
* View saved notes
* Update notes
* Delete notes
* Manage notes efficiently through a clean UI

The repository is structured into **two main parts**:

| Directory | Description                  |
| --------- | ---------------------------- |
| `client`  | Next.js frontend application |
| `server`  | Node.js backend API          |

This separation helps maintain a scalable **frontend-backend architecture** similar to production-grade applications.

---

# 🧰 Tech Stack

### Frontend

* Next.js
* React
* CSS / Tailwind (if used)

### Backend

* Node.js
* Express.js

### Database

* MongoDB (or whichever database you use)

### Other Tools

* REST API
* JSON Web Tokens

---

# 📂 Project Structure

```id="m0y3kg"
notes-app
│
├── client          # Next.js Frontend
│   ├── components
│   ├── pages / app
│   ├── styles
│   └── package.json
│
├── server          # Node.js Backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── config
│   └── server.js
│
├── README.md
```

## .env Example
```text
MONGODB_URI=your_mongodb_connection_string_here
PORT=8086
SECRET=your_secret_key
```

---

# ⚙️ Running the Project Locally

Follow these steps to run the project on your local machine.

---

# 1️⃣ Clone the Repository

```bash id="ln1hgo"
git clone https://github.com/Aryan3522/Notes-App.git
cd Notes-App
```

---

# 2️⃣ Setup Backend

Navigate to the server folder:

```bash id="c6t4y0"
cd server
```

Install dependencies:

```bash id="y8af22"
npm install
```

Run the backend server:

```bash id="vyivcd"
npm run dev
```

or

```bash id="yngmnl"
npm start
```

Backend will run on:

```
http://localhost:5000
```

---

# 3️⃣ Setup Frontend

Open a new terminal and navigate to the client folder:

```bash id="pcsvmi"
cd client
```

Install dependencies:

```bash id="5bo4v5"
npm install
```

Start the Next.js development server:

```bash id="vlj4ja"
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```

---

# ✨ Features

Current functionality includes:

* Create notes
* Display all notes
* Update existing notes
* Delete notes
* Clean user interface
* Full-stack architecture

---

# 📌 Future Improvements

Some improvements contributors can work on:

* Authentication system
* Search notes
* Note categories or tags
* Rich text editor
* Markdown support
* Pin important notes
* Dark mode
* Note sharing
* Performance improvements

Issues related to these improvements will be labeled **`good first issue`** for new contributors.

---

# 🤝 Contributing

We welcome **open-source contributions** from developers of all levels.

Whether you are fixing a bug, improving the UI, or adding a new feature — your contributions are appreciated.

---

## Contribution Workflow

1. Fork this repository

2. Clone your fork

```bash id="pc82rc"
git clone https://github.com/<your-username>/<repository-name>.git
```

3. Create a new branch

```bash id="jv6a8h"
git checkout -b feature/your-feature-name
```

4. Make your changes

5. Commit your changes

```bash id="xib95a"
git commit -m "Add: description of changes"
```

6. Push your branch

```bash id="zdzzg1"
git push origin feature/your-feature-name
```

7. Open a **Pull Request**

---

# 📜 Contribution Guidelines

To maintain code quality, please follow these guidelines:

* Write clean and readable code
* Use meaningful commit messages
* Test your changes before submitting
* Follow the existing project structure
* Avoid breaking existing functionality

---

# 🐛 Reporting Issues

If you find a bug or want to request a feature:

1. Open an **Issue**
2. Provide a clear description
3. Include steps to reproduce (if applicable)

---

# ⭐ Support the Project

If you find this project helpful, please consider **starring the repository**.

It helps the project gain visibility and encourages further development.

---

# 📜 License

This project is licensed under the **MIT License**.
