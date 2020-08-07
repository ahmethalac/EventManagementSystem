package yte.intern.etkinlikYonetimSistemi.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "roles")
@SequenceGenerator(name = "idgen", sequenceName = "ROLE_SEQ")
public class Role extends BaseEntity{
    @Enumerated(EnumType.STRING)
    private ERole name;
}
