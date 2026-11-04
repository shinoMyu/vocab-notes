
package com.vocabnotes.controller;

import com.vocabnotes.dto.VocabularyRequest;
import com.vocabnotes.dto.VocabularyResponse;
import com.vocabnotes.service.VocabularyEntryService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary")
@CrossOrigin(origins = "http://localhost:5173")
public class VocabularyEntryController {

    private final VocabularyEntryService vocabularyService;

    public VocabularyEntryController(
            VocabularyEntryService vocabularyService) {
        this.vocabularyService = vocabularyService;
    }

    // 查詢單字，可依語言篩選
    @GetMapping
    public List<VocabularyResponse> getAll(
            @RequestParam(required = false) String language) {
        return vocabularyService.getAll(language);
    }

    // 查詢單一單字
    @GetMapping("/{id}")
    public VocabularyResponse getById(@PathVariable Long id) {
        return vocabularyService.getById(id);
    }

    // 新增單字
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VocabularyResponse create(
            @RequestBody VocabularyRequest request) {
        return vocabularyService.create(request);
    }

    // 修改單字
    @PutMapping("/{id}")
    public VocabularyResponse update(
            @PathVariable Long id,
            @RequestBody VocabularyRequest request) {
        return vocabularyService.update(id, request);
    }

    // 刪除單字
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        vocabularyService.delete(id);
    }
}
