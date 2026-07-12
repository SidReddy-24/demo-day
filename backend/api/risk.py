from flask import Blueprint, request, jsonify
from engines.risk_engine import RiskEngine
from engines.graph_engine import GraphEngine
from mock.database import MockDatabase

risk_bp = Blueprint('risk', __name__)

@risk_bp.route('/check-risk', methods=['POST'])
def check_risk():
    data = request.get_json() or {}
    amount = float(data.get('amount', 0))
    recipient_upi = data.get('recipientUpi', '')
    active_call = bool(data.get('activeCall', False))
    safe_mode = bool(data.get('safeMode', False))

    if not recipient_upi:
         return jsonify({"status": "error", "message": "Recipient UPI is required"}), 400

    assessment = RiskEngine.evaluate_transaction(amount, recipient_upi, active_call, safe_mode)
    return jsonify(assessment)

@risk_bp.route('/check-qr', methods=['POST'])
def check_qr():
    data = request.get_json() or {}
    qr_data = data.get('qrData', '')

    if not qr_data:
        return jsonify({"status": "error", "message": "QR Payload data is required"}), 400

    upi_clean = qr_data.lower().strip()
    recipient_name = upi_clean.split('@')[0].replace('.', ' ').title()

    if MockDatabase.is_blacklisted(upi_clean):
        report = MockDatabase.get_report_details(upi_clean)
        return jsonify({
            "riskScore": 96,
            "riskLevel": "HIGH",
            "recipientName": recipient_name,
            "explanation": [
                f"Flagged under: {report.get('category')}",
                "Ecosystem status: Community Blacklisted",
                report.get('description', 'High risk activity detected.')
            ]
        })

    return jsonify({
        "riskScore": 14,
        "riskLevel": "LOW",
        "recipientName": recipient_name,
        "explanation": [
            "Scanned signature matches registered NPCI merchant guidelines",
            "Optimal trust rating in community database",
            "No active warning reports filed"
        ]
    })

@risk_bp.route('/report-merchant', methods=['POST'])
def report_merchant():
    data = request.get_json() or {}
    upi_id = data.get('upiId', '').lower().strip()
    category = data.get('category', 'Generic Threat')
    description = data.get('description', '')

    if not upi_id:
        return jsonify({"status": "error", "message": "Accused UPI ID is required"}), 400

    MockDatabase.add_report(upi_id, category, description)
    return jsonify({"status": "success", "message": "Merchant flagged in local registry"})

@risk_bp.route('/check-community', methods=['GET'])
def check_community():
    reports_list = MockDatabase.get_all_reports()
    return jsonify({
        "status": "success",
        "reports": reports_list,
        "totalReports": 1400 + len(reports_list)
    })

@risk_bp.route('/check-graph', methods=['GET'])
def check_graph():
    graph_data = GraphEngine.get_transaction_network()
    return jsonify(graph_data)
