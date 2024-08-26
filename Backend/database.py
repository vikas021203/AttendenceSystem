import base64
import io
import os
import firebase_admin
import numpy as np
from PIL import Image
from firebase_admin import credentials, storage
from firebase_admin import db
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')
BUCKET_URL = os.getenv('BUCKET_URL')

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': DATABASE_URL,
    'storageBucket': BUCKET_URL
})


def add_data(data, profile_picture, student_id):
    ref = db.reference('Students')
    for key, value in data.items():
        ref.child(key).set(value)

        # Convert the image to an in-memory file
        img = Image.open(profile_picture)
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)

        # Upload the image to Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(f'student_images/{student_id}.jpg')
        blob.upload_from_file(img_byte_arr, content_type='image/jpeg')


def get_data_from_firebase():
    ref = db.reference('Students')
    students_data = ref.get()

    if students_data is None:
        print("No data found in Firebase under 'Students'")
        return []

    encodings = []
    student_ids = []
    for student_id, student_info in students_data.items():
        encoding_list = student_info.get('encoding')
        if encoding_list:
            encoding = np.array(encoding_list)
            encodings.append(encoding)
            student_ids.append(student_id)

    return encodings, student_ids


def update_attendance(student_id):
    student_ref = db.reference(f'Students/{student_id}')
    student_data = student_ref.get()
    old_attendance = student_data.get('total_attendance')
    new_attendance = old_attendance + 1
    student_ref.update({'total_attendance': new_attendance})


def get_picture(student_id):
    # Create a reference to the image file in Firebase Storage
    bucket = storage.bucket()
    blob = bucket.blob(f'student_images/{student_id}.jpg')

    # Download the image data as a byte string
    img_data = blob.download_as_string()

    # Convert the byte string to an image
    img = Image.open(io.BytesIO(img_data))

    # Convert the image to a base64 string
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return img_base64
