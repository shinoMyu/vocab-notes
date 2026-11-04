package com.vocabnotes.dto;

import java.util.List;

public record VocabularyResponse(
    Long id,
    String language,
    String term,
    String chineseExplanation,
    String pronunciation,
    List<String> partOfSpeech,
    String frequencyLevel,
    String etymology,
    String usageNotes,
    List<CollocationResponse> collocations,
    List<ExampleResponse> examples
) {
}
