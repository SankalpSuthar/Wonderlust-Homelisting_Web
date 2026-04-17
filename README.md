# 🏠 Airbnb Home Listing Site Clone

<div align="center">
  
  ### Full-Stack Accommodation Booking Platform
  
  Built with **MERN Stack** as part of **Delta Batch @ Apna College**
  
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
  

</div>

---
## 📸 Demo

<div align="center">
  
  ### 🏡 Browse Listings
  <img src="gallery/img1.png" alt="Browse all property listings" width="750"/>
  
  ### 🔍 Listing Details & Reviews
  <img src="gallery/img2.png" alt="Listing details with reviews" width="750"/>
  
  ### 🔐 User Authentication
  <img src="gallery/img3.png" alt="Secure signup and login system" width="750"/>

</div>


---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🏠 Property Management
- ✅ Full CRUD operations
- ✅ Responsive card layout
- ✅ Image handling
- ✅ Property descriptions

</td>
<td width="50%">

### 🔐 Authentication
- ✅ Secure signup/login
- ✅ Session management
- ✅ Password encryption
- ✅ User authorization

</td>
</tr>
<tr>
<td width="50%">

### ⭐ Reviews & Ratings
- ✅ Add/delete reviews
- ✅ Star rating system
- ✅ User-based authorization
- ✅ Review aggregation

</td>
<td width="50%">

### 🛡️ Security
- ✅ Joi validation
- ✅ Custom middleware
- ✅ Error handling
- ✅ XSS protection

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

```
Backend
├── Node.js          → Runtime environment
├── Express.js       → Web framework
├── MongoDB          → Database
├── Mongoose         → ODM
└── Passport.js      → Authentication

Frontend
├── EJS              → Templating engine
├── Bootstrap 5      → UI framework
└── JavaScript       → Client-side logic

Security
├── Joi              → Schema validation
├── bcrypt           → Password hashing
├── express-session  → Session management
└── connect-flash    → Flash messages
```

---

## 🚀 Quick Start

### Prerequisites
```bash
node --version  # v18+ required
mongod --version  # MongoDB installed
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. Install dependencies
npm install

# 3. Set up environment variables
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/airbnb-clone
SESSION_SECRET=your-super-secret-key-here
PORT=3000
EOF

# 4. Seed database (optional)
node init/index.js

# 5. Start the server
npm start
```

**🌐 Visit:** `http://localhost:3000`

---

## 📁 Project Structure

```
airbnb-homeListing-site-clone/
│
├── models/              # Database schemas
│   ├── listing.js      # Property listings
│   ├── review.js       # Reviews & ratings
│   └── user.js         # User authentication
│
├── routes/              # API endpoints
│   ├── listing.js      # Listing CRUD
│   ├── review.js       # Review management
│   └── user.js         # Auth routes
│
├── views/               # EJS templates
│   ├── listings/       # Listing pages
│   ├── users/          # Auth pages
│   └── layouts/        # Reusable layouts
│
├── public/              # Static assets
│   ├── css/            # Stylesheets
│   └── js/             # Client scripts
│
├── utils/               # Helper functions
├── middleware.js        # Custom middleware
├── schema.js           # Joi validation
└── app.js              # Main application
```

---

## 🎯 Development Phases

### ✅ Phase 1: Foundation (Completed)
- Database modeling & CRUD operations
- EJS templating & responsive design
- Express routing & middleware setup

### ✅ Phase 2: Authentication & Security (Completed)
- User registration & login system
- Review & rating functionality
- Server-side validation with Joi
- Authorization middleware

### 🔄 Phase 3: Advanced Features (In Progress)
- [ ] Image upload with Cloudinary
- [ ] Advanced search & filters
- [ ] Interactive maps integration
- [ ] Booking calendar system
- [ ] Payment gateway
- [ ] Email notifications
- [ ] User dashboard

---

## 🎓 Key Learnings

<table>
<tr>
<td align="center" width="33%">
<img src="https://img.icons8.com/color/96/000000/database.png" width="48"/>
<br><strong>Database Design</strong>
<br>Schema modeling, relationships
</td>
<td align="center" width="33%">
<img src="https://img.icons8.com/color/96/000000/lock.png" width="48"/>
<br><strong>Security</strong>
<br>Authentication, validation
</td>
<td align="center" width="33%">
<img src="https://img.icons8.com/color/96/000000/api.png" width="48"/>
<br><strong>RESTful APIs</strong>
<br>CRUD, middleware, error handling
</td>
</tr>
</table>

---

## 📝 API Endpoints

<details>
<summary><b>View All Endpoints</b></summary>

### Listings
```http
GET    /listings          # Get all listings
GET    /listings/:id      # Get single listing
POST   /listings          # Create listing (Auth required)
PUT    /listings/:id      # Update listing (Owner only)
DELETE /listings/:id      # Delete listing (Owner only)
```

### Reviews
```http
POST   /listings/:id/reviews        # Add review (Auth required)
DELETE /listings/:id/reviews/:rid   # Delete review (Author only)
```

### Authentication
```http
GET    /signup          # Signup page
POST   /signup          # Register user
GET    /login           # Login page
POST   /login           # Authenticate user
GET    /logout          # Logout user
```

</details>

---

## 🤝 Connect With Me

<div align="center">

**Sankalp Suthar**  
🎓 Full-Stack Developer in Training | 📚 Delta Batch @ Apna College

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sankalpsuthar)

</div>

---


