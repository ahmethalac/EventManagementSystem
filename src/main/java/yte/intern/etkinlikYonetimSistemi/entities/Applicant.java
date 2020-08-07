package yte.intern.etkinlikYonetimSistemi.entities;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@SequenceGenerator(name = "idgen", sequenceName = "APPLICANT_SEQ")
public class Applicant extends BaseEntity{

    private String uuid;

    @Column(name = "NAME_SURNAME")
    private String nameSurname;

    @Column(name = "TC_KIMLIK_NO")
    private String tcKimlikNo;

    @Column(name = "EMAIL")
    private String email;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "applicant_id")
    private Set<Answer> answers;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "ATTENDED")
    private boolean attended;
}
