package yte.intern.etkinlikYonetimSistemi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import yte.intern.etkinlikYonetimSistemi.entities.ExtraField;

public interface ExtraFieldRepository extends JpaRepository<ExtraField, Long> {

}
