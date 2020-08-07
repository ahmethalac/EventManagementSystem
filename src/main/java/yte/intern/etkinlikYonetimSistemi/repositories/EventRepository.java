package yte.intern.etkinlikYonetimSistemi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import yte.intern.etkinlikYonetimSistemi.entities.Event;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, Long> {
    Event findByUuid(String uuid);
    @Transactional
    void deleteByUuid(String uuid);
    Event getByUuid(String uuid);
    List<Event> findByEndDateGreaterThanEqual(LocalDate date);
}
