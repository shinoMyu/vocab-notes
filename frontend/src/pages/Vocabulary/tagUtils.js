// 頻率派生的預設標籤（前端自動產生，不存資料庫）
export function getDerivedTag(frequencyLevel) {
  if (frequencyLevel === "非常によく使う") return "超使える";
  if (frequencyLevel === "よく使う") return "使える";
  return null;
}

// 取樣自 Notion 淺色主題的標籤配色
export const TAG_COLORS = [
  {
    id: "default",
    label: "預設",
    background: "transparent",
    border: "#d5dde3",
    text: "#5f6b76",
  },
  {
    id: "gray",
    label: "灰色",
    background: "#e3e2e0",
    border: "#d3d1cb",
    text: "#32302c",
  },
  {
    id: "brown",
    label: "棕色",
    background: "#eee0da",
    border: "#decbbf",
    text: "#442a1e",
  },
  {
    id: "orange",
    label: "橘色",
    background: "#fadec9",
    border: "#f5c6a7",
    text: "#49290f",
  },
  {
    id: "yellow",
    label: "黃色",
    background: "#fdecc8",
    border: "#f7dd9e",
    text: "#402c1b",
  },
  {
    id: "green",
    label: "綠色",
    background: "#dbeddb",
    border: "#c4dfc6",
    text: "#1c3829",
  },
  {
    id: "blue",
    label: "藍色",
    background: "#d3e5ef",
    border: "#bad5e4",
    text: "#183347",
  },
  {
    id: "purple",
    label: "紫色",
    background: "#e8deee",
    border: "#dacbe4",
    text: "#412454",
  },
  {
    id: "pink",
    label: "粉色",
    background: "#f5e0e9",
    border: "#efccdc",
    text: "#4c2337",
  },
  {
    id: "red",
    label: "紅色",
    background: "#ffe2dd",
    border: "#fcc7be",
    text: "#5d1715",
  },
];

const TAG_COLOR_MAP = Object.fromEntries(
  TAG_COLORS.map((color) => [color.id, color])
);

export const TAG_COLOR_TAGS = ["超使える", "使える", "未標籤"];

export const DEFAULT_TAG_COLORS = {
  超使える: "green",
  使える: "blue",
  未標籤: "gray",
};

const TAG_COLOR_STORAGE_KEY = "vocabnotes.tagColors";

export function loadTagColors() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(TAG_COLOR_STORAGE_KEY) ?? "null"
    );

    if (!stored || typeof stored !== "object") {
      return { ...DEFAULT_TAG_COLORS };
    }

    const colors = { ...DEFAULT_TAG_COLORS };

    for (const tag of TAG_COLOR_TAGS) {
      if (TAG_COLOR_MAP[stored[tag]]) colors[tag] = stored[tag];
    }

    return colors;
  } catch {
    return { ...DEFAULT_TAG_COLORS };
  }
}

export function persistTagColors(tagColors) {
  try {
    window.localStorage.setItem(
      TAG_COLOR_STORAGE_KEY,
      JSON.stringify(tagColors)
    );
  } catch {
    // 寫入失敗時只影響下次開啟時的顏色
  }
}

export function getTagColorStyle(tagColors, tagName) {
  const color = TAG_COLOR_MAP[tagColors?.[tagName]] ?? TAG_COLOR_MAP.default;

  return {
    background: color.background,
    borderColor: color.border,
    color: color.text,
  };
}
