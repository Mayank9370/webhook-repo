import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from datetime import datetime
import logging
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB configuration
app.config['MONGO_URI'] = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/github_events')
mongo = PyMongo(app)

def extract_event_data(payload, event_type):
    """Extract relevant data from GitHub webhook payload"""
    try:
        if event_type == 'push':
            return {
                'event_type': 'push',
                'author': payload.get('pusher', {}).get('name', 'Unknown'),
                'from_branch': None,
                'to_branch': payload.get('ref', '').replace('refs/heads/', ''),
                'timestamp': datetime.utcnow().isoformat() + 'Z'
            }

        elif event_type == 'pull_request':
            pr = payload.get('pull_request', {})
            return {
                'event_type': 'pull_request',
                'author': pr.get('user', {}).get('login', 'Unknown'),
                'from_branch': pr.get('head', {}).get('ref', 'Unknown'),
                'to_branch': pr.get('base', {}).get('ref', 'Unknown'),
                'timestamp': datetime.utcnow().isoformat() + 'Z'
            }

        elif event_type == 'merge':
            pr = payload.get('pull_request', {})
            return {
                'event_type': 'merge',
                'author': pr.get('merged_by', {}).get('login', 'Unknown'),
                'from_branch': pr.get('head', {}).get('ref', 'Unknown'),
                'to_branch': pr.get('base', {}).get('ref', 'Unknown'),
                'timestamp': datetime.utcnow().isoformat() + 'Z'
            }

        else:
            return None

    except Exception as e:
        logger.error(f"Error extracting event data: {str(e)}", exc_info=True)
        return None

@app.route('/webhook', methods=['POST'])
def webhook():
    """Handle GitHub webhook events"""
    try:
        event_type = request.headers.get('X-GitHub-Event')
        payload = request.get_json()

        if not payload:
            logger.warning("No JSON payload received or failed to parse.")
            return jsonify({'error': 'Invalid JSON payload'}), 400

        logger.info(f"Received {event_type} event")

        event_data = None

        if event_type == 'push':
            event_data = extract_event_data(payload, 'push')

        elif event_type == 'pull_request':
            action = payload.get('action')
            pr_data = payload.get('pull_request', {})

            if action == 'opened':
                event_data = extract_event_data(payload, 'pull_request')
            elif action == 'closed' and pr_data.get('merged'):
                event_data = extract_event_data(payload, 'merge')

        if event_data:
            try:
                mongo.db.events.insert_one(event_data)
                logger.info(f"Stored event: {event_data}")
                return jsonify({'status': 'success', 'event': event_data}), 200
            except Exception as db_err:
                logger.error(f"MongoDB insert failed: {str(db_err)}", exc_info=True)
                return jsonify({'error': 'DB insert failed'}), 500
        else:
            return jsonify({'status': 'ignored', 'message': 'Event type not processed'}), 200

    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/events', methods=['GET'])
def get_events():
    """Get the last 10 events from MongoDB"""
    try:
        events = list(mongo.db.events.find({}, {'_id': 0}).sort('timestamp', -1).limit(10))
        return jsonify(events), 200
    except Exception as e:
        logger.error(f"Error fetching events: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to fetch events'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}), 200

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Webhook server is running'}), 200

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug, host='0.0.0.0', port=port)
