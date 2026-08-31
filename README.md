<div align="center">
  <img src="https://img.icons8.com/fluency/96/000000/sparkling.png" alt="LearnSync Logo" width="80" />
  <h1>🚀 LearnSync AI</h1>
  <p><strong>Your Ultra-Personalized, AI-Powered Learning Companion</strong></p>
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://learnsync-56nlakpb4-krishnaadubey2005-8466s-projects.vercel.app)
  [![GitHub](https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/krrish-cypto/learnsync-ai)
  
  <div>
    <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Gemini_3.6_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=auth0&logoColor=white" alt="NextAuth" />
    <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </div>
</div>

---

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h2>🏆 Official Submission for HCLTech AMPlified</h2>
        <p><strong>Season 1 • 2026 | The AI Challenge</strong></p>
        <p><i>"Build. Compete. Learn. Rise."</i></p>
        <p>
          ⚡ <b>Round 1:</b> Jul 24 – Aug 9 &nbsp;&nbsp;|&nbsp;&nbsp;
          🏆 <b>Round 2 (PathFinder Prototype):</b> Aug 14 – 31 &nbsp;&nbsp;|&nbsp;&nbsp;
          📋 <b>Top 25:</b> Sep 4 &nbsp;&nbsp;|&nbsp;&nbsp;
          🎤 <b>Demo Day:</b> Sep 11
        </p>
        <p>This project was proudly conceptualized, designed, and engineered by team <b>KineticModifiers</b> for the Round 2 PathFinder Prototype challenge. We set out to compete against the brightest minds by solving a critical problem in modern education using cutting-edge Generative AI.</p>
      </td>
    </tr>
  </table>
</div>

---

## 📖 Table of Contents
1. [The Problem & Our Solution](#-the-problem--our-solution)
2. [Core Product Features](#-core-product-features)
3. [Unique Micro-Interactions & Polish](#-unique-micro-interactions--polish)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [AI Integration & Prompt Engineering](#-ai-integration--prompt-engineering)
6. [Authentication & Security Flow](#-authentication--security-flow)
7. [Database Schema Design](#-database-schema-design)
8. [API Endpoints Reference](#-api-endpoints-reference)
9. [Advanced Folder Structure](#-advanced-folder-structure)
10. [Local Installation Guide](#-local-installation-guide)
11. [Deployment Guide](#-deployment-guide)
12. [Challenges Faced & Solutions](#-challenges-faced--solutions)
13. [Future Roadmap & Scaling](#-future-roadmap--scaling)

---

## 🌟 The Problem & Our Solution

### The Core Problem: "Choice Paralysis"
The internet has democratized education, but it has also created an overwhelming ecosystem. Beginners are bombarded by thousands of bootcamps, outdated YouTube tutorials, and fragmented documentation. Without a personal mentor, students often:
- Learn the wrong skills in the wrong order.
- Lose motivation due to lack of structured progress.
- Experience "tutorial hell" without building real projects.
- Struggle to bridge the gap between their current skill level and their end goal.

### Why Existing Solutions Fail
| Platform | Problem |
|----------|---------|
| YouTube | Unstructured, no progress tracking, content is outdated within months |
| Udemy / Coursera | One-size-fits-all courses, no personalization based on user's existing skills |
| Roadmap.sh | Static images with no interactivity, no AI adaptation, no progress tracking |
| ChatGPT | No persistence, forgets your progress, no visual roadmap |

### The LearnSync Solution
**LearnSync AI** disrupts the traditional learning management system (LMS) paradigm by acting as a highly intelligent, 24/7 personal mentor. Rather than presenting static, generic lists of courses, the platform functions as an active orchestrator of the user's educational journey. 

It dynamically generates **highly personalized, step-by-step learning roadmaps** based on a user's exact interests, current experience level, and ultimate career goals. LearnSync curates hyper-specific milestones, tracks progress in real-time, and provides an integrated AI chat interface to explain complex concepts natively.

---

## 🚀 Core Product Features

### 1. 🧠 Dynamic AI Onboarding & Goal Parsing
Users bypass complex, rigid forms. They simply describe their career ambitions and current constraints in natural language. This data is sent to a custom Next.js API route where it is packaged into a highly specific prompt. The prompt is processed by Google's cutting-edge `gemini-3.6-flash` AI model, which generates a strictly typed JSON structure containing a comprehensive, multi-step curriculum.

**Key Technical Detail:** We enforce strict JSON output by instructing the model with a schema constraint. If the model returns Markdown-wrapped JSON (e.g., ` ```json ... ``` `), our API automatically strips the wrapper using regex fallback parsing before saving to the database.

### 2. 🗺️ Interactive 3D Roadmap Generation
We built a visually stunning, Framer Motion-powered timeline. The timeline visually "draws" itself as you load the page, and milestone cards pop into view sequentially utilizing 3D transform physics. Each milestone contains:
- Theoretical concepts to master.
- Actionable project ideas and resource links.
- An estimated time to completion.
- AI-generated insight notes explaining *why* this milestone matters.

### 3. 💬 Context-Aware AI Mentor (RAG-Lite)
Learning isn't just about reading a list of topics; it's about asking questions. We integrated a persistent AI Assistant chat interface directly into the platform. When a user asks a question, the API silently queries MongoDB for their exact active learning path and current skill level, and injects this context into the system prompt. The AI Mentor answers questions specifically tailored to the user, bridging skill gaps organically without breaking the user's workflow.

**Key Technical Detail:** This is a lightweight implementation of Retrieval-Augmented Generation (RAG). Instead of a vector database, we retrieve structured user context directly from MongoDB and inject it into the prompt window, achieving the same contextual awareness with zero additional infrastructure cost.

### 4. 📊 Action-Oriented Dashboard
Avoids data overload by calculating macro progress metrics while isolating and highlighting a single **"Next Recommended Action"**, keeping cognitive load to an absolute minimum and keeping the learner moving forward. The dashboard displays:
- Total milestones completed vs. remaining.
- Current skill level badge.
- A visual progress bar with gradient fill.
- A compact preview of the full roadmap with completion indicators.

### 5. ✨ Premium Glassmorphism UI & Physics
To stand out in the HCLTech challenge, the UI had to be flawless. The dark mode features a mesmerizing, physics-simulated Aurora Glowing Mesh. Components scale slightly on interaction, projecting deep shadows and reflecting the glowing background, achieving seamless 60fps performance without heavy WebGL overhead.

---

## 🎯 Unique Micro-Interactions & Polish

These are the features that separate LearnSync from every other hackathon project. They demonstrate extreme attention to detail and premium product thinking.

| Feature | Description |
|---------|-------------|
| 🎉 **Confetti Celebration** | When a user clicks "Mark as Complete" on a milestone, a burst of brand-colored confetti (purple, pink, green, amber, blue) explodes from both edges of the screen using `canvas-confetti`. |
| ⌨️ **Typewriter Effect** | On the Dashboard, the user's learning goal types itself out letter-by-letter with a blinking purple cursor, simulating the AI actively writing their personalized path. |
| 🌊 **Custom 404 Page** | Instead of the default Next.js error page, users see a physics-animated spinning gradient orb with the message *"Lost in the Learning Path?"* and navigation buttons back to the app. |
| 🖱️ **Custom Scrollbar** | The default browser scrollbar is replaced with a sleek, thin, purple-tinted scrollbar that matches the brand palette. |
| 💡 **Active Nav Glow** | The currently active sidebar navigation item has a glowing purple left-border indicator, providing instant visual feedback. |
| 🌗 **Dark/Light Mode** | Full theme toggle with system preference detection via `next-themes`. All glassmorphism effects adapt dynamically. |
| 🫧 **Aurora Mesh Background** | Three massive CSS orbs with `blur(80px)` float, expand, and contract behind the application panels on a continuous 20-30 second animation loop, creating a 3D depth illusion. |

---

## 🏗️ System Architecture & Data Flow

To ensure high performance, responsiveness, and secure data handling, we engineered a scalable, full-stack application.

### User Journey & Core Loop
This flowchart maps how a user moves from an initial idea to executing a structured curriculum.

```mermaid
graph TD;
    A[User Visits Platform] --> B(Secure Sign Up / Login via NextAuth)
    B --> C{Has Active Path in DB?}
    C -- No --> D[Natural Language Goal Input]
    D --> E[Gemini 3.6 Flash Parses Ambition]
    E --> F[AI Generates JSON Curriculum]
    F --> G[(MongoDB Atlas Storage)]
    C -- Yes --> H[Dashboard Analytics]
    G --> H
    H --> I[View Interactive 3D Roadmap]
    H --> J[Query Persistent AI Mentor]
    I --> K[Mark Milestone Complete]
    K --> L{🎉 Confetti Celebration}
    L --> H
```

### Serverless Infrastructure
- **Frontend:** Built with Next.js 16 (React 19) for optimized rendering and routing. Styled utilizing Tailwind CSS for utility-first responsive design and Vanilla CSS for the custom Aurora animation system.
- **Backend:** Leverages Next.js Serverless API Routes to maintain a lightweight, instantly scalable backend infrastructure that tightly couples with the frontend components.
- **Database:** Operates on MongoDB Atlas utilizing the Mongoose ODM. The schema-less nature of NoSQL perfectly accommodates the highly variable, nested JSON structures of the AI-generated curriculums.
- **Security:** Implemented via NextAuth.js. We utilize secure, stateless JWT (JSON Web Token) session handling, paired with bcryptjs for rigorous password hashing and encryption.

---

## 🤖 AI Integration & Prompt Engineering

### Intelligent Onboarding Generation
How we force a Large Language Model to return structured, predictable data for our UI.

```mermaid
sequenceDiagram
    participant User
    participant NextJS API
    participant Gemini 3.6
    participant MongoDB

    User->>NextJS API: Submits Goal & Experience Level
    activate NextJS API
    NextJS API->>NextJS API: Construct Strict JSON Schema Prompt
    NextJS API->>Gemini 3.6: Inject Prompt + System Constraints
    activate Gemini 3.6
    Gemini 3.6-->>NextJS API: Returns Array of JSON Milestones
    deactivate Gemini 3.6
    NextJS API->>NextJS API: Regex Fallback Parsing (Strip Markdown)
    NextJS API->>MongoDB: Save Validated Schema to User Profile
    MongoDB-->>NextJS API: Success
    NextJS API-->>User: Redirect to 3D Roadmap
    deactivate NextJS API
```

### Context-Aware Mentor Workflow
How the chat assistant "knows" exactly what the user is currently learning without being explicitly told.

```mermaid
flowchart LR
    A[User Types Question] --> B(Chat API Route)
    B --> C[(Query MongoDB)]
    C -->|Return Active Roadmap + Level| D{Context Injector}
    D -->|Build Master Prompt| E[Gemini AI]
    E --> F[Hyper-Personalized Response]
    F --> A
```

### AI Model Fallback Chain
To guarantee 100% uptime during live demos and high-traffic events, we engineered a cascading fallback mechanism:

```mermaid
flowchart TD
    A[User Request] --> B[gemini-3.6-flash]
    B -->|Success| C[Return Response]
    B -->|Rate Limited / Error| D[gemini-3.5-flash]
    D -->|Success| C
    D -->|Rate Limited / Error| E[gemini-3.0-flash]
    E -->|Success| C
    E -->|All Failed| F[Return Graceful Error Message]
```

---

## 🔐 Authentication & Security Flow

We implemented a production-grade authentication system using NextAuth.js with the Credentials Provider.

```mermaid
sequenceDiagram
    participant Browser
    participant NextAuth
    participant MongoDB
    participant JWT

    Browser->>NextAuth: POST /api/auth/signin (email, password)
    NextAuth->>MongoDB: Find user by email
    MongoDB-->>NextAuth: Return user document
    NextAuth->>NextAuth: bcrypt.compare(password, hash)
    alt Password Valid
        NextAuth->>JWT: Sign token with user ID + name
        JWT-->>Browser: Set secure HTTP-only session cookie
        Browser->>Browser: Redirect to Dashboard
    else Password Invalid
        NextAuth-->>Browser: Return 401 Unauthorized
    end
```

---

## 🗄️ Database Schema Design

Our MongoDB database is structured using strict Mongoose schemas to ensure data integrity while allowing for the flexibility of AI-generated content.

### Entity Relationship Diagram
```mermaid
erDiagram
    USER ||--o{ LEARNING_PATH : has
    USER ||--o{ CHAT_MESSAGE : sends
    LEARNING_PATH ||--|{ MILESTONE : contains

    USER {
        ObjectId _id
        String name
        String email
        String password
        Number level
    }
    LEARNING_PATH {
        ObjectId _id
        ObjectId userId
        String goal
        String experienceLevel
        Number progress
        Date createdAt
    }
    MILESTONE {
        ObjectId _id
        String title
        String description
        String type
        String status
        String estimatedTime
        String aiNote
    }
    CHAT_MESSAGE {
        ObjectId _id
        ObjectId userId
        String role
        String content
        Date timestamp
    }
```

---

## 🔌 API Endpoints Reference

The application relies on several secure, serverless API routes under the `/api/` path. All routes are protected and require a valid NextAuth JWT session token.

| Endpoint | Method | Description | Payload |
|----------|--------|-------------|---------|
| `/api/auth/register` | `POST` | Registers a new user and hashes their password. | `{ email, password, name }` |
| `/api/auth/[...nextauth]` | `GET/POST` | Handles NextAuth authentication workflows and session management. | *Managed by NextAuth* |
| `/api/onboarding` | `POST` | Triggers Gemini API to generate a custom curriculum and saves it to MongoDB. | `{ goal, experienceLevel, interests }` |
| `/api/dashboard` | `GET` | Fetches the user's active learning path and calculates completion metrics. | *Requires Session* |
| `/api/roadmap` | `GET` | Retrieves the full milestone timeline for the active learning path. | *Requires Session* |
| `/api/milestone` | `POST` | Toggles the completion status of a specific milestone in the database. | `{ milestoneId, pathId }` |
| `/api/chat` | `POST` | Injects the user's roadmap context into the prompt and streams an AI response. | `{ messages, userId }` |
| `/api/chats` | `GET` | Retrieves the complete chat history for the logged-in user. | *Requires Session* |

---

## 📁 Advanced Folder Structure

```text
📦 learnsync-ai
 ┣ 📂 src
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📂 api                    # Serverless API Routes
 ┃ ┃ ┃ ┣ 📂 auth
 ┃ ┃ ┃ ┃ ┣ 📂 [...nextauth]     # NextAuth credential verification
 ┃ ┃ ┃ ┃ ┗ 📂 register          # New user registration + bcrypt hashing
 ┃ ┃ ┃ ┣ 📂 chat                # Context-injection & Gemini AI generation
 ┃ ┃ ┃ ┣ 📂 chats               # Chat history retrieval
 ┃ ┃ ┃ ┣ 📂 dashboard           # Metric calculations & progress aggregation
 ┃ ┃ ┃ ┣ 📂 milestone           # Completion toggling & confetti trigger
 ┃ ┃ ┃ ┣ 📂 onboarding          # Gemini prompt engineering logic
 ┃ ┃ ┃ ┗ 📂 roadmap             # Full timeline data retrieval
 ┃ ┃ ┣ 📂 chat                  # Chat UI with Markdown rendering
 ┃ ┃ ┣ 📂 login                 # Split-screen professional login
 ┃ ┃ ┣ 📂 signup                # User registration UI
 ┃ ┃ ┣ 📂 onboarding            # State-driven AI questionnaire
 ┃ ┃ ┣ 📂 roadmap               # Timeline mapping & Framer Motion variants
 ┃ ┃ ┣ 📜 not-found.jsx         # Custom animated 404 page
 ┃ ┃ ┣ 📜 globals.css           # Aurora animations & Glassmorphism design tokens
 ┃ ┃ ┣ 📜 layout.js             # Root layout with Aurora background injection
 ┃ ┃ ┗ 📜 page.js               # Dashboard with typewriter effect
 ┃ ┣ 📂 components
 ┃ ┃ ┣ 📜 Sidebar.jsx           # Persistent navigation with brand watermark
 ┃ ┃ ┣ 📜 AuthProvider.jsx      # NextAuth session wrapper
 ┃ ┃ ┣ 📜 ThemeProvider.jsx     # Dark/Light mode context
 ┃ ┃ ┗ 📜 ThemeToggle.jsx       # Theme switch component
 ┃ ┣ 📂 lib
 ┃ ┃ ┣ 📜 mongoose.js           # MongoDB connection pooling & caching
 ┃ ┃ ┗ 📜 geminiFallback.js     # Cascading AI model fallback chain
 ┃ ┣ 📂 models
 ┃ ┃ ┣ 📜 User.js               # User schema (bcrypt password field)
 ┃ ┃ ┣ 📜 LearningPath.js       # Path schema (nested milestone array)
 ┃ ┃ ┣ 📜 Milestone.js          # Milestone sub-document schema
 ┃ ┃ ┣ 📜 Chat.js               # Chat session schema
 ┃ ┃ ┗ 📜 ChatMessage.js        # Individual message schema
 ┃ ┗ 📜 middleware.js            # Route protection middleware
 ┣ 📜 .env                      # Environment variables (Git-ignored)
 ┣ 📜 package.json              # Dependencies & scripts
 ┗ 📜 README.md                 # This file
```

---

## 💻 Local Installation Guide

Want to run LearnSync's architecture on your own machine? Follow these simple steps:

### Prerequisites
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MongoDB Atlas** free cluster ([Create one here](https://www.mongodb.com/atlas))
- **Google AI Studio** API key ([Get one here](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/krrish-cypto/learnsync-ai.git
cd learnsync-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and configure the following required keys:
```env
# MongoDB Connection String (Set up a free cluster on MongoDB Atlas)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/learnsync"

# Google Gemini API Key (Get from Google AI Studio)
GEMINI_API_KEY="your-gemini-api-key"

# NextAuth Secret (Generate a random string for JWT Encryption)
NEXTAUTH_SECRET="your-super-secret-key-12345"

# Deployment URL (Required for production NextAuth)
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The application will automatically connect to your database and initialize the AI configurations.

---

## 🌐 Deployment Guide

LearnSync AI is deployed on **Vercel** (the creators of Next.js) for maximum performance and zero-config scaling.

### Steps to Deploy Your Own Instance
1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Add the environment variables (`GEMINI_API_KEY`, `MONGODB_URI`, `NEXTAUTH_SECRET`) in the Vercel dashboard.
4. Click **Deploy**. Your app will be live in under 2 minutes.

> **Live Production URL:** [https://learnsync-56nlakpb4-krishnaadubey2005-8466s-projects.vercel.app](https://learnsync-56nlakpb4-krishnaadubey2005-8466s-projects.vercel.app)

---

## ⚡ Challenges Faced & Solutions

Building LearnSync was not without its technical hurdles. Here are the key challenges we encountered and how we solved them:

| # | Challenge | Root Cause | Our Solution |
|---|-----------|------------|--------------|
| 1 | **AI Output Hallucination** | Gemini occasionally returned Markdown-wrapped responses instead of raw JSON, breaking our parser. | Implemented regex fallback parsing that strips ` ```json ``` ` wrappers before `JSON.parse()`. |
| 2 | **Session State Desync** | Client-side code was reading stale user IDs from `localStorage` while the server used NextAuth session tokens, causing 500 errors. | Migrated entirely to server-side JWT session validation via `session.user.id`. |
| 3 | **API Rate Limiting** | During intense testing, the primary Gemini model would hit rate limits, crashing the onboarding flow. | Built a cascading fallback mechanism that routes requests through backup models (`gemini-3.5-flash` → `gemini-3.0-flash`). |
| 4 | **Sidebar Scroll Bleed** | Scrolling the chat messages would cause the entire page (including the sidebar) to scroll off-screen. | Re-architected the CSS layout to use `height: 100vh; overflow: hidden` on the app container, with independent `overflow-y: auto` on the main content area. |
| 5 | **MongoDB ObjectId Validation** | Invalid or stale user IDs passed to the chat API caused Mongoose `CastError` crashes. | Added `mongoose.Types.ObjectId.isValid()` validation at the API entry point before any database queries. |

---

## 🔮 Future Roadmap & Scaling

While the current prototype is fully functional for the HCLTech AMPlified Hackathon, we have an expansive vision for the future of LearnSync AI:

1. **YouTube & Udemy Integration:** Directly parsing the generated milestones and querying the YouTube Data API to embed free, highly-rated video tutorials directly inside the milestone cards.
2. **Automated AI Quizzing:** Once a user marks a milestone as "Complete", the AI generates a dynamic 5-question quiz to ensure true retention before allowing them to move to the next stage.
3. **Community Leaderboards:** Gamifying the learning experience by allowing users with similar goals to compete on progress metrics, turning solitary learning into a social, motivating experience.
4. **Export to Notion/PDF:** Allowing users to export their generated curriculums to external productivity tools via API integrations.
5. **Mobile-First PWA:** Converting the web app into a Progressive Web App for offline milestone tracking and push notification reminders.

---

<div align="center">
  <h3>Engineered for the HCLTech AMPlified Challenge by</h3>
  <h2>🚀 KineticModifiers</h2>
  <p><i>Krishna | 2026</i></p>
</div>
