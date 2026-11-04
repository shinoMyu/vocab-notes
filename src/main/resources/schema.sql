-- 1. 單字詞條
CREATE TABLE vocabulary_entry (
	id BIGINT NOT NULL AUTO_INCREMENT,
    language VARCHAR(10) NOT NULL,
    term VARCHAR(200) NOT NULL,
    chinese_explanation TEXT NOT NULL,
    pronunciation VARCHAR(200),
    part_of_speech VARCHAR(100),
    frequency_rating TINYINT,
    etymology TEXT,
    usage_notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
		ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uk_vocab_language_term
        UNIQUE (language, term),
    CONSTRAINT chk_vocab_language
        CHECK (language IN ('en', 'ja')),
    CONSTRAINT chk_vocab_frequency
        CHECK (
            frequency_rating IS NULL
            OR frequency_rating BETWEEN 1 AND 10
        )
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
  
  -- 2. 單字搭配
CREATE TABLE vocabulary_collocation (
    id BIGINT NOT NULL AUTO_INCREMENT,
    vocabulary_entry_id BIGINT NOT NULL,
    phrase VARCHAR(255) NOT NULL,
    explanation TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT fk_collocation_vocabulary
        FOREIGN KEY (vocabulary_entry_id)
        REFERENCES vocabulary_entry(id)
        ON DELETE CASCADE,
    CONSTRAINT uk_vocabulary_collocation
        UNIQUE (vocabulary_entry_id, phrase),
    INDEX idx_collocation_vocabulary
        (vocabulary_entry_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- 3. 單字例句
CREATE TABLE vocabulary_example (
    id BIGINT NOT NULL AUTO_INCREMENT,
    vocabulary_entry_id BIGINT NOT NULL,
    sentence TEXT NOT NULL,
    translation TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT fk_example_vocabulary
        FOREIGN KEY (vocabulary_entry_id)
        REFERENCES vocabulary_entry(id)
        ON DELETE CASCADE,
    INDEX idx_example_vocabulary
        (vocabulary_entry_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 4. 知識筆記：文法、程式、技術共用
CREATE TABLE knowledge_note (
	id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    note_type VARCHAR(30) NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
        
	PRIMARY KEY (id),
    CONSTRAINT chk_note_type
        CHECK (
            note_type IN (
                'GRAMMAR',
                'PROGRAMMING',
                'TECHNOLOGY'
            )
        )
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 5. 標籤
CREATE TABLE tag (
	id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT uk_tag_name_category
        UNIQUE (name, category)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 6. 標籤關聯
CREATE TABLE note_tag (
	id BIGINT NOT NULL AUTO_INCREMENT,
    note_id BIGINT NULL,
    vocabulary_entry_id BIGINT NULL,
    tag_id BIGINT NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_note_tag_note
        FOREIGN KEY (note_id)
        REFERENCES knowledge_note(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_note_tag_vocabulary
        FOREIGN KEY (vocabulary_entry_id)
        REFERENCES vocabulary_entry(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_note_tag_tag
        FOREIGN KEY (tag_id)
        REFERENCES tag(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_note_tag_target
        CHECK (
            (note_id IS NOT NULL AND vocabulary_entry_id IS NULL)
            OR
            (note_id IS NULL AND vocabulary_entry_id IS NOT NULL)
        ),

    CONSTRAINT uk_note_tag_note
        UNIQUE (note_id, tag_id),

    CONSTRAINT uk_note_tag_vocabulary
        UNIQUE (vocabulary_entry_id, tag_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 7. 知識關聯
CREATE TABLE knowledge_relation (
	id BIGINT NOT NULL AUTO_INCREMENT,
    source_type VARCHAR(30) NOT NULL,
    source_id BIGINT NOT NULL,
    target_type VARCHAR(30) NOT NULL,
    target_id BIGINT NOT NULL,
    relation_type VARCHAR(30) NOT NULL,
    similarity_score DOUBLE NULL,
    is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT chk_relation_source_type
        CHECK (source_type IN ('VOCABULARY', 'NOTE')),

    CONSTRAINT chk_relation_target_type
        CHECK (target_type IN ('VOCABULARY', 'NOTE')),

    CONSTRAINT chk_relation_type
        CHECK (
            relation_type IN (
                'TRANSLATION',
                'RELATED',
                'REFERENCES'
            )
        ),

    CONSTRAINT chk_relation_similarity
        CHECK (
            similarity_score IS NULL
            OR similarity_score BETWEEN -1 AND 1
        ),

    CONSTRAINT chk_relation_not_self
        CHECK (
            source_type <> target_type
            OR source_id <> target_id
        ),

    CONSTRAINT uk_knowledge_relation
        UNIQUE (
            source_type,
            source_id,
            target_type,
            target_id,
            relation_type
        ),

    INDEX idx_relation_source
        (source_type, source_id),

    INDEX idx_relation_target
        (target_type, target_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;