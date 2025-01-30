:drawing_pin: Curriculum Management System - Backend
Welcome to the backend repository for the Curriculum Management System! This project simplifies curriculum design for teachers by replacing complex spreadsheets with a web-based interface.
:file_folder: Project Structure
backend/
│-- server.js        # Main server file
│-- config/         # Configuration files (e.g., database connection)
│-- routes/         # All API route handlers
│   ├── acRoutes.js  # Routes for Assessment Criteria (AC)
│   ├── loRoutes.js  # Routes for Learning Outcomes (LO)
│   ├── roRoutes.js  # Routes for Report Outcomes (RO)
│   ├── studentRoutes.js  # Routes for student-related operations
│-- models/         # Database models (if using ORM like Sequelize)
│-- middleware/     # Middleware functions (e.g., authentication)
│-- package.json    # Dependencies and scripts
│-- README.md       # Project documentation
:rocket: Getting Started
:one: Clone the Repository
git clone https://github.com/yourusername/curriculum-backend.git
cd curriculum-backend
:two: Install Dependencies
npm install
:three: Set Up Environment Variables
Create a .env file in the root directory and add the following:
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
PORT=5000
:four: Start the Server
npm start
:hammer_and_spanner: API Endpoints
Student Routes
GET /api/ac_scores → Get all assessment scores for a student
GET /api/students/:id → Get student details
LO & AC Routes
GET /api/lo_ac_mapping → Get LO-AC mapping
POST /api/lo_ac_mapping → Add a new LO-AC mapping
RO Routes
GET /api/ro_scores → Get report outcome scores
:oil_drum: Database Schema
Students (id, name, section)
AssessmentCriteria (AC) (ac_id, description)
LearningOutcomes (LO) (lo_id, description)
ReportOutcomes (RO) (ro_id, description)
Scores (student_id, ac_id, value)
LO-AC Mapping (lo_id, ac_id, weight)
:building_construction: Future Enhancements
:white_tick: Implement authentication & authorization :white_tick: Add admin panel for better management :white_tick: Optimize queries for large datasets
:handshake: Contributing
Feel free to fork this repository, submit PRs, or open issues if you find bugs or have feature suggestions! :rocket:
:page_facing_up: License
This project is licensed under the MIT License.
