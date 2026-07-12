from flask import Flask
from flask_cors import CORS
from api.auth import auth_bp
from api.risk import risk_bp

def create_app():
    app = Flask(__name__)
    CORS(app) # Allow React Native app (local and simulator IPs) to query Flask
    
    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(risk_bp)
    
    @app.route('/health', methods=['GET'])
    def health():
        return {"status": "healthy", "service": "SentinelPay AI Fraud Engine"}

    return app

if __name__ == '__main__':
    app = create_app()
    print("Starting SentinelPay AI Mock Flask Backend on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
