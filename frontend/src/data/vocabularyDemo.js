// =====================================================
// 前端測試資料
// 只用來檢查 UI，不是真正的使用者資料，也不會寫入 MySQL。
// 想預覽完全沒有單字的畫面，把陣列改成 []。
// =====================================================

export const demoEntries = [
  {
    id: "demo-1",
    language: "en",
    term: "maintain",
    pronunciation: "/meɪnˈteɪn/",
    partOfSpeech: ["v."],
    chineseExplanation:
      "維持某種狀態或水準不下降；也可指維護、保養機器設備或系統，讓它持續正常運作。",
    frequencyLevel: "よく使う",
    etymology: "源自拉丁語 manu tenere（用手拿住），manu（手）+ tenere（握住），字面上是「握在手中不放」，引申為「保持」。",
    collocations: [
      { id: "demo-c1", phrase: "maintain quality", explanation: "維持品質" },
      { id: "demo-c2", phrase: "maintain a balance", explanation: "維持平衡" },
      { id: "demo-c3", phrase: "maintain a relationship", explanation: "維繫關係" },
    ],
    examples: [
      {
        id: "demo-e1",
        sentence: "It's important to maintain a healthy lifestyle.",
        translation: "維持健康的生活方式很重要。",
      },
      {
        id: "demo-e2",
        sentence: "The engineers work hard to maintain the system.",
        translation: "工程師們努力維護這套系統。",
      },
    ],
    usageNotes:
      "比 keep 更正式，常用於工作、技術或書面情境。近義詞有 keep、preserve、sustain，其中 preserve 強調「防止變壞」、sustain 強調「持續供應／支撐」。",
    relatedTerm: "維持する",
    relatedEntryId: null,
  },
  {
    id: "demo-2",
    language: "en",
    term: "breathtaking",
    pronunciation: "/ˈbreθˌteɪ.kɪŋ/",
    partOfSpeech: ["adj."],
    chineseExplanation:
      "美得令人屏息的、驚人的；用來形容景色、成就等令人讚嘆到說不出話的事物。",
    frequencyLevel: "そこそこ使う",
    etymology: "breathtaking = breath（呼吸）+ taking（奪走），字面「奪走呼吸的」。",
    collocations: [
      { id: "demo2-c1", phrase: "breathtaking view", explanation: "令人屏息的美景" },
      { id: "demo2-c2", phrase: "breathtaking speed", explanation: "驚人的速度" },
    ],
    examples: [
      {
        id: "demo2-e1",
        sentence: "The view from the summit was absolutely breathtaking.",
        translation: "山頂的景色真的美得令人屏息。",
      },
    ],
    usageNotes: "語氣比 beautiful 強很多，帶「震撼」的感覺；口語也常用 stunning 代替。",
    relatedTerm: "息をのむような",
    relatedEntryId: null,
  },
  {
    id: "demo-3",
    language: "en",
    term: "heads-up",
    pronunciation: "/ˈhedz.ʌp/",
    partOfSpeech: ["n.", "int."],
    chineseExplanation:
      "（名詞）事先的提醒、預警；（感嘆詞）用來叫別人「小心、注意」。",
    frequencyLevel: "よく使う",
    etymology: "源自棒球術語，叫場上選手「抬起頭（head up）」注意來球。",
    collocations: [
      { id: "demo3-c1", phrase: "give someone a heads-up", explanation: "事先提醒某人" },
    ],
    examples: [
      {
        id: "demo3-e1",
        sentence: "Just a heads-up — the meeting got moved to Friday.",
        translation: "先跟你說一聲——會議改到週五了。",
      },
    ],
    usageNotes:
      "職場口語極常用，比 warning 輕鬆。常見句型：Just a heads-up (that)...。注意拼寫常寫成 heads up 或 heads-up。",
    relatedTerm: null,
    relatedEntryId: null,
  },
  {
    id: "demo-4",
    language: "en",
    term: "adrenaline-fueled",
    pronunciation: "/əˈdren.ə.lɪn ˌfjuːld/",
    partOfSpeech: ["adj."],
    chineseExplanation: "腎上腺素飆升的、充滿刺激與緊張感的。",
    frequencyLevel: "あまり使わない",
    etymology: "adrenaline（腎上腺素）+ fueled（被……驅動的），合成形容詞。",
    collocations: [
      { id: "demo4-c1", phrase: "adrenaline-fueled adventure", explanation: "腎上腺素飆升的冒險" },
      { id: "demo4-c2", phrase: "adrenaline-fueled sports", explanation: "極限運動" },
    ],
    examples: [
      {
        id: "demo4-e1",
        sentence: "Skydiving is the ultimate adrenaline-fueled experience.",
        translation: "高空跳傘是終極的腎上腺素體驗。",
      },
    ],
    usageNotes: "新聞與廣告語境多，日常對話較少直接用，多半說 intense 或 thrilling。",
    relatedTerm: null,
    relatedEntryId: null,
  },
  {
    id: "demo-5",
    language: "ja",
    term: "維持する",
    pronunciation: "いじする",
    partOfSpeech: ["動詞"],
    chineseExplanation:
      "維持、保持。指使某種狀態持續不變，常用於秩序、水準、關係等抽象事物。",
    frequencyLevel: "よく使う",
    etymology: "",
    collocations: [
      { id: "demo5-c1", phrase: "体力を維持する", explanation: "維持體力" },
    ],
    examples: [
      {
        id: "demo5-e1",
        sentence: "毎日運動して健康を維持している。",
        translation: "每天運動以維持健康。",
      },
    ],
    usageNotes: "對應英文 maintain，雙向連結測試用條目。",
    relatedTerm: "maintain",
    relatedEntryId: "demo-1",
  },
];

// 想預覽沒有任何資料的狀態時，改成：
// export const demoEntries = [];
