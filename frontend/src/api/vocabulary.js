// =====================================================
// 英文單字 API
//
// 注意：以下 API 路徑是「待確認的範例」，不是已知的後端規格。
// 請和負責後端的同學確認：
// 1. API 的實際網址
// 2. 查詢、新增、修改、刪除的路徑與 HTTP 方法
// 3. 回傳資料的格式
// 4. collocations / examples 是否為陣列，以及 ID 格式
//
// 確認後只需要在這個檔案調整，不必讓每個 UI 元件直接呼叫 API。
// =====================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 暫定 REST API 路徑，需依後端實際規格修改。
const VOCABULARY_PATH = "/api/vocabulary";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API 請求失敗：HTTP ${response.status}`);
  }

  // 如果後端使用 204 No Content，這裡就不應直接解析 JSON。
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// 查詢英文單字。
// 預期回傳陣列的格式仍需和後端確認。
export function getEnglishVocabulary() {
  return request(`${VOCABULARY_PATH}?language=en`);
}

// 新增單字。
// 預期後端會回傳已儲存的資料，但實際格式需確認。
export function createEnglishVocabulary(data) {
  return request(VOCABULARY_PATH, {
    method: "POST",
    body: JSON.stringify({
      ...data,
      language: "en",
    }),
  });
}

// 修改單字。假設使用 ID 定位，路徑需確認。
export function updateEnglishVocabulary(id, data) {
  return request(`${VOCABULARY_PATH}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({
      ...data,
      language: "en",
    }),
  });
}

// 刪除單字。路徑需確認。
export function deleteEnglishVocabulary(id) {
  return request(`${VOCABULARY_PATH}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}