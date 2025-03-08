import React, { useState, useEffect } from 'react';

const RecentActivity = ({ userActivity }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem('recentActivities')) || [];
    setActivities(storedActivities);
  }, []);

  useEffect(() => {
    if (userActivity) {
      const newActivities = [
        { id: Date.now(), activity: userActivity, timestamp: new Date().toLocaleString() },
        ...activities,
      ].slice(0, 5);
      setActivities(newActivities);
      localStorage.setItem('recentActivities', JSON.stringify(newActivities));
    }
  }, [userActivity]);

  const handleDeleteActivity = (id) => {
    const updatedActivities = activities.filter((activity) => activity.id !== id);
    setActivities(updatedActivities);
    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recent Activities</h2>
      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activities.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
            >
              <span className="text-gray-700">
                {activity.activity} - <span className="text-gray-500">{activity.timestamp}</span>
              </span>
              <button
                onClick={() => handleDeleteActivity(activity.id)}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;