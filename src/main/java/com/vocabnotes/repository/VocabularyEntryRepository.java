package com.vocabnotes.repository;

import com.vocabnotes.entity.VocabularyEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VocabularyEntryRepository
        extends JpaRepository<VocabularyEntry, Long> {
}
