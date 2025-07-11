import React from 'react';
import { GitBranch, GitPullRequest, GitMerge, Clock } from 'lucide-react';

const EventItem = ({ event }) => {
  const formatMessage = (event) => {
    const { event_type, author, from_branch, to_branch, timestamp } = event;
    
    switch (event_type) {
      case 'push':
        return `${author} pushed to ${to_branch}`;
      case 'pull_request':
        return `${author} submitted a pull request from ${from_branch} to ${to_branch}`;
      case 'merge':
        return `${author} merged branch ${from_branch} to ${to_branch}`;
      default:
        return `${author} performed ${event_type}`;
    }
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'push':
        return <GitBranch className="w-5 h-5 text-green-500" />;
      case 'pull_request':
        return <GitPullRequest className="w-5 h-5 text-blue-500" />;
      case 'merge':
        return <GitMerge className="w-5 h-5 text-purple-500" />;
      default:
        return <GitBranch className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'push':
        return 'border-l-green-500 bg-green-50';
      case 'pull_request':
        return 'border-l-blue-500 bg-blue-50';
      case 'merge':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${getEventColor(event.event_type)} p-4 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getEventIcon(event.event_type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              {formatMessage(event)}
            </p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              event.event_type === 'push' ? 'bg-green-100 text-green-800' :
              event.event_type === 'pull_request' ? 'bg-blue-100 text-blue-800' :
              event.event_type === 'merge' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {event.event_type.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatTimestamp(event.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventItem;