import { createContext, useContext, useEffect, useState } from 'react';
import { fetchTeamMembers } from '../api/client';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const currentUser = 'Uzair Akram';

  useEffect(() => {
    fetchTeamMembers().then(setTeamMembers).catch(console.error);
  }, []);

  return (
    <AppContext.Provider value={{ teamMembers, currentUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
