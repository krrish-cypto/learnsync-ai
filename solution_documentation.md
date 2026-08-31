# LearnSync AI - Solution Architecture & Documentation
**Team Name:** KineticModifiers
**Project Type:** AI-Powered Personalized Learning Path Recommender SaaS
**Deployment URL:** https://learnsync-56nlakpb4-krishnaadubey2005-8466s-projects.vercel.app

---

## 1. Executive Summary
The rapid expansion of online learning has created "choice paralysis". While courses are abundant, learners lack structured, personalized roadmaps tailored to their unique goals and skill levels. **LearnSync AI** solves this by acting as a 24/7 intelligent personal mentor. Our platform dynamically generates custom learning curriculums, tracks progress visually, tests knowledge with AI-generated quizzes, allows for voice interactions, and provides context-aware AI explanations (even for uploaded PDFs) to bridge skill gaps.

## 2. Product Thinking & UX Decisions
To build a SaaS that users trust and love, we heavily prioritized User Experience (UX) and Product Design:
- **Cinematic Entry:** Users are greeted by a stunning landing page with typewriter effects, floating cards, and a seamless onboarding flow.
- **Zero-Friction Onboarding:** Users describe their goals in natural language rather than navigating complex dropdowns.
- **Glassmorphism, Themes, & Physics:** Full dark/light mode support. The interface uses a 3D simulated Aurora background and fluid spring-physics via Framer Motion. Milestone cards sequentially slide into view, and progress lines draw themselves natively.
- **Action-Oriented Dashboard:** The dashboard calculates progress metrics and explicitly isolates the "Next Recommended Action" to keep users motivated and focused.
- **Micro-Interactions:** Custom scrollbars, active navigation glows, pulsing microphone icons, and celebratory confetti upon completing milestones or passing quizzes.

## 3. Core Features & AI/ML Components
We engineered a full-stack, state-aware application rather than a simple wrapper:

### A. Intelligent Onboarding Engine
User data (interests, experience, goals) is processed by a custom API route and injected into a strict prompt for Google's **Gemini 3.6 Flash** model. The AI parses the natural language and outputs a highly structured JSON array of progressive milestones, which is then serialized and saved to MongoDB.

### B. Interactive Learning Roadmap & Export
The generated curriculum is rendered as a vertical timeline. Each milestone includes:
- Theoretical concepts to master.
- Specific, actionable resources and AI insights.
- Estimated completion time.
- State-tracking ("Mark as Complete") linked securely to the user's database record.
- **Professional Export:** Users can click "Download Report" to programmatically generate and download a branded PDF (using `jsPDF`) detailing their entire curriculum and progress, completely bypassing the browser's messy print dialog.

### C. Context-Aware AI Assistant (with PDF RAG)
Instead of a generic chatbot, our AI Assistant is heavily integrated into the user's state. 
- **State Injection:** When a user asks a question, the API silently queries MongoDB to retrieve their exact learning path, rich profile (college, skills, goals), and current skill level, injecting it into the system prompt.
- **Document Analysis:** Users can upload PDF documents (like syllabuses or textbooks). The server extracts the text using `pdf-parse` and injects it into the AI's context window, allowing the AI to answer questions directly related to the uploaded document.
- **Voice Input:** Integrated with the browser's Web Speech API (`webkitSpeechRecognition`), users can interact hands-free with their AI mentor.

### D. Dynamic AI Knowledge Check (Quiz)
Testing retention is critical. LearnSync features a dedicated `/quiz` section where the backend queries the user's *completed milestones*, feeds that exact context into the Gemini model, and generates a dynamic 5-question multiple-choice quiz on the fly. The UI provides live scoring, correct/incorrect visual feedback, and most importantly, AI-generated explanations for *why* an answer is correct.

### E. Automated Fallback Redundancy
To ensure 100% uptime during demonstrations and high-traffic events, we built a fallback architecture. If the primary Gemini model hits a rate limit, the API seamlessly routes the request through a backup model, and if all APIs fail, it falls back to a locally simulated mock state to guarantee the application UI never crashes.

## 4. Technical Architecture
LearnSync AI is built on a modern, robust tech stack designed for scalability:

- **Frontend Framework:** Next.js 16 (React 19)
- **Styling & Animation:** Vanilla CSS, Framer Motion, next-themes
- **Backend Environment:** Next.js Serverless API Routes
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** NextAuth.js (JWT session tokens and bcryptjs password encryption)
- **AI/ML Engine:** Google GenAI SDK (Gemini 3.6 Flash)
- **Document & File Processing:** `pdf-parse`, `jsPDF`, `jspdf-autotable`
- **Speech Recognition:** Web Speech API

## 5. Feasibility & Future Scope
LearnSync AI is fully feasible as a commercial product. The serverless architecture allows infinite scaling, and the AI integration costs are minimized by offloading generic conversational logic while strictly structuring roadmap generation. 

**Future Expansion:**
1. Integration with YouTube APIs for direct video embedding inside milestones.
2. Community leaderboards for gamified learning.
3. Full Vector-based Retrieval-Augmented Generation (RAG) using Pinecone for semantic search across hundreds of uploaded PDFs.
4. Mobile-first Progressive Web App (PWA) with push notifications for study reminders.
