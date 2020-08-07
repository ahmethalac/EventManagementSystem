package yte.intern.etkinlikYonetimSistemi.dtos;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import yte.intern.etkinlikYonetimSistemi.entities.Answer;
import yte.intern.etkinlikYonetimSistemi.validators.TcKimlikNo;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.Set;

@Getter
@Setter
@ToString
public class ApplicantDTO {

    private String uuid;

    @NotBlank(message = "İsim soyisim boş olamaz")
    private String nameSurname;

    @TcKimlikNo
    private String tcKimlikNo;

    @Email(message = "Email geçerli değil")
    @NotBlank(message = "Email geçerli değil")
    private String email;

    private Set<Answer> answers;

    private boolean attended;
}
