package com.vocabnotes.dto;

import java.util.List;

public record VocabularyRequest(
    String language,
    String term,
    String chineseExplanation,
    String pronunciation,
    List<String> partOfSpeech,
    String frequencyLevel,
    String etymology,
    String usageNotes,
    List<CollocationRequest> collocations,
    List<ExampleRequest> examples
) {
}
