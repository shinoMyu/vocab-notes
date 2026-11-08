package com.vocabnotes.repository;

import com.vocabnotes.entity.VocabularyEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VocabularyEntryRepository
        extends JpaRepository<VocabularyEntry, Long> {

    List<VocabularyEntry> findByLanguage(String language);

    boolean existsByLanguageAndTerm(String language, String term);
}
