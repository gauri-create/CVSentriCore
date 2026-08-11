import cv2
import numpy as np
from flask import Flask, jsonify, request
import face_recognition

app = Flask(__name__)

# In-memory database simulation for known employees
# In production, you'd load these face encodings from your database/storage on startup
known_face_encodings = []
known_face_names = []

# Example: Registering a known employee (Ganesh) 
# You would normally load an image file from disk: 
# ganesh_image = face_recognition.load_image_file("ganesh.jpg")
# ganesh_encoding = face_recognition.face_encodings(ganesh_image)[0]
# known_face_encodings.append(ganesh_encoding)
# known_face_names.append("Ganesh (Owner/Staff)")

@app.route('/api/recognize', methods=['POST'])
def recognize_face():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    image_bytes = file.read()
    
    # Convert image bytes to numpy array for face_recognition
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Find faces in the uploaded frame
    face_locations = face_recognition.face_locations(img)
    face_encodings = face_recognition.face_encodings(img, face_locations)

    if not face_encodings:
        return jsonify({"status": "No Face Detected", "name": "None"})

    # Check the first detected face against our in-memory known list
    for face_encoding in face_encodings:
        if len(known_face_encodings) > 0:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)

            if matches[best_match_index]:
                name = known_face_names[best_match_index]
                return jsonify({
                    "name": name,
                    "status": "Access Granted",
                    "type": "Live Camera Match"
                })

        # If no match found in the in-memory cache
        return jsonify({
            "name": "Unknown Individual",
            "status": "Access Denied",
            "type": "Unrecognized Face"
        })

    return jsonify({"status": "Processing Error"})

if __name__ == '__main__':
    app.run(port=5000, debug=True)