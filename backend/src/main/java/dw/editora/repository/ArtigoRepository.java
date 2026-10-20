package dw.editora.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import dw.editora.entity.Artigo;

public interface ArtigoRepository extends JpaRepository<Artigo, Long> {

    List<Artigo> findByPublicado(boolean publicado);

    List<Artigo> findByTituloContainingIgnoreCase(String titulo);

    List<Artigo> findByAutorId(Long autorId);

    boolean existsByAutorId(Long autorId);
}
