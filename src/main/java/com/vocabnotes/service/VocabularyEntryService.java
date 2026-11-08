package com.vocabnotes.service;

import com.vocabnotes.dto.*;
import com.vocabnotes.entity.*;
import com.vocabnotes.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class VocabularyEntryService {

    private final VocabularyEntryRepository vocabularyRepository;
    private final VocabularyCollocationRepository collocationRepository;
    private final VocabularyExampleRepository exampleRepository;

    public VocabularyEntryService(
            VocabularyEntryRepository vocabularyRepository,
            VocabularyCollocationRepository collocationRepository,
            VocabularyExampleRepository exampleRepository) {

        this.vocabularyRepository = vocabularyRepository;
        this.collocationRepository = collocationRepository;
        this.exampleRepository = exampleRepository;
    }

    // 查詢單字，可依語言篩選
    @Transactional(readOnly = true)
    public List<VocabularyResponse> getAll(String language) {

        List<VocabularyEntry> entries =
                language == null || language.isBlank()
                        ? vocabularyRepository.findAll()
                        : vocabularyRepository.findByLanguage(language);

        return entries.stream()
                .map(this::toResponse)
                .toList();
    }

    // 查詢單一單字
    @Transactional(readOnly = true)
    public VocabularyResponse getById(Long id) {
        VocabularyEntry entry = vocabularyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到這筆單字資料"));

        return toResponse(entry);
    }

    // 新增單字
    @Transactional
    public VocabularyResponse create(VocabularyRequest request) {

        VocabularyEntry entry = new VocabularyEntry();

        updateEntry(entry, request);

        VocabularyEntry savedEntry = vocabularyRepository.save(entry);

        saveChildren(savedEntry.getId(), request);

        return toResponse(savedEntry);
    }

    // 修改單字
    @Transactional
    public VocabularyResponse update(Long id, VocabularyRequest request) {

        VocabularyEntry entry = vocabularyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到這筆單字資料"));

        updateEntry(entry, request);

        VocabularyEntry savedEntry = vocabularyRepository.save(entry);

        // 先刪除原本的常見搭配和例句
        collocationRepository.deleteAllByVocabularyEntryId(id);
        exampleRepository.deleteAllByVocabularyEntryId(id);

        // 再儲存修改後的資料
        saveChildren(id, request);

        return toResponse(savedEntry);
    }

    // 批次新增：重複的單字跳過，單筆失敗不影響其他資料
    public VocabularyBatchResponse batchCreate(List<VocabularyRequest> requests) {

        int created = 0;
        List<String> skipped = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        for (VocabularyRequest request : requests) {

            try {
                if (request.term() == null || request.term().isBlank()) {
                    failed.add("（空白單字）");
                    continue;
                }

                if (vocabularyRepository.existsByLanguageAndTerm(
                        request.language(), request.term())) {
                    skipped.add(request.term());
                    continue;
                }

                create(request);
                created++;

            } catch (Exception exception) {
                failed.add(request.term() + "：" + exception.getMessage());
            }
        }

        return new VocabularyBatchResponse(created, skipped, failed);
    }

    // 刪除單字
    @Transactional
    public void delete(Long id) {

        if (!vocabularyRepository.existsById(id)) {
            throw new RuntimeException("找不到這筆單字資料");
        }

        vocabularyRepository.deleteById(id);
    }

    // 更新單字基本資料
    private void updateEntry(
            VocabularyEntry entry,
            VocabularyRequest request) {

        entry.setLanguage(request.language());
        entry.setTerm(request.term());
        entry.setChineseExplanation(request.chineseExplanation());
        entry.setPronunciation(request.pronunciation());

        // ["n.", "v."] 轉成 "n.,v."
        if (request.partOfSpeech() != null) {
            entry.setPartOfSpeech(
                    String.join(",", request.partOfSpeech())
            );
        }

        entry.setFrequencyRating(
                convertFrequency(request.frequencyLevel())
        );

        entry.setEtymology(request.etymology());
        entry.setUsageNotes(request.usageNotes());
    }

    // 儲存常見搭配與例句
    private void saveChildren(Long entryId, VocabularyRequest request) {

        if (request.collocations() != null) {
            for (int i = 0; i < request.collocations().size(); i++) {

                CollocationRequest item = request.collocations().get(i);

                VocabularyCollocation collocation =
                        new VocabularyCollocation();

                collocation.setVocabularyEntryId(entryId);
                collocation.setPhrase(item.phrase());
                collocation.setExplanation(item.explanation());
                collocation.setSortOrder(i);

                collocationRepository.save(collocation);
            }
        }

        if (request.examples() != null) {
            for (int i = 0; i < request.examples().size(); i++) {

                ExampleRequest item = request.examples().get(i);

                VocabularyExample example =
                        new VocabularyExample();

                example.setVocabularyEntryId(entryId);
                example.setSentence(item.sentence());
                example.setTranslation(item.translation());
                example.setSortOrder(i);

                exampleRepository.save(example);
            }
        }
    }

    // Entity 轉換成前端需要的 Response
    private VocabularyResponse toResponse(VocabularyEntry entry) {

        List<String> partOfSpeech =
                entry.getPartOfSpeech() == null ||
                entry.getPartOfSpeech().isBlank()
                ? List.of()
                : List.of(entry.getPartOfSpeech().split(","));

        List<CollocationResponse> collocations =
                collocationRepository
                        .findByVocabularyEntryIdOrderBySortOrderAsc(entry.getId())
                        .stream()
                        .map(item -> new CollocationResponse(
                                item.getId(),
                                item.getPhrase(),
                                item.getExplanation()
                        ))
                        .toList();

        List<ExampleResponse> examples =
                exampleRepository
                        .findByVocabularyEntryIdOrderBySortOrderAsc(entry.getId())
                        .stream()
                        .map(item -> new ExampleResponse(
                                item.getId(),
                                item.getSentence(),
                                item.getTranslation()
                        ))
                        .toList();

        return new VocabularyResponse(
                entry.getId(),
                entry.getLanguage(),
                entry.getTerm(),
                entry.getChineseExplanation(),
                entry.getPronunciation(),
                partOfSpeech,
                convertFrequencyToLabel(entry.getFrequencyRating()),
                entry.getEtymology(),
                entry.getUsageNotes(),
                collocations,
                examples
        );
    }

    // 日文頻率分類轉換成資料庫數字
    private Byte convertFrequency(String level) {

        if (level == null || level.isBlank()) {
            return null;
        }

        return switch (level) {
            case "あまり使わない" -> (byte) 2;
            case "そこそこ使う" -> (byte) 4;
            case "よく使う" -> (byte) 7;
            case "非常によく使う" -> (byte) 9;
            default -> throw new IllegalArgumentException("不正確的頻率分類");
        };
    }

    // 資料庫數字轉換成日文頻率分類
    private String convertFrequencyToLabel(Byte rating) {

        if (rating == null) {
            return null;
        }

        if (rating <= 2) return "あまり使わない";
        if (rating <= 5) return "そこそこ使う";
        if (rating <= 8) return "よく使う";
        return "非常によく使う";
    }
}
