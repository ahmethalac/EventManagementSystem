package yte.intern.etkinlikYonetimSistemi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import yte.intern.etkinlikYonetimSistemi.entities.Applicant;
import yte.intern.etkinlikYonetimSistemi.entities.Event;

import java.util.List;

public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    List<Applicant> getAllByEvent(Event event);
    Applicant getByUuid(String uuid);
    @Query(value = "select * from applicant where event_id = ?1 and attended order by random() limit 1", nativeQuery = true)
    Applicant getRandomParticipant(Long id);
}
