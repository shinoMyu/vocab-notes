package com.vocabnotes.dto;

public record ExampleResponse(
    Long id,
    String sentence,
    String translation
) {
}
