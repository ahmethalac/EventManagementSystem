package yte.intern.etkinlikYonetimSistemi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import yte.intern.etkinlikYonetimSistemi.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
