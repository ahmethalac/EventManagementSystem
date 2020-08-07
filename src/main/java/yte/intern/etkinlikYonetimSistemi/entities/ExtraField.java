package yte.intern.etkinlikYonetimSistemi.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;
import yte.intern.etkinlikYonetimSistemi.serializers.ExtraFieldJsonSerializer;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonSerialize(using = ExtraFieldJsonSerializer.class)
@SequenceGenerator(name = "idgen", sequenceName = "EXTRA_FIELD_SEQ")
public class ExtraField{

    @Id
    @GeneratedValue
    private Long id;

    private String question;

    public ExtraField(String question){
        this.question = question;
    }
}
