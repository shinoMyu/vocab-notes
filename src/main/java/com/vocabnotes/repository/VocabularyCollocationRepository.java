package com.vocabnotes.repository;

import com.vocabnotes.entity.VocabularyCollocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VocabularyCollocationRepository
        extends JpaRepository<VocabularyCollocation, Long> {

    List<VocabularyCollocation> findByVocabularyEntryIdOrderBySortOrderAsc(Long vocabularyEntryId);

    @Modifying
    @Query("DELETE FROM VocabularyCollocation c WHERE c.vocabularyEntryId = :entryId")
    void deleteAllByVocabularyEntryId(@Param("entryId") Long entryId);
}
