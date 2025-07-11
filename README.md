#Deploy Link 
Frontened : https://webhook-repo-frontend.onrender.com
Backend : https://webhook-repo9backend.onrender.com

# GitHub Webhook Monitor

A real-time monitoring system for GitHub repository events (push, pull request, merge) with a Flask backend and React frontend.

## 🏗️ Architecture

### Components

1. **Flask Backend** (`backend/`)
   - Webhook receiver for GitHub events
   - RESTful API for event data
   - MongoDB integration for data storage
   - CORS configuration for frontend access

2. **React Frontend** (`src/`)
   - Real-time event display
   - Automatic polling every 15 seconds
   - Responsive design with event categorization
   - Error handling and loading states

3. **MongoDB Database**
   - Stores event data with consistent schema
   - Indexes for efficient querying
   - Automatic timestamp sorting

## 📁 Folder Structure

```
project-root/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration settings
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── src/
│   ├── components/
│   │   ├── EventList.js    # Event list container
│   │   └── EventItem.js    # Individual event display
│   ├── services/
│   │   └── api.js          # API service functions
│   ├── App.js              # Main React component
│   └── main.tsx            # React entry point
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- MongoDB (local or cloud instance)

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure MongoDB:**
   - Update `.env` file with your MongoDB connection string
   - Default: `mongodb://localhost:27017/github_events`

3. **Start the Flask server:**
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the React development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## 🔧 GitHub Webhook Configuration

1. **Go to your GitHub repository settings**
2. **Navigate to Webhooks section**
3. **Add a new webhook with:**
   - **Payload URL:** `http://your-server.com/webhook`
   - **Content Type:** `application/json`
   - **Events:** Select "Push", "Pull requests"
   - **Active:** ✓ Enabled

## 📊 Event Data Schema

```json
{
  "event_type": "push|pull_request|merge",
  "author": "username",
  "from_branch": "source-branch",
  "to_branch": "target-branch",
  "timestamp": "2021-04-01T21:30:00Z"
}
```

## 🎨 Frontend Features

- **Real-time Updates:** Automatic polling every 15 seconds
- **Event Categorization:** Different colors and icons for each event type
- **Responsive Design:** Works on desktop and mobile devices
- **Error Handling:** Graceful error states and loading indicators
- **Professional UI:** Clean, GitHub-inspired design

## 🔌 API Endpoints

- `POST /webhook` - Receive GitHub webhook events
- `GET /api/events` - Fetch last 10 events
- `GET /api/health` - Health check endpoint

## 📝 Event Display Format

- **Push:** "{author} pushed to {to_branch} on {timestamp}"
- **Pull Request:** "{author} submitted a pull request from {from_branch} to {to_branch} on {timestamp}"
- **Merge:** "{author} merged branch {from_branch} to {to_branch} on {timestamp}"

## 🛠️ Development

### Running in Development Mode

1. **Backend:** `python backend/app.py`
2. **Frontend:** `npm run dev`
3. **MongoDB:** Ensure MongoDB is running locally

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/github_events
SECRET_KEY=your-secret-key-here
DEBUG=True
CORS_ORIGINS=http://localhost:3000
```

## 🚀 Production Deployment

### Backend Deployment
- Use a production WSGI server (e.g., Gunicorn)
- Set up proper environment variables
- Configure MongoDB connection string
- Set up SSL certificates for HTTPS

### Frontend Deployment
- Build the React app: `npm run build`
- Serve static files through a web server
- Configure environment variables for production API URL

## 📊 Monitoring

The system includes:
- Health check endpoint for monitoring
- Error logging for debugging
- Real-time status indicators in the frontend
- Automatic reconnection on network issues
