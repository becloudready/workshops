Aaron (fraze-dev)         — Backend + MongoDB CRUD: Build the Notice API, service logic, MongoDB Atlas integration, and Create/Read/Update/Delete operations.

Alena (futurecoder123456) — React CRUD Frontend: Build the notice list, create form, edit form, delete controls, and connect them to the agreed API.

Danielle (danielle-jack)  — Group USP + UX: Build the team's unique feature such as urgent notices, threads, dark mode, or another chosen USP, plus the related frontend/backend changes.

Mark (MarkPaulRosenthal)  — Deployment + CI/CD + Integration: Package/deploy Lambda, API Gateway, S3 frontend, environment variables, and GitHub Actions, while also handling integration fixes needed for deployment.


```text
Group1_MAAD_Mark_Alena_Aaron_Danielle/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/edtech/noticeboard/
│   │   │   │   ├── config/             # Security, MongoConfig & CORS
│   │   │   │   ├── controller/         # REST Endpoints
│   │   │   │   │   ├── AuthController.java        # Mark
│   │   │   │   │   ├── CohortController.java      # Mark
│   │   │   │   │   ├── CurriculumController.java  # Aaron
│   │   │   │   │   ├── ProgressController.java    # Aaron/Danielle
│   │   │   │   │   └── DashboardController.java   # Danielle
│   │   │   │   ├── model/              # MongoDB Documents (@Document)
│   │   │   │   │   ├── User.java                  # Trainees, HR, Managers
│   │   │   │   │   ├── Cohort.java                # Group metadata & student IDs
│   │   │   │   │   ├── TrainingPlan.java          # Modules & Milestones
│   │   │   │   │   └── ProgressLog.java           # Trainee submissions & status
│   │   │   │   ├── repository/         # MongoRepository interfaces
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── CohortRepository.java
│   │   │   │   │   ├── TrainingPlanRepository.java
│   │   │   │   │   └── ProgressLogRepository.java
│   │   │   │   └── service/            # Business Logic & Scheduled Email Jobs (Aaron)
│   │   │   └── resources/
│   │   │       └── application.properties         # MongoDB URI & App Settings
│   │   └── test/
│   └── pom.xml (or build.gradle)
│
├── frontend/
│   ├── src/
│   │   ├── components/                 # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Onboarding.jsx          # HR user & cohort onboarding UI (Alena)
│   │   │   ├── TraineeView.jsx         # Student progress & blocker UI (Alena)
│   │   │   ├── PlanBuilder.jsx         # Curriculum management UI (Aaron)
│   │   │   └── ManagerDash.jsx         # Manager holistic view & charts (Danielle)
│   │   └── services/                   # Axios / Fetch API integrations
│   └── index.html
│
├── .gitignore
├── README.md
└── docker-compose.yml
```
