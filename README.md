# Task Manager — Spring Boot + React + MongoDB

A full-stack task management app.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Java 17+
- Maven
- Node.js 16+
- MongoDB (local) OR MongoDB Atlas account

---

## STEP 1 — Import into Eclipse

1. Open Eclipse
2. **File → Import → Maven → Existing Maven Projects**
3. Browse to this folder → Finish

---

## STEP 2 — Set up MongoDB

### Option A: Local MongoDB
Make sure MongoDB is running locally. The default URI works:
```
mongodb://localhost:27017/taskdb
```

### Option B: MongoDB Atlas (for deployment)
1. Go to https://mongodb.com/atlas → free account
2. Create M0 free cluster
3. Database Access → Add user (save password)
4. Network Access → Allow from Anywhere (0.0.0.0/0)
5. Connect → Drivers → copy URI
6. Paste in `src/main/resources/application.properties`

---

## STEP 3 — Run the Backend

In Eclipse:
- Right-click project → **Run As → Spring Boot App**
- Backend runs on: http://localhost:8080
- Test: http://localhost:8080/api/tasks → should return `[]`

---

## STEP 4 — Run the Frontend

Open a terminal in the `frontend/` folder:

```bash
npm install
npm start
```

Frontend runs on: http://localhost:3000
(It proxies API calls to http://localhost:8080 automatically)

---

## STEP 5 — Deploy on Render

### 5a. Build React into Spring Boot static folder

```bash
# In the frontend folder:
npm run build

# Windows:
xcopy build\* ..\src\main\resources\static\ /E /Y /I

# Mac/Linux:
cp -r build/* ../src/main/resources/static/
```

### 5b. Build the JAR

In Eclipse: Right-click project → **Run As → Maven Build**
Goals: `clean package -DskipTests`

Or in terminal:
```bash
./mvnw clean package -DskipTests
```

### 5c. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskmanager.git
git push -u origin main
```

### 5d. Deploy on Render

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Environment:** Java
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/taskmanager-0.0.1-SNAPSHOT.jar`
4. Environment Variables:
   - Key: `SPRING_DATA_MONGODB_URI`
   - Value: your MongoDB Atlas URI
5. Click **Deploy** 🚀

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/{id} | Get task by ID |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/{id} | Update task |
| DELETE | /api/tasks/{id} | Delete task |
| GET | /api/tasks/status?completed=true | Filter by status |

---

## Project Structure

```
taskmanager/
├── src/
│   ├── main/
│   │   ├── java/com/example/taskmanager/
│   │   │   ├── TaskmanagerApplication.java
│   │   │   ├── model/Task.java
│   │   │   ├── repository/TaskRepository.java
│   │   │   └── controller/TaskController.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/          ← React build goes here for deployment
│   └── test/
├── frontend/                    ← React app (dev only)
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/index.html
│   └── package.json
├── pom.xml
└── README.md
```
