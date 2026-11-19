export const GRAMMAR_CATEGORIES = [
  "時態",
  "語態",
  "助詞",
  "句型",
  "敬語",
  "接續",
  "語氣",
  "比較",
];

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "英文", short: "EN" },
  { value: "ja", label: "日文", short: "JA" },
];

export const LANGUAGE_LABELS = {
  en: "英文",
  ja: "日文",
};

export const CATEGORY_TONES = {
  時態: "blue",
  語態: "indigo",
  助詞: "amber",
  句型: "teal",
  敬語: "rose",
  接續: "violet",
  語氣: "olive",
  比較: "slate",
};

export function getCategoryTone(category) {
  return CATEGORY_TONES[category] ?? "slate";
}

export const MOCK_VOCAB = [
  { term: "accomplish", language: "en", meaning: "完成；達成" },
  { term: "thrive", language: "en", meaning: "茁壯成長；蓬勃發展" },
  { term: "resilient", language: "en", meaning: "有韌性的；能復原的" },
  { term: "deteriorate", language: "en", meaning: "惡化；變壞" },
  { term: "persuade", language: "en", meaning: "說服；勸說" },
  { term: "breathtaking", language: "en", meaning: "令人屏息的；驚人的" },
  { term: "諦める", language: "ja", meaning: "放棄；死心" },
  { term: "費やす", language: "ja", meaning: "花費；耗費" },
  { term: "込める", language: "ja", meaning: "傾注；包含" },
  { term: "仕草", language: "ja", meaning: "舉止；動作" },
  { term: "見極める", language: "ja", meaning: "看清；辨明" },
];

const STORAGE_KEY = "vocab-notes:grammar-notes:v1";

const SEED_NOTES = [
  {
    id: "grammar-present-perfect",
    title: "現在完成式 Present Perfect",
    language: "en",
    categories: ["時態"],
    updatedAt: "2026-11-13T10:20:00+09:00",
    relatedVocab: [
      { term: "accomplish", language: "en" },
      { term: "thrive", language: "en" },
    ],
    content: `<p>現在完成式表達「過去發生、但和現在仍有關聯」的動作或狀態，重點在現在的結果、經驗或持續狀態。</p>
<h2>基本結構</h2>
<p><strong>have / has + 過去分詞</strong></p>
<h2>三種用法</h2>
<ul>
  <li><strong>經驗</strong>：I have been to Kyoto twice.</li>
  <li><strong>完成</strong>：She has just finished her report.</li>
  <li><strong>持續</strong>：We have lived here since 2020.</li>
</ul>
<p>不搭配明確的過去時間（yesterday、last week）；要交代時間就用過去簡單式。</p>
<blockquote>I saw him yesterday. ✓<br>I have seen him yesterday. ✗</blockquote>`,
  },
  {
    id: "grammar-wa-ga",
    title: "は vs が：話題與焦點",
    language: "ja",
    categories: ["助詞"],
    updatedAt: "2026-11-12T21:05:00+09:00",
    relatedVocab: [],
    content: `<p>「は」和「が」的差別，關鍵在<strong>說話者想讓聽者注意哪裡</strong>。</p>
<h2>は：提出話題</h2>
<p>把已知資訊放在話題位置，重點落在後面的說明。</p>
<ul>
  <li>田中さんは先生です。（田中先生是老師。）</li>
  <li>この本は面白いです。（這本書很有趣。）</li>
</ul>
<h2>が：指出焦點</h2>
<p>常用於新資訊、焦點，或回答「誰／什麼」。</p>
<ul>
  <li>誰が先生ですか。 → 田中さんが先生です。</li>
</ul>
<blockquote>象は鼻が長い。（大象的鼻子很長。）</blockquote>`,
  },
  {
    id: "grammar-teshimau",
    title: "〜てしまう：完成與遺憾",
    language: "ja",
    categories: ["句型"],
    updatedAt: "2026-11-12T19:40:00+09:00",
    relatedVocab: [
      { term: "諦める", language: "ja" },
      { term: "費やす", language: "ja" },
    ],
    content: `<p>「〜てしまう」表示<strong>完成</strong>，也常帶<strong>遺憾、後悔</strong>或「不小心」的語感。口語常縮成「〜ちゃう」。</p>
<h2>接續</h2>
<p>動詞て形 + しまう</p>
<h2>常見語感</h2>
<ul>
  <li><strong>完成</strong>：宿題を全部やってしまった。</li>
  <li><strong>遺憾</strong>：財布を落としてしまった。</li>
  <li><strong>不小心</strong>：つい食べ過ぎてしまった。</li>
</ul>
<p>會話中常說「〜ちゃう／〜じゃう」。不是所有用法都帶負面語氣。</p>`,
  },
  {
    id: "grammar-subjunctive",
    title: "假設語氣 Subjunctive",
    language: "en",
    categories: ["語氣"],
    updatedAt: "2026-11-10T15:30:00+09:00",
    relatedVocab: [
      { term: "resilient", language: "en" },
      { term: "deteriorate", language: "en" },
    ],
    content: `<p>假設語氣表達<strong>與事實相反</strong>、<strong>不可能實現</strong>或<strong>強烈建議</strong>的情況。</p>
<h2>與現在事實相反</h2>
<p>If + 過去式, would + 原形動詞</p>
<blockquote>If I had more time, I would learn Portuguese.<br>（如果我有更多時間，我會學葡萄牙語。）</blockquote>
<h2>與過去事實相反</h2>
<p>If + had + 過去分詞, would have + 過去分詞</p>
<blockquote>If she had left earlier, she would have caught the train.</blockquote>
<p>常見錯誤：If I was you → If I were you；If I would have known → If I had known。</p>`,
  },
  {
    id: "grammar-relative-pronoun",
    title: "關係代名詞 who / which / that",
    language: "en",
    categories: ["句型"],
    updatedAt: "2026-11-09T11:15:00+09:00",
    relatedVocab: [{ term: "persuade", language: "en" }],
    content: `<p>關係代名詞把兩個句子接成一個，先判斷<strong>先行詞是人還是物</strong>，再看關係子句缺少什麼成分。</p>
<ul>
  <li><strong>who</strong>：先行詞是人。</li>
  <li><strong>which</strong>：先行詞是物。</li>
  <li><strong>that</strong>：人、物皆可，口語常用。</li>
</ul>
<blockquote>The teacher who helped me was very patient.</blockquote>
<p>關係代名詞作受詞時可以省略。</p>
<blockquote>The book (which) I bought yesterday is already sold out.</blockquote>`,
  },
  {
    id: "grammar-keigo",
    title: "敬語三分類：尊敬語・謙讓語・丁寧語",
    language: "ja",
    categories: ["敬語"],
    updatedAt: "2026-11-08T09:50:00+09:00",
    relatedVocab: [{ term: "見極める", language: "ja" }],
    content: `<p>日文敬語分成<strong>尊敬語</strong>、<strong>謙讓語</strong>、<strong>丁寧語</strong>，先確認動作主體是誰，再選擇形式。</p>
<h2>尊敬語：抬高對方</h2>
<p>用於對方的動作。</p>
<ul>
  <li>先生がおっしゃいました。（老師說了。）</li>
</ul>
<h2>謙讓語：降低自己</h2>
<p>用於自己的動作，藉由壓低自己來抬高對方。</p>
<ul>
  <li>明日、伺います。（明天我會拜訪。）</li>
</ul>
<h2>丁寧語：禮貌語氣</h2>
<p>「です・ます」體，讓表達更有禮貌。</p>
<blockquote>これは私の資料です。</blockquote>`,
  },
];

export function loadGrammarNotes() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return SEED_NOTES;

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : SEED_NOTES;
  } catch {
    return SEED_NOTES;
  }
}

export function persistGrammarNotes(notes) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // 無法寫入 localStorage 時，內容仍保留在目前工作階段。
  }
}

export function createGrammarDraft(note) {
  return {
    id: note?.id ?? null,
    title: note?.title ?? "",
    language: note?.language ?? "en",
    categories: [...(note?.categories ?? [])],
    content: note?.content ?? "",
    relatedVocab: (note?.relatedVocab ?? []).map((item) => ({ ...item })),
    updatedAt: note?.updatedAt ?? null,
  };
}

export function sortGrammarNotes(notes) {
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
