# Gemini AI Prompts — Generate Professional Documents for Mazzady Project

Use these prompts with Google Gemini (gemini.google.com) to generate professional PDF and PowerPoint files.

---

## 📊 PROMPT 1: Use Case Diagram (Professional PDF)

Copy and paste this entire prompt to Gemini:

```
I need you to create a professional Use Case Diagram for my graduation project "Mazzady - Online Auction Platform". Please generate a clean, professional UML Use Case Diagram image.

The system has 5 actors: Guest, Buyer, Seller, Authenticated User, and Admin.

GUEST use cases:
- View Homepage
- Browse Auctions (Category Filter)
- View Auction Details
- Register Account (Email + National ID)
- Login (Email/Password)
- OAuth Sign-In (Google/Facebook)
- View Privacy Policy
- Request Data Deletion
- Submit Job Application
- View Featured Auctions

BUYER use cases:
- Place Bid
- Set Up Auto-Bid
- Manage Shopping Cart
- Purchase Items (Wallet Deduction)
- View Invoice
- Track Shipping
- Manage Watchlist
- Compare Auctions/Products
- Rate Seller (1-5 Stars)
- Follow/Like Seller
- Create Reverse Auction
- Join Group Auction
- Request Wallet Deposit
- View Wallet Balance
- Manage Loyalty Points

SELLER use cases:
- Submit Product for Auction
- Create Auction
- Create Flash Auction
- Create Private Auction (Invite Code)
- Promote Auction
- Bid on Reverse Auctions

AUTHENTICATED USER (common) use cases:
- Manage Profile
- Verify Email
- Identity Verification (KYC)
- Send/Receive Chat Messages
- View Notifications
- Report Auction/User
- Submit Support Ticket
- AI Chatbot Interaction
- Logout

ADMIN use cases:
- Admin Login
- View Dashboard Statistics
- Manage Users
- Approve/Reject Products
- Manage All Auctions
- Approve/Reject Deposits
- Respond to Support Tickets
- Review Reports
- Verify User Identity (KYC)
- Send Broadcast Messages
- Manage Homepage Content
- Manage Job Applications
- Update Shipping Status

Include relationships:
- Purchase Items <<include>> View Invoice
- Purchase Items <<include>> Track Shipping
- Place Bid <<include>> View Notifications
- Register <<include>> Verify Email
- OAuth Sign-In <<extend>> Manage Profile
- Create Auction <<include>> Approve/Reject Products

Make it visually professional with:
- Color-coded actor groups
- Clean layout (left-to-right direction)
- System boundary labeled "Mazzady Online Auction Platform"
- UML 2.0 standard notation
- Professional color scheme (blues and grays)

Generate this as a high-resolution image suitable for PDF printing.
```

---

## 📝 PROMPT 2: Abstract (Professional PDF - 1 Page)

```
Create a professional one-page PDF document for my graduation project abstract with the following specifications:

Title: "Mazzady — Online Auction Platform"
Subtitle: "Project Abstract"

Abstract text (use this exact text):
"Mazzady is a comprehensive full-stack online auction platform designed to provide a secure, real-time bidding experience for buyers and sellers in the Egyptian market. Built with Angular 21 for the frontend and NestJS with MongoDB for the backend, the platform supports multiple auction types including standard, flash, group, private (invite-only), and reverse auctions. Users can register via email or OAuth providers (Google and Facebook), complete identity verification through national ID uploads, and manage a digital wallet for seamless transactions. The system features an intelligent auto-bidding mechanism, real-time notifications, a loyalty points program, and an AI-powered chatbot for user assistance. Sellers can submit products for auction with image compression and MongoDB-backed persistent storage, while administrators manage the entire platform through a dedicated dashboard — overseeing user verification, product approvals, deposit requests, support tickets, and broadcast communications. The platform is deployed on Heroku (backend) and Vercel (frontend) with the custom domain mazzady.works, ensuring high availability, optimized performance through Lighthouse best practices, and a responsive bilingual (Arabic/English) user interface. Mazzady bridges the gap between traditional auction houses and modern e-commerce, delivering a trustworthy and feature-rich marketplace for the Egyptian community."

Keywords: Online Auction, E-Commerce, Real-Time Bidding, Angular, NestJS, MongoDB, OAuth, Digital Wallet, Image Compression, Full-Stack Web Application

Design specifications:
- University/academic style formatting
- Professional header with project name
- Clean serif font (Times New Roman or similar)
- 1-inch margins
- Keywords section at the bottom
- Subtle blue accent color for headings
- Generate as PDF-ready format
```

---

## 📋 PROMPT 3: Team Members (Professional PDF)

```
Create a professional team members page for a graduation project with the following details:

Project Name: Mazzady — Online Auction Platform
Technology Stack: Angular 21 · NestJS · MongoDB · TypeScript
Live URL: mazzady.works

Team Members (8 members):
1. Mohamed Yasser Farouk (محمد ياسر فاروق)
2. Mohamed Adel Abdullah Atiya (محمد عادل عبدالله عطيه)
3. Nour Waleed Abu Al-Wafa (نور وليد أبو الوفا)
4. Ahmed Medhat Ahmed (احمد مدحت احمد)
5. Mahmoud Abdel-Gawad Ahmed (محمود عبّد الجواد احمد)
6. Ahmed Menwaty Abdel-Maboud (احمد منواتي عبد المعبود)
7. Yahia Ashraf Hefny (يحي اشرف حفني)
8. Abdulrahman El-Sayed (عبدالرحمن السيد)

Design specifications:
- Professional layout with project logo area at top
- Each member in a card-style or table layout
- Show both Arabic and English names
- Include project info section at bottom
- Blue and white professional color scheme
- Academic/university style
- Generate as PDF-ready format
```

---

## 🎯 PROMPT 4: Full Project Presentation (PowerPoint)

```
Create a professional PowerPoint presentation for my graduation project "Mazzady — Online Auction Platform" with the following slides:

SLIDE 1 - Title Slide:
- Project Name: "Mazzady — Online Auction Platform"
- Tagline: "A Secure Real-Time Bidding Marketplace for Egypt"
- Team: 8 Members (list names below)
- URL: mazzady.works

SLIDE 2 - Team Members:
1. Mohamed Yasser Farouk
2. Mohamed Adel Abdullah Atiya
3. Nour Waleed Abu Al-Wafa
4. Ahmed Medhat Ahmed
5. Mahmoud Abdel-Gawad Ahmed
6. Ahmed Menwaty Abdel-Maboud
7. Yahia Ashraf Hefny
8. Abdulrahman El-Sayed

SLIDE 3 - Problem Statement:
- Traditional auction methods are inefficient and limited by geography
- Lack of trusted online platforms for Egyptian market
- No secure real-time bidding with wallet-based payments
- Need for identity verification and fraud prevention

SLIDE 4 - Solution Overview:
- Mazzady: Full-stack web platform for online auctions
- Multiple auction types: Standard, Flash, Group, Private, Reverse
- Digital wallet system with deposit verification
- National ID verification for trust & security
- Bilingual support (Arabic/English)

SLIDE 5 - Technology Stack:
- Frontend: Angular 21, TypeScript, SASS, Chart.js
- Backend: NestJS 11, MongoDB Atlas, Mongoose 9
- Authentication: JWT, Google OAuth, Facebook OAuth
- Image Processing: Sharp (compression + MongoDB storage)
- Deployment: Heroku (Backend), Vercel (Frontend)
- Domain: mazzady.works

SLIDE 6 - System Architecture:
- 3-tier architecture: Presentation → Business Logic → Data
- Frontend: Angular SPA with lazy loading & SSR-ready
- Backend: RESTful API with 30+ modules
- Database: MongoDB Atlas with 31 schemas
- Image Storage: MongoDB Binary (persistent across deployments)

SLIDE 7 - Key Features (Part 1):
- User Registration with Email Verification & KYC
- OAuth Integration (Google + Facebook Sign-In)
- 5 Auction Types (Standard, Flash, Group, Private, Reverse)
- Auto-Bidding System (set max bid, auto-increment)
- Real-Time Notifications
- Shopping Cart & Invoice Generation
- Shipping Tracking (8 statuses)

SLIDE 8 - Key Features (Part 2):
- Digital Wallet (deposit with proof, admin approval)
- Loyalty Points Program (earn, redeem, bonus)
- AI-Powered Chatbot
- Seller Ratings & Reviews
- Product Comparisons
- Watchlist Management
- Chat Messaging (user-to-user)
- Admin Dashboard with full control

SLIDE 9 - Use Case Diagram:
- Show the UML Use Case Diagram
- 5 Actors: Guest, Buyer, Seller, Authenticated User, Admin
- Major use case groups highlighted

SLIDE 10 - Admin Panel Features:
- Dashboard with user statistics & charts
- User management (view, delete, verify KYC)
- Auction product approval workflow
- Money deposit approval/rejection
- Customer support ticket management
- Broadcast messaging to all users
- Homepage content management
- Job application management

SLIDE 11 - Security Features:
- JWT Token Authentication (access + refresh tokens)
- National ID Verification (front/back upload)
- OAuth 2.0 (Google, Facebook)
- Helmet.js security headers
- CORS protection with allowed origins
- Input validation (DTOs + ValidationPipe)
- Admin Guard for protected routes
- Image compression to prevent abuse

SLIDE 12 - Performance Optimization:
- Lighthouse score optimization
- Gzip compression (70% size reduction)
- Image compression with Sharp
- Lazy loading for Angular modules
- Database indexing (compound indexes)
- Static asset caching (7-30 days)
- Skeleton loading states

SLIDE 13 - Deployment Architecture:
- Backend: Heroku (Node.js, auto-scaling)
- Frontend: Vercel (CDN, edge network)
- Database: MongoDB Atlas (cloud)
- Domain: mazzady.works (Vercel DNS)
- CI/CD: Git-based deployment pipeline

SLIDE 14 - Live Demo:
- URL: https://mazzady.works
- Show screenshots of:
  - Homepage
  - Auction listing with categories
  - Auction details & bidding
  - Admin dashboard
  - User profile
  - Wallet & deposit system

SLIDE 15 - Future Enhancements:
- Real-time bidding with WebSocket
- Mobile app (React Native / Flutter)
- Payment gateway integration (Fawry, PayMob)
- Advanced search with Elasticsearch
- Machine learning for price prediction
- Video auction support

SLIDE 16 - Thank You:
- "Thank You"
- Project URL: mazzady.works
- Team names
- "Questions?"

Design specifications:
- Modern, professional template
- Blue (#2196F3) and dark gray (#333) color scheme
- Clean sans-serif fonts
- Consistent header/footer on each slide
- Use icons where appropriate
- 16:9 widescreen format
- Include placeholder areas for screenshots
```

---

## 🎨 PROMPT 5: Project Poster (PDF - A3/A2 Size)

```
Create a professional A3 academic project poster for "Mazzady — Online Auction Platform" with these sections:

1. TITLE & TEAM: "Mazzady — Online Auction Platform" with 8 team member names
2. ABSTRACT: (148 words - provided above)
3. TECHNOLOGY STACK: Angular 21, NestJS, MongoDB, TypeScript, Sharp, JWT, OAuth
4. SYSTEM ARCHITECTURE: 3-tier diagram
5. KEY FEATURES: 5 auction types, wallet, KYC, auto-bid, chat, loyalty points, AI chatbot
6. USE CASE DIAGRAM: Simplified version with 5 actors
7. RESULTS: Live at mazzady.works, 30+ API modules, 31 database schemas
8. FUTURE WORK: WebSocket, mobile app, payment gateway, ML price prediction

Color scheme: Professional blue (#2196F3) with white and gray
Style: Academic conference poster format
```

---

## Instructions

1. Open [gemini.google.com](https://gemini.google.com)
2. Copy the desired prompt above
3. Paste it and press Enter
4. Gemini will generate the file/image
5. Download and save to the `vip-files` folder
6. For PowerPoint: Ask Gemini "Can you generate this as a downloadable PPTX file?"
7. For PDF: Ask Gemini "Can you generate this as a downloadable PDF?"

> **Tip:** If Gemini can't generate files directly, use the content it provides in Google Slides (for PPT) or Google Docs (for PDF) and export from there.
