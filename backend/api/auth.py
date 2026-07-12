from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '')
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    # Simulating successful credentials check
    user_name = email.split('@')[0] if '@' in email else 'Demo User'
    
    return jsonify({
        "status": "success",
        "token": "mock-jwt-token-from-flask-server-100",
        "user": {
            "id": "flask_user_01",
            "name": user_name.capitalize(),
            "email": email,
            "phone": "+91 98765 43210",
            "upiId": f"{user_name.lower()}@sentinelpay",
            "trustScore": 99
        }
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', 'New User')
    email = data.get('email', '')
    phone = data.get('phone', '')
    password = data.get('password', '')

    if not email or not password or not phone:
        return jsonify({"status": "error", "message": "Email, phone and password are required"}), 400

    username = name.lower().replace(' ', '')
    return jsonify({
        "status": "success",
        "token": "mock-jwt-token-from-flask-server-registered",
        "user": {
            "id": "flask_user_02",
            "name": name,
            "email": email,
            "phone": phone,
            "upiId": f"{username}@sentinelpay",
            "trustScore": 95
        }
    })

@auth_bp.route('/check-device', methods=['POST'])
def check_device():
    # Return mock device security analysis
    return jsonify({
        "status": "success",
        "deviceTrust": {
            "score": 96,
            "rootDetected": False,
            "developerMode": True,
            "vpnActive": False,
            "overlayDetected": False,
            "biometricsEnrolled": True,
            "riskLevel": "LOW",
            "reasons": ["Developer mode is active (allowed for simulation test)"]
        }
    })
