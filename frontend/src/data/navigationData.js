import {
  House,
  Languages,
  BookOpen,
  Code2,
  NotebookPen,
  Search,
  Settings,
} from "lucide-react";

export const navigationItems = [
  {
    key: "overview",
    label: "總覽",
    subtitle: "Overview",
    path: "/",
    icon: House,
    description: "整理知識、記錄想法，建立自己的學習空間。",
  },
  {
    key: "english-vocab",
    label: "英文單字",
    subtitle: "English Vocabulary",
    path: "/vocabulary/english",
    icon: Languages,
    description: "整理英文詞彙、語源、常見搭配與實際用法。",
  },
  {
    key: "japanese-vocab",
    label: "日文單字",
    subtitle: "Japanese Vocabulary",
    path: "/vocabulary/japanese",
    icon: Languages,
    description: "整理日文詞彙、讀音與詳細解釋。",
  },
  {
    key: "grammar",
    label: "文法筆記",
    subtitle: "Grammar Notes",
    path: "/grammar",
    icon: BookOpen,
    description: "整理英文與日文文法、句型及使用規則。",
  },
  {
    key: "programming",
    label: "程式與技術筆記",
    subtitle: "Programming & Technology",
    path: "/programming",
    icon: Code2,
    description: "保存程式知識、技術文件與開發紀錄。",
  },
  {
    key: "notes",
    label: "一般筆記",
    subtitle: "General Notes",
    path: "/notes",
    icon: NotebookPen,
    description: "記錄靈感與其他想法。",
  },
  {
    key: "search",
    label: "搜尋",
    subtitle: "Search",
    path: "/search",
    icon: Search,
  },
  {
    key: "settings",
    label: "設定",
    subtitle: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export const sidebarGroups = [
  {
    title: "工作空間",
    keys: ["overview"],
  },
  {
    title: "語言學習",
    keys: ["english-vocab", "japanese-vocab", "grammar"],
  },
  {
    title: "技術知識",
    keys: ["programming"],
  },
  {
    title: "個人筆記",
    keys: ["notes"],
  },
  {
    title: "系統",
    keys: ["search", "settings"],
  },
];

export const homeCategoryKeys = [
  "english-vocab",
  "japanese-vocab",
  "grammar",
  "programming",
  "notes",
];

export const sidebarNavigation = sidebarGroups.map((group) => ({
  title: group.title,
  items: group.keys
    .map((key) => navigationItems.find((item) => item.key === key))
    .filter(Boolean),
}));

export const homeCategories = homeCategoryKeys
  .map((key) => navigationItems.find((item) => item.key === key))
  .filter(Boolean);
