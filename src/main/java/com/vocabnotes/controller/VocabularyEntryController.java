
package com.vocabnotes.controller;

import com.vocabnotes.entity.VocabularyEntry;
import com.vocabnotes.service.VocabularyEntryService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyEntryController {

    private final VocabularyEntryService service;

    public VocabularyEntryController(
            VocabularyEntryService service) {
        this.service = service;
    }

    @GetMapping
    public List<VocabularyEntry> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public VocabularyEntry findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<VocabularyEntry> create(
            @RequestBody VocabularyEntry entry) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(entry));
    }

    @PutMapping("/{id}")
    public VocabularyEntry update(
            @PathVariable Long id,
            @RequestBody VocabularyEntry entry) {
        return service.update(id, entry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
