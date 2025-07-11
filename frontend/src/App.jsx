import React, { useState, useEffect } from 'react';
import { Github, Activity, RefreshCw } from 'lucide-react';
import EventList from './components/EventList';
import { fetchEvents } from './services/api';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadEvents = async () => {
    try {
      setError(null);
      const data = await fetchEvents();
      setEvents(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to load events. Please check if the backend is running.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadEvents();
    
    // Set up polling every 15 seconds
    const interval = setInterval(loadEvents, 15000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Github className="w-8 h-8 text-gray-900" />
              <h1 className="text-2xl font-bold text-gray-900">GitHub Event Monitor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Activity className="w-4 h-4" />
                <span>Real-time Updates</span>
              </div>
              {lastUpdate && (
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Recent Events</h2>
          <p className="text-gray-600">
            Monitor GitHub repository activity in real-time. Events are automatically refreshed every 15 seconds.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-gray-600">Loading events...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-red-500">⚠️</div>
              <div className="text-red-800">{error}</div>
            </div>
          </div>
        )}

        {/* Events List */}
        {!loading && !error && (
          <EventList events={events} />
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-12">
            <Github className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
            <p className="text-gray-600">
              Waiting for GitHub webhook events. Make sure your webhook is configured correctly.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;