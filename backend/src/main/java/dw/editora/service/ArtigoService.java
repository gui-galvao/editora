package dw.editora.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dw.editora.entity.Artigo;
import dw.editora.entity.Autor;
import dw.editora.exception.DadosInvalidosException;
import dw.editora.exception.RecursoNaoEncontradoException;
import dw.editora.repository.ArtigoRepository;

@Service
public class ArtigoService {

    private static final int TAMANHO_MAXIMO_TITULO = 80;

    private final ArtigoRepository artigoRepository;
    private final AutorService autorService;

    public ArtigoService(ArtigoRepository artigoRepository, AutorService autorService) {
        this.artigoRepository = artigoRepository;
        this.autorService = autorService;
    }

    public List<Artigo> listarArtigos(String titulo) {
        if (titulo == null || titulo.isBlank()) {
            return artigoRepository.findAll();
        }
        return artigoRepository.findByTituloContainingIgnoreCase(titulo);
    }

    public Optional<Artigo> buscarPorId(Long id) {
        return artigoRepository.findById(id);
    }

    public Artigo salvar(Artigo artigo) {
        validarTituloEResumo(artigo);

        if (artigo.getAutor() == null || artigo.getAutor().getId() == null) {
            throw new DadosInvalidosException("O artigo precisa informar o autor (autor.id)");
        }

        Autor autor = autorService.buscarPorId(artigo.getAutor().getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Autor não encontrado"));

        artigo.setId(null);
        artigo.setAutor(autor);
        return artigoRepository.save(artigo);
    }

    public Optional<Artigo> atualizar(Long id, Artigo dadosNovos) {
        validarTituloEResumo(dadosNovos);

        return artigoRepository.findById(id).map(artigo -> {
            artigo.setTitulo(dadosNovos.getTitulo());
            artigo.setResumo(dadosNovos.getResumo());
            artigo.setPublicado(dadosNovos.isPublicado());
            return artigoRepository.save(artigo);
        });
    }

    public boolean deletar(Long id) {
        if (artigoRepository.existsById(id)) {
            artigoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void deletarTodos() {
        artigoRepository.deleteAll();
    }

    public List<Artigo> listarPublicados() {
        return artigoRepository.findByPublicado(true);
    }

    public List<Artigo> listarPorAutor(Long autorId) {
        return artigoRepository.findByAutorId(autorId);
    }

    private void validarTituloEResumo(Artigo artigo) {
        if (artigo.getTitulo() == null || artigo.getTitulo().isBlank()) {
            throw new DadosInvalidosException("O título é obrigatório");
        }
        if (artigo.getTitulo().length() > TAMANHO_MAXIMO_TITULO) {
            throw new DadosInvalidosException("O título pode ter no máximo " + TAMANHO_MAXIMO_TITULO + " caracteres");
        }
        if (artigo.getResumo() == null || artigo.getResumo().isBlank()) {
            throw new DadosInvalidosException("O resumo é obrigatório");
        }
    }
}
