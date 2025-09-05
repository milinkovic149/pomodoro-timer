import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [timerData, setTimerData] = useState({
    modeIndex: 0,
    secondsLeft: 25 * 60,
    isRunning: false,
    pomodoroCount: 0,
    totalPomodoroCount: 0
  });
  const [tasksData, setTasksData] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);

  // stable save functions to avoid changing dependencies in callbacks
  const saveTimerData = useCallback(async (data) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.id);
      await updateDoc(docRef, { timer: data });
    } catch (error) {
      console.error('Error saving timer data:', error);
    }
  }, [user]);

  const saveTasksData = useCallback(async (data) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.id);
      await updateDoc(docRef, { tasks: data, activeTaskId });
      setTasksData(data);
    } catch (error) {
      console.error('Error saving tasks data:', error);
    }
  }, [user, activeTaskId]);

  const addPomo = useCallback(async (taskId) => {
    if (!taskId) return;
    const updatedTasks = tasksData.map(task => 
      task.id === taskId ? { ...task, completedPomos: task.completedPomos + 1 } : task
    );
    setTasksData(updatedTasks);
    await saveTasksData(updatedTasks);
  }, [tasksData, saveTasksData]);

  const loadUserData = useCallback(async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.timer) {
          setTimerData(data.timer);
        } else {
          const defaultTimer = { modeIndex: 0, secondsLeft: 25 * 60, isRunning: false, pomodoroCount: 0, totalPomodoroCount: 0 };
          setTimerData(defaultTimer);
          await saveTimerData(defaultTimer);
        }
        if (data.tasks) setTasksData(data.tasks);
        if (data.activeTaskId) setActiveTaskId(data.activeTaskId);
      } else {
        // If no document, create with default
        const defaultTimer = { modeIndex: 0, secondsLeft: 25 * 60, isRunning: false, pomodoroCount: 0 };
        setTimerData(defaultTimer);
        await saveTimerData(defaultTimer);
        setTasksData([]);
        setActiveTaskId(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [saveTimerData]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.id);
    }
  }, [loadUserData]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    loadUserData(userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    const resetData = { modeIndex: 0, secondsLeft: 25 * 60, isRunning: false, pomodoroCount: 0, totalPomodoroCount: 0 };
    setTimerData(resetData);
    saveTimerData(resetData);
    setTasksData([]);
    setActiveTaskId(null);
  };

  return (
    <UserContext.Provider value={{
      user,
      timerData,
      setTimerData,
      tasksData,
      activeTaskId,
      saveTimerData,
      saveTasksData,
      addPomo,
      setActiveTaskId,
      handleLogin,
      handleLogout
    }}>
      {children}
    </UserContext.Provider>
  );
};
