
package com.vocabnotes.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "knowledge_relation",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_knowledge_relation",
            columnNames = {
                "source_type",
                "source_id",
                "target_type",
                "target_id",
                "relation_type"
            }
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class KnowledgeRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_type", nullable = false, length = 30)
    private String sourceType;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(name = "target_type", nullable = false, length = 30)
    private String targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "relation_type", nullable = false, length = 30)
    private String relationType;

    @Column(name = "similarity_score")
    private Double similarityScore;

    @Column(name = "is_confirmed", nullable = false)
    private boolean isConfirmed = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
