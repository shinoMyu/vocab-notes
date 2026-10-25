package com.vocabnotes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Table(
    name = "note_tag",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_note_tag",
            columnNames = {"note_id", "tag_id"}
        ),
        @UniqueConstraint(
            name = "uk_vocabulary_tag",
            columnNames = {"vocabulary_entry_id", "tag_id"}
        )
    }
)
@Getter 
@Setter 
@NoArgsConstructor 
public class NoteTag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "note_id")
    private Long noteId;
    
    @Column(name = "vocabulary_entry_id")
    private Long vocabularyEntryId;

    @Column(name = "tag_id", nullable = false)
    private Long tagId;
}
