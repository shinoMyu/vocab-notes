import { useCallback, useState } from "react";

function createId() {
  return crypto.randomUUID();
}

function createEmptyForm({
  collocationSeed = [],
  exampleSeed = [{ sentence: "", translation: "" }],
} = {}) {
  return {
    term: "",
    chineseExplanation: "",
    partOfSpeech: [],
    pronunciation: "",
    frequencyLevel: "",
    etymology: "",
    collocations: collocationSeed.map((item) => ({
      id: createId(),
      phrase: item.phrase ?? "",
      explanation: item.explanation ?? "",
    })),
    examples: exampleSeed.map((item) => ({
      id: createId(),
      sentence: item.sentence ?? "",
      translation: item.translation ?? "",
    })),
    usageNotes: "",
    relatedTerm: "",
  };
}

function createFormFromEntry(entry) {
  return {
    term: entry.term ?? "",
    chineseExplanation: entry.chineseExplanation ?? "",
    partOfSpeech: [...(entry.partOfSpeech ?? [])],
    pronunciation: entry.pronunciation ?? "",
    frequencyLevel: entry.frequencyLevel ?? "",
    etymology: entry.etymology ?? "",
    collocations: (entry.collocations ?? []).map((item) => ({
      id: item.id ?? createId(),
      phrase: item.phrase ?? "",
      explanation: item.explanation ?? "",
    })),
    examples: (entry.examples ?? []).map((item) => ({
      id: item.id ?? createId(),
      sentence: item.sentence ?? "",
      translation: item.translation ?? "",
    })),
    usageNotes: entry.usageNotes ?? "",
    relatedTerm: entry.relatedTerm ?? "",
  };
}

function buildCleanPayload(form, options = {}) {
  const { skipCollocations = false, skipEtymology = false } = options;

  const seenPhrases = new Set();

  return {
    term: form.term.trim(),
    chineseExplanation: form.chineseExplanation.trim(),
    partOfSpeech: [...form.partOfSpeech],
    pronunciation: form.pronunciation.trim(),
    frequencyLevel: form.frequencyLevel,
    etymology: skipEtymology ? "" : form.etymology.trim(),
    collocations: skipCollocations
      ? []
      : form.collocations.flatMap((item) => {
          const phrase = (item.phrase ?? "").trim();
          if (!phrase) return [];

          // 資料庫的 unique index 不區分大小寫，前端用同樣規則去重
          const key = phrase.toLowerCase();
          if (seenPhrases.has(key)) return [];

          seenPhrases.add(key);
          return [
            {
              phrase,
              explanation: (item.explanation ?? "").trim() || null,
            },
          ];
        }),
    examples: form.examples.flatMap((item) => {
      const sentence = (item.sentence ?? "").trim();
      if (!sentence) return [];

      return [
        {
          sentence,
          translation: (item.translation ?? "").trim() || null,
        },
      ];
    }),
    usageNotes: form.usageNotes.trim(),
    relatedTerm: form.relatedTerm.trim() || null,
  };
}

function useVocabularyForm(initialForm) {
  const [form, setForm] = useState(initialForm);

  const updateField = useCallback((name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  }, []);

  const handleChange = useCallback(
    (event) => {
      updateField(event.target.name, event.target.value);
    },
    [updateField]
  );

  const togglePartOfSpeech = useCallback((value) => {
    setForm((previous) => ({
      ...previous,
      partOfSpeech: previous.partOfSpeech.includes(value)
        ? previous.partOfSpeech.filter((item) => item !== value)
        : [...previous.partOfSpeech, value],
    }));
  }, []);

  const addCollocation = useCallback(
    (initial = { phrase: "", explanation: "" }) => {
      setForm((previous) => ({
        ...previous,
        collocations: [
          ...previous.collocations,
          { id: createId(), phrase: "", explanation: "", ...initial },
        ],
      }));
    },
    []
  );

  const updateCollocation = useCallback((id, field, value) => {
    setForm((previous) => ({
      ...previous,
      collocations: previous.collocations.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const removeCollocation = useCallback((id) => {
    setForm((previous) => ({
      ...previous,
      collocations: previous.collocations.filter((item) => item.id !== id),
    }));
  }, []);

  const addExample = useCallback(
    (initial = { sentence: "", translation: "" }) => {
      setForm((previous) => ({
        ...previous,
        examples: [
          ...previous.examples,
          { id: createId(), sentence: "", translation: "", ...initial },
        ],
      }));
    },
    []
  );

  const updateExample = useCallback((id, field, value) => {
    setForm((previous) => ({
      ...previous,
      examples: previous.examples.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const removeExample = useCallback((id) => {
    setForm((previous) => ({
      ...previous,
      examples: previous.examples.filter((item) => item.id !== id),
    }));
  }, []);

  const moveItem = useCallback((field, draggedId, targetId) => {
    if (draggedId === targetId) return;

    setForm((previous) => {
      const list = previous[field];
      const from = list.findIndex((item) => item.id === draggedId);
      const to = list.findIndex((item) => item.id === targetId);

      if (from < 0 || to < 0) return previous;

      const next = [...list];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);

      return { ...previous, [field]: next };
    });
  }, []);

  return {
    form,
    updateField,
    handleChange,
    togglePartOfSpeech,
    addCollocation,
    updateCollocation,
    removeCollocation,
    addExample,
    updateExample,
    removeExample,
    moveItem,
  };
}

export {
  createEmptyForm,
  createFormFromEntry,
  buildCleanPayload,
};

export default useVocabularyForm;
