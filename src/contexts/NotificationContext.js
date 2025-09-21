import React, { createContext, useContext, useState } from 'react';
import PopupNotification from '../components/PopupNotification';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };

    setNotifications(prev => [...prev, notification]);

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const value = {
    showNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 10000,
        pointerEvents: 'none'
      }}>
        {notifications.map((notification) => (
          <div key={notification.id} style={{
            pointerEvents: 'auto',
            marginBottom: notifications.length > 1 ? '10px' : '0'
          }}>
            <PopupNotification
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}