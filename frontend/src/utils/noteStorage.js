export function loadNotes(storageKey, seedNotes) {
  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) return seedNotes;

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : seedNotes;
  } catch {
    return seedNotes;
  }
}

export function persistNotes(storageKey, notes) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(notes));
  } catch {
    // 無法寫入 localStorage 時，內容仍保留在目前工作階段。
  }
}

export function sortByUpdatedAt(notes) {
  return [...notes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
}

export function formatUpdatedAt(value) {
  if (!value) return "尚未儲存";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function toPlainText(html) {
  if (!html) return "";

  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
