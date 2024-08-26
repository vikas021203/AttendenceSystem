# Project Setup

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
