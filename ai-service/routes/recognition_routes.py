from flask import Blueprint, jsonify, request
from services.face_service import FaceService

recognition_bp = Blueprint('recognition', __name__)
face_service = FaceService()

@recognition_bp.route('/recognize', methods=['POST'])
def recognize():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    image_bytes = file.read()
    
    result = face_service.recognize(image_bytes)
    return jsonify(result)
