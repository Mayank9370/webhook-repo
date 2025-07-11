import React from 'react';
import EventItem from './EventItem';

const EventList = ({ events }) => {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <EventItem key={index} event={event} />
      ))}
    </div>
  );
};

export default EventList;