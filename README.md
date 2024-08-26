## About the Project

This project is an attendance management system that utilizes face recognition technology to automate the process of marking attendance. The system is designed to streamline attendance tracking and ensure accurate records by leveraging modern computer vision techniques.

### Key Features

- **Face Recognition**: Utilizes advanced face recognition algorithms to identify and verify students.
- **Automated Attendance Marking**: Automatically marks attendance based on facial recognition, reducing manual effort and improving accuracy.
- **Student Registration**: New students must register by providing their details and capturing their facial images for the system to recognize them.
- **Real-Time Processing**: Captures and processes student images in real-time to mark attendance before class sessions.

### How It Works

1. **Registration**: New students need to register by providing their information and capturing their facial images. These images are used to create face encodings that are stored in the database.
2. **Attendance Marking**: During class sessions, the system captures live images of students and matches them against the stored face encodings to mark attendance.
3. **Backend Integration**: The backend server handles the face recognition and attendance marking logic, interacting with Firebase for data storage and retrieval.

### Requirements

- **Frontend**: The frontend interface allows students to register and view their attendance records.
- **Backend**: The backend server processes face recognition and manages student data.
- **Firebase**: Used for storing face encodings and other relevant data.

### Getting Started

This project consists of both frontend and backend components. To run both servers simultaneously, follow the steps below in separate terminal windows.

## Frontend Setup

1. **Navigate to the Frontend folder:**

    ```bash
    cd Frontend
    ```

2. **Install packages:**

    ```bash
    npm install
    ```

3. **Start the frontend server:**

    ```bash
    npm run dev
    ```

## Backend Setup

1. **Navigate to the Backend folder:**

    ```bash
    cd Backend
    ```

2. **Ensure the following prerequisites are met:**
    - Install `dotenv` and `cmake`.
    - Create a Firebase project and place the required environment variables in the `.env` file.
    - Use the `serviceAccountKey` provided by Firebase.

3. **Install Python packages:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the backend server:**

    ```bash
    python3 server.py
    ```

---

Both the frontend and backend servers need to be running for the application to work correctly. Ensure that you execute these commands in separate terminal windows.
