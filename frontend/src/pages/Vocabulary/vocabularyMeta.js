export const partOfSpeechOptions = {
  en: [
    { label: "名詞", value: "n." },
    { label: "動詞", value: "v." },
    { label: "形容詞", value: "adj." },
    { label: "副詞", value: "adv." },
    { label: "介系詞", value: "prep." },
    { label: "連接詞", value: "conj." },
    { label: "代名詞", value: "pron." },
    { label: "感嘆詞", value: "int." },
  ],
  ja: [
    { label: "名詞", value: "名詞" },
    { label: "動詞", value: "動詞" },
    { label: "形容詞", value: "形容詞" },
    { label: "形容動詞", value: "形容動詞" },
    { label: "副詞", value: "副詞" },
    { label: "助詞", value: "助詞" },
    { label: "助動詞", value: "助動詞" },
    { label: "接続詞", value: "接続詞" },
    { label: "連体詞", value: "連体詞" },
    { label: "感動詞", value: "感動詞" },
  ],
};

export function getPartOfSpeechLabel(language, value) {
  const options = partOfSpeechOptions[language] ?? partOfSpeechOptions.en;

  return options.find((option) => option.value === value)?.label ?? value;
}

export const frequencyOptions = [
  {
    label: "あまり使わない",
    value: "あまり使わない",
    range: "1–2",
    score: 2,
    className: "freq-low",
  },
  {
    label: "そこそこ使う",
    value: "そこそこ使う",
    range: "3–5",
    score: 4,
    className: "freq-mid",
  },
  {
    label: "よく使う",
    value: "よく使う",
    range: "6–8",
    score: 7,
    className: "freq-high",
  },
  {
    label: "非常によく使う",
    value: "非常によく使う",
    range: "9–10",
    score: 9,
    className: "freq-top",
  },
];

export const FREQUENCY_META = Object.fromEntries(
  frequencyOptions.map(({ value, ...meta }) => [value, meta])
);
