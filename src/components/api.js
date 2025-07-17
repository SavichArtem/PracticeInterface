const API_URL = 'http://localhost:3001/users';

export const fetchUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Ошибка сервера');
  return await response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response;
};

export const checkUserExists = async (field, value) => {
  const users = await fetchUsers();
  return users.some(user => user[field] === value);
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response;
};