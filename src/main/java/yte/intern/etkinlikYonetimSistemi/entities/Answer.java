package yte.intern.etkinlikYonetimSistemi.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import yte.intern.etkinlikYonetimSistemi.serializers.AnswerSerializer;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotBlank;

@Entity
@Getter
@Setter
@ToString
@SequenceGenerator(name = "idgen", sequenceName = "ANSWER_SEQ")
@JsonSerialize(using = AnswerSerializer.class)
public class Answer extends ExtraField {

    private String answer;

}
