
package com.vocabnotes.service;

import com.vocabnotes.entity.VocabularyEntry;
import com.vocabnotes.repository.VocabularyEntryRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class VocabularyEntryService {

    private final VocabularyEntryRepository repository;

    public VocabularyEntryService(
            VocabularyEntryRepository repository) {
        this.repository = repository;
    }

    public List<VocabularyEntry> findAll() {
        return repository.findAll();
    }

    public VocabularyEntry findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "找不到這筆單字"));
    }

    public VocabularyEntry create(VocabularyEntry entry) {
        entry.setId(null);
        return repository.save(entry);
    }

    public VocabularyEntry update(
            Long id, VocabularyEntry request) {

        VocabularyEntry entry = findById(id);

        entry.setLanguage(request.getLanguage());
        entry.setTerm(request.getTerm());
        entry.setChineseExplanation(
                request.getChineseExplanation());
        entry.setPronunciation(request.getPronunciation());
        entry.setFrequencyRating(request.getFrequencyRating());
        entry.setEtymology(request.getEtymology());
        entry.setCollocations(request.getCollocations());
        entry.setExampleSentence(request.getExampleSentence());
        entry.setExampleTranslation(request.getExampleTranslation());
        entry.setUsageNotes(request.getUsageNotes());

        return repository.save(entry);
    }

    public void delete(Long id) {
        VocabularyEntry entry = findById(id);
        repository.delete(entry);
    }
}