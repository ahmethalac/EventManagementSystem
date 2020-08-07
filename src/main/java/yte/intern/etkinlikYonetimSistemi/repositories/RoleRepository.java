package yte.intern.etkinlikYonetimSistemi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import yte.intern.etkinlikYonetimSistemi.entities.ERole;
import yte.intern.etkinlikYonetimSistemi.entities.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}

