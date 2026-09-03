const API_BASE_URL = 'http://localhost:5118';

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Erro ${response.status}: ${response.statusText}`);
  }
  if (response.status === 204) return null;
  return response.json();
}


export async function getGames() {
  const res = await fetch(`${API_BASE_URL}/games`);
  return handleResponse(res);
}

export async function getGame(id) {
  const res = await fetch(`${API_BASE_URL}/games/${id}`);
  return handleResponse(res);
}

export async function createGame(data) {
  const res = await fetch(`${API_BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateGame(id, data) {
  const res = await fetch(`${API_BASE_URL}/games/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteGame(id) {
  const res = await fetch(`${API_BASE_URL}/games/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}


export async function getGenres() {
  const res = await fetch(`${API_BASE_URL}/genres`);
  return handleResponse(res);
}
