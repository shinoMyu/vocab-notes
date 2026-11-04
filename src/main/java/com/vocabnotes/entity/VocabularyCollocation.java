package com.vocabnotes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity 
@Table(
    name = "vocabulary_collocation",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_vocabulary_collocation",
            columnNames = {"vocabulary_entry_id", "phrase"}
        )
    }
)
@Getter 
@Setter 
@NoArgsConstructor 
public class VocabularyCollocation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vocabulary_entry_id", nullable = false)
    private Long vocabularyEntryId;

    @Column(nullable = false, length = 255)
    private String phrase;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
