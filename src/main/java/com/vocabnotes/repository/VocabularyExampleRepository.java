package com.vocabnotes.repository;

import com.vocabnotes.entity.VocabularyExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VocabularyExampleRepository
        extends JpaRepository<VocabularyExample, Long> {

    List<VocabularyExample> findByVocabularyEntryIdOrderBySortOrderAsc(Long vocabularyEntryId);

    @Modifying
    @Query("DELETE FROM VocabularyExample e WHERE e.vocabularyEntryId = :entryId")
    void deleteAllByVocabularyEntryId(@Param("entryId") Long entryId);
}
