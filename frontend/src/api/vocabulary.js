const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VOCABULARY_PATH = "/api/vocabulary";

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("尚未設定 VITE_API_BASE_URL，請參考 frontend/.env.example。");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message || `API 請求失敗：HTTP ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// 依語言查詢單字（en / ja）
export function getVocabulary(language) {
  return request(
    `${VOCABULARY_PATH}?language=${encodeURIComponent(language)}`
  );
}

export function createVocabulary(data) {
  return request(VOCABULARY_PATH, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateVocabulary(id, data) {
  return request(`${VOCABULARY_PATH}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// 批次匯入單字（重複的由後端跳過）
export function importVocabulary(entries) {
  return request(`${VOCABULARY_PATH}/batch`, {
    method: "POST",
    body: JSON.stringify(entries),
  });
}

export function deleteVocabulary(id) {
  return request(`${VOCABULARY_PATH}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
