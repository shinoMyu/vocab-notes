package com.vocabnotes.dto;

import java.util.List;

public record VocabularyBatchResponse(
        int created,
        List<String> skipped,
        List<String> failed
) {}
