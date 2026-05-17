export const getStoredUsers = () => {
  const saved = localStorage.getItem('dietAppUsers');
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const setStoredUsers = (users) => {
  localStorage.setItem('dietAppUsers', JSON.stringify(users));
};

export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const registerUser = async (email, password) => {
  const users = getStoredUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error('Email already registered.');
  }
  const passwordHash = await hashPassword(password);
  users.push({ email, passwordHash });
  setStoredUsers(users);
};

export const authenticateUser = async (email, password) => {
  const users = getStoredUsers();
  const passwordHash = await hashPassword(password);
  return users.some((user) => user.email === email && user.passwordHash === passwordHash);
};
