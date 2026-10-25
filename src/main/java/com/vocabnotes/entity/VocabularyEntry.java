package com.vocabnotes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "vocabulary_entry",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_vocab_language_term",
            columnNames = {"language", "term"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class VocabularyEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String language;

    @Column(nullable = false, length = 200)
    private String term;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String chineseExplanation;

    @Column(length = 200)
    private String pronunciation;

    @Column(name = "frequency_rating")
    private Byte frequencyRating;

    @Column(columnDefinition = "TEXT")
    private String etymology;

    @Column(columnDefinition = "TEXT")
    private String collocations;

    @Column(columnDefinition = "TEXT")
    private String exampleSentence;

    @Column(columnDefinition = "TEXT")
    private String exampleTranslation;

    @Column(columnDefinition = "TEXT")
    private String usageNotes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
