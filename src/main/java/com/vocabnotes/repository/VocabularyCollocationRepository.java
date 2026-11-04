package com.vocabnotes.repository;

import com.vocabnotes.entity.VocabularyCollocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VocabularyCollocationRepository
        extends JpaRepository<VocabularyCollocation, Long> {

    List<VocabularyCollocation> findByVocabularyEntryIdOrderBySortOrderAsc(Long vocabularyEntryId);

    void deleteByVocabularyEntryId(Long vocabularyEntryId);
}
