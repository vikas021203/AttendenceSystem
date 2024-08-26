import uuid
from datetime import datetime, timedelta
import face_recognition
import cv2
import numpy as np
from firebase_admin import db
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import add_data, get_data_from_firebase, update_attendance, get_picture
from EncoderGenrator import find_encoding

app = Flask(__name__)
CORS(app)


@app.route('/register', methods=['POST'])
def register():
    if 'profilePicture' not in request.files:
        return jsonify({'error': 'Profile picture is required'}), 400

    # Generate a unique ID for the student
    student_id = str(uuid.uuid4())

    # Process file and student details
    name = request.form.get('name')
    major = request.form.get('major')
    starting_year = request.form.get('startingYear')
    profile_picture = request.files.get('profilePicture')

    # Print received data for debugging
    print(f"Received data: ID: {student_id}, Name: {name}, Major: {major}, Starting Year: {starting_year}")

    # Optionally, save the student's details to a database
    student_data = {
        student_id: {
            'name': name,
            'major': major,
            'starting_year': starting_year,
            'total_attendance': 0,
            'last_attendance_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'encoding': find_encoding(profile_picture).tolist()
        }
    }

    # Here you would add logic to encode the face and save to Firebase
    add_data(student_data, profile_picture, student_id)

    print(f"Received data: Name: {name}, Major: {major}, Starting Year: {starting_year}")

    return jsonify({'message': 'Student registered successfully'}), 200


def compare_encoding(webcam_encoding, known_encodings):
    results = face_recognition.compare_faces(known_encodings, webcam_encoding)
    return results


@app.route('/take_attendance', methods=['POST'])
def take_attendance():
    # Initialize webcam
    cap = cv2.VideoCapture(0)

    face_detected = False
    webcam_encoding = None

    while not face_detected:
        success, img = cap.read()
        if not success:
            cap.release()
            cv2.destroyAllWindows()
            return jsonify({'error': 'Failed to capture image from webcam'}), 500

        # Resize the image and convert to RGB
        img = cv2.resize(img, (0, 0), None, 0.25, 0.25)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Find face encodings
        face_cur_frame = face_recognition.face_locations(img)
        encodings = face_recognition.face_encodings(img, face_cur_frame)
        if encodings:
            webcam_encoding = encodings[0]
            face_detected = True
        else:
            # Display the current frame (optional, for debugging)
            cv2.imshow('Capturing Face', img)
            # Wait for a short period before capturing the next frame
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    # Release the webcam and close windows
    cap.release()
    cv2.destroyAllWindows()

    if not face_detected:
        return jsonify({'error': 'No face detected after waiting'}), 400

    # Retrieve known encodings from Firebase
    known_encodings, student_ids = get_data_from_firebase()

    if not known_encodings:
        return jsonify({'error': 'No known encodings found'}), 404

    # Compare the captured face encoding with known encodings
    matches = face_recognition.compare_faces(known_encodings, webcam_encoding)
    face_dis = face_recognition.face_distance(known_encodings, webcam_encoding)
    match_index = np.argmin(face_dis)

    if matches[match_index]:
        student_id = student_ids[match_index]
        student_ref = db.reference(f'Students/{student_id}')
        student_data = student_ref.get()

        # Get the current time and last attendance time
        current_time = datetime.now()
        last_attendance_time_str = student_data.get('last_attendance_time')
        last_attendance_time = datetime.strptime(last_attendance_time_str, '%Y-%m-%d %H:%M:%S') if last_attendance_time_str else None

        # Check if the last attendance was more than 1 hour ago
        if student_data.get('total_attendance') and last_attendance_time and current_time - last_attendance_time < timedelta(hours=1):
            return jsonify({'message': 'Attendance already marked within the last hour'}), 400

        # Update the attendance and last attendance time
        update_attendance(student_id)
        student_ref.update({'last_attendance_time': current_time.strftime('%Y-%m-%d %H:%M:%S')})

        profile_picture = get_picture(student_id)
        return jsonify({
            'message': 'Face recognized, attendance taken',
            'data': {
                'student_data': student_data,
                'profile_picture': profile_picture
            }
        }), 200
    else:
        return jsonify({'message': 'Face not recognized'}), 404


if __name__ == '__main__':
    app.run(port=5000, debug=True)
