# 🎲 QuantQuest  
**Chess.com for Quant Trading**  
*Gamified Quantitative Finance Education & Simulation*  

---

## 🌍 Mission  
To democratize quantitative finance education by making it engaging, hands-on, and accessible—so that anyone can develop real trading intuition, not just speculative habits.  

---

## 🤖 Coach Qunal - AI Chatbot Integration

QuantQuest now features **Coach Qunal**, an AI-powered quantitative finance coach powered by Anthropic's Claude API. Coach Qunal provides personalized guidance, answers questions, and helps users navigate their quant finance learning journey.

### Setup Instructions

1. **Get your Anthropic API Key:**
   - Visit [Anthropic Console](https://console.anthropic.com/)
   - Create an account and generate an API key

2. **Configure Environment Variables:**
   Create a `.env` file in the project root with:
   ```bash
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

3. **Features:**
   - Floating chat widget (bottom-right corner)
   - Session-based conversation history
   - Rate limiting and error handling
   - Responsive design for mobile/desktop
   - Expert quantitative finance guidance

---

## ⚠️ The Problem  
- **95% of trading education is noise**: influencer-driven, anecdotal, or flat-out unprofitable.  
- **Current simulators are shallow**: focus on guessing stock prices instead of building real quantitative skills.  
- **Learners burn out**: without clear progression, most quit within months.  
- **Quant education gap**: academic programs are too theoretical, while online content lacks rigor and structure.  

---

## 💡 The Solution: A Gamified Quant Trading Platform  
Like *Chess.com for trading*, users progress through structured skill trees, compete in challenges, and unlock advanced tools.  

### Core Features  
- 🎯 **Skill Trees**: From statistics → risk management → portfolio theory → algorithmic trading → derivatives.  
- ⚔️ **Peer-to-Peer Challenges**: Compete on identical historical datasets; ranked by Sharpe ratio, drawdown, and robustness.  
- 🧩 **Daily Quant Puzzles**: Bite-sized exercises (e.g., fix a broken backtest, detect overfitting, optimize a hedge).  
- 🐉 **Boss Battles vs. Market Crashes**: Survive 1987, 2000, 2008, 2020 with strategy resilience.  
- 🏆 **Achievements & Unlockables**: Tools like Monte Carlo simulators, options pricing engines, factor models unlocked through mastery.  
- 📊 **Leaderboards**:  
  - Global, regional, and skill-specific rankings.  
  - Categories: “Sharpe Masters,” “Crash Survivors,” “Puzzle Speedruns,” and more.  
  - Weekly/monthly resets to keep competition fresh.  
  - Teams & schools can compete, fostering community and group learning.  

---

## 👥 Target Users  
- **Students & Aspiring Quants**: Hands-on supplement to classroom theory.  
- **Retail Traders**: Learn real quantitative methods instead of gambling.  
- **Finance Professionals**: Upskill in risk management, derivatives, and algorithmic methods.  
- **Educators & Institutions**: Curriculum integration with gamified, practical modules.  

---

## 📈 Market Opportunity  
- **EdTech Market**: $500B+ global market, growing rapidly in STEM & finance verticals.  
- **Trading Platforms**: Millions of retail traders entering markets but lacking structured education.  
- **Chess.com Analogy**: Chess has ~130M users worldwide. Finance has an even larger aspirational audience.  

---

## 💰 Monetization  
- **Freemium model**: Free skill trees, basic challenges, and public leaderboards.  
- **Pro Subscription ($15–30/mo)**: Advanced datasets, exclusive tournaments, private leaderboards, certifications.  
- **Institutional Licenses**: Universities, bootcamps, and firms purchase seats for students or employees.  
- **Tournaments & Sponsorships**: Sponsored quant hackathons, leaderboard events with cash prizes.  

---

## ⏱ Why Now?  
- Retail investing is at all-time highs, but most education is shallow.  
- Gamified learning (Duolingo, Chess.com, Brilliant.org) is mainstream.  
- AI/ML tools are making quant concepts more approachable than ever.  

---

## 🛣 Roadmap  
**Phase 1 (MVP)**  
- Skill trees (statistics, probability, portfolio basics).  
- Daily quant puzzles.  
- Global leaderboard for core challenges.  

**Phase 2**  
- Peer-to-peer battles.  
- Boss battle scenarios.  
- Expanded leaderboard categories (by region, school, firm).  
- Unlockable advanced tools.  

**Phase 3**  
- Institutional partnerships.  
- Certification pathways.  
- Global quant tournaments with leaderboard-driven seeding.  

---

## 🌟 The Big Vision  
A world where learning quantitative finance is as addictive and accessible as solving chess puzzles.  
We don’t just train better traders—we train sharper thinkers, problem solvers, and risk managers for the data-driven economy.  

---

## ⚙️ Tech Stack  

### 🔙 Backend (Node.js Ecosystem)  
- **Framework**: Express.js  
- **Real-Time Communication**: Socket.IO (real-time leaderboards, live challenges, multiplayer elements).  
- **Data & APIs**:  
  - PostgreSQL (relational DB, strong for financial data + user progress tracking).  
  - Redis (caching leaderboards, session storage, real-time event queues).  
  - Prisma ORM (developer-friendly, TypeScript-native ORM for PostgreSQL).  
- **Quant / Data Processing**:  
  - Python microservices (FastAPI/Flask) for quant libraries (NumPy, pandas, scikit-learn, PyTorch).  
  - Communicate with Node.js via gRPC or REST.  
  - Containerization with Docker for scaling simulations.  
- **Auth & Security**:  
  - JWT (JSON Web Tokens) with refresh tokens.  
  - OAuth2 / SSO support (for institutions, schools).  

### 🎨 Frontend (Gamified & Interactive)  
- **Framework**: Next.js (React) – SEO-friendly, SSR + CSR hybrid.  
- **UI Libraries**: TailwindCSS, shadcn/ui, Framer Motion (animations).  
- **Charts & Visualization**: Recharts, D3.js, Plotly.js.  
- **State Management**: Zustand or Redux Toolkit.  
- **Data Fetching**: React Query / TanStack Query.  

### ☁️ Infrastructure & DevOps  
- **Containerization**: Docker + Kubernetes (for scaling backtests & simulations).  
- **Cloud**: AWS or GCP  
  - EC2/EKS for compute  
  - S3/Cloud Storage for historical market datasets  
  - RDS/CloudSQL for PostgreSQL  
- **CI/CD**: GitHub Actions or GitLab CI.  
- **Monitoring**: Prometheus + Grafana (backend), Sentry (frontend errors).  

---

## 📌 Extra Considerations  
- **Leaderboard scaling**: Use Redis sorted sets for real-time leaderboard updates.  
- **PvP Challenges**: WebSockets for low-latency head-to-head games.  
- **Market Data**: Integrate APIs (Polygon.io, Alpha Vantage, Tiingo) for realistic datasets.  
- **Future Institutional Needs**: Keep Python microservices modular so advanced quant toolkits can plug in easily.

---

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-username/quant-quest.git
   cd quant-quest
   npm install
   ```

2. **Set up Firebase (Optional)**
   To enable user authentication and data persistence:
   
   a. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
   
   b. Create a `.env.local` file in the root directory:
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   
   c. Enable Authentication (Email/Password) and Firestore Database in Firebase Console
   
   **Note**: The app works without Firebase - authentication features will be disabled with helpful console messages.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:5173`  
