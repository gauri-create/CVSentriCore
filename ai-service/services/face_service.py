import io
import requests
import numpy as np
import face_recognition
import cv2

class FaceService:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []
        self.load_known_employees_from_db()

    def load_known_employees_from_db(self):
        try:
            response = requests.get('http://localhost:8080/api/employees/sync')
            if response.status_code == 200:
                employees = response.json()
                
                for emp in employees:
                    name = emp.get('name')
                    # Matches your database column name 'picture_url'
                    image_path = emp.get('picture_url') 
                    
                    if not image_path:
                        continue

                    full_image_url = f"http://localhost:8080{image_path}"
                    img_response = requests.get(full_image_url)

                    if img_response.status_code == 200:
                        image_bytes = io.BytesIO(img_response.content)
                        image = face_recognition.load_image_file(image_bytes)
                        encodings = face_recognition.face_encodings(image)

                        if encodings:
                            self.known_face_encodings.append(encodings[0])
                            self.known_face_names.append(f"{name} (Staff)")
                            print(f"Successfully loaded face profile for: {name}")
            else:
                print("Failed to fetch employees from Spring Boot backend.")
        except Exception as e:
            print("Error connecting to Spring Boot for sync:", e)

    def recognize(self, image_bytes):
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        face_locations = face_recognition.face_locations(img)
        face_encodings = face_recognition.face_encodings(img, face_locations)

        if not face_encodings:
            return {"status": "No Face Detected", "name": "None"}

        for face_encoding in face_encodings:
            if len(self.known_face_encodings) > 0:
                matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)

                if matches[best_match_index]:
                    return {
                        "name": self.known_face_names[best_match_index],
                        "status": "Access Granted",
                        "type": "Live Camera Match"
                    }

            return {
                "name": "Unknown Individual",
                "status": "Access Denied",
                "type": "Unrecognized Face"
            }

        return {"status": "Processing Error"}