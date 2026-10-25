package com.vocabnotes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Table(
    name = "tag",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_tag_name_category",
            columnNames = {"name", "category"}
        )
    }
)
@Getter 
@Setter 
@NoArgsConstructor 
public class Tag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 30)
    private String category;
}
