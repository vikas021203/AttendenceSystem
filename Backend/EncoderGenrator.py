from io import BytesIO
import cv2
import face_recognition
import numpy as np
from PIL import Image


def find_encoding(image_file):
    # Convert file stream to PIL image
    image = Image.open(BytesIO(image_file.read()))

    # Convert PIL image to NumPy array
    img_array = np.array(image)

    # Convert BGR (OpenCV default) to RGB (face_recognition expects RGB)
    img_array_rgb = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)

    # Find face encodings
    face_encodings = face_recognition.face_encodings(img_array_rgb)

    if len(face_encodings) > 0:
        return face_encodings[0]  # Return the first face encoding
    else:
        raise ValueError("No faces found in the image")
