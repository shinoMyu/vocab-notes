package com.vocabnotes.repository;

import com.vocabnotes.entity.VocabularyExample;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VocabularyExampleRepository
        extends JpaRepository<VocabularyExample, Long> {

    List<VocabularyExample> findByVocabularyEntryIdOrderBySortOrderAsc(Long vocabularyEntryId);

    void deleteByVocabularyEntryId(Long vocabularyEntryId);
}
