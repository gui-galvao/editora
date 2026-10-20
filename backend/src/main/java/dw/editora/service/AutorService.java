package dw.editora.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dw.editora.entity.Autor;
import dw.editora.exception.ConflitoException;
import dw.editora.exception.DadosInvalidosException;
import dw.editora.repository.ArtigoRepository;
import dw.editora.repository.AutorRepository;

@Service
public class AutorService {

    private final AutorRepository autorRepository;
    private final ArtigoRepository artigoRepository;

    public AutorService(AutorRepository autorRepository, ArtigoRepository artigoRepository) {
        this.autorRepository = autorRepository;
        this.artigoRepository = artigoRepository;
    }

    public List<Autor> listar() {
        return autorRepository.findAll();
    }

    public Optional<Autor> buscarPorId(Long id) {
        return autorRepository.findById(id);
    }

    public Autor salvar(Autor autor) {
        if (autor.getNome() == null || autor.getNome().isBlank()) {
            throw new DadosInvalidosException("O nome do autor é obrigatório");
        }
        if (autor.getEmail() == null || autor.getEmail().isBlank()) {
            throw new DadosInvalidosException("O e-mail do autor é obrigatório");
        }

        autor.setNome(autor.getNome().trim());
        autor.setEmail(autor.getEmail().trim());

        if (autorRepository.existsByEmail(autor.getEmail())) {
            throw new ConflitoException("Já existe um autor com este e-mail");
        }

        autor.setId(null);
        return autorRepository.save(autor);
    }

    public boolean deletar(Long id) {
        if (!autorRepository.existsById(id)) {
            return false;
        }
        if (artigoRepository.existsByAutorId(id)) {
            throw new ConflitoException("Não é possível excluir um autor que possui artigos");
        }
        autorRepository.deleteById(id);
        return true;
    }
}
