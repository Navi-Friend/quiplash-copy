# Quiplash Clone 🎮✨  
*A hilarious multiplayer party game inspired by Jackbox's Quiplash!*

## 🚀 Project Overview  
Quiplash Clone is a real-time multiplayer game where players compete to create the funniest answers to prompts. The game features:  
- 👥 3-8 players per room  
- 🎤 Custom question sets  
- ⏱️ Timed rounds with voting  
- 🏆 Score tracking and winner announcements  
- 💬 Real-time chat  

Built with modern web technologies for seamless cross-device gameplay!

## 🛠️ Tech Stack  
### Frontend  
- **React** ⚛️ (Vite build tool)  
- **TypeScript** 📜  
- **Socket.IO** 🔌 (Real-time communication)  
- **Tailwind CSS** 🎨 (Styling)  
- **Framer Motion** 🏃‍♂️ (Animations)  

### Backend  
- **Node.js** 🟢  
- **Express** 🚂  
- **Socket.IO** 📡  
- **Prisma** 🗃️ (ORM)  
- **PostgreSQL** 🐘 (Database)
- **Redis** (Cache)  

### DevOps  
- **Docker** 🐳 (Containerization)  

## 🎯 Game Features  
- 🕹️ Multiple game modes
- 📱 Mobile-friendly interface  
- 🎭 VIP player controls  

## 🛠️ Installation  

### Prerequisites  
- Node.js v18+  
- PostgreSQL 15+  
- Docker (optional)  

### Backend Setup  
1. Clone the repo:  
   ```bash
   git clone https://github.com/Navi-Friend/quiplash-copy
   cd quiplash-clone/server
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Set up environment variables (create `.env` file):  
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/quiplash?schema=public"
   PORT=3000
   ```

4. Database setup:  
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the server:  
   ```bash
   npm run dev
   ```

### Redis Setup
1. Install docker image
    ```bash
    docker pull redis/redis-stack
    ```
2. Run docker image
    ```bash
    docker run -d --name redis-stack -p 6379:6379 redis/redis-stack:latest
    ```
    
### Frontend Setup  
1. Navigate to client directory:  
   ```bash
   cd ../client
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Start the development server:  
   ```bash
   npm run dev
   ```

## 🎮 How to Play  
1. Host creates a game room  
2. Players join via room code  
3. VIP starts the game  
4. Each round:  
   - ✏️ Players answer prompts  
   - 👍 Players vote on best answers  
   - 🏆 Points awarded for votes  

## 📂 Project Structure  
```
quiplash-clone/
├── client/          # Frontend code
├── server/          # Backend code
│   ├── prisma/      # Database schema
│   ├── src/         # Server source
└── README.md
```

## 🤝 Contributing  
Contributions welcome! Please:  
1. Fork the repository  
2. Create your feature branch  
3. Submit a pull request  

## 📜 License  
MIT License - see [LICENSE](LICENSE) for details  

---

Made with ❤️ by [Navi-Friend]

**Happy gaming! 🎉**  

> *"The game where what you say is funnier than how you say it!"* 😆