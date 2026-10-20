package dw.editora.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dw.editora.entity.Artigo;
import dw.editora.exception.DadosInvalidosException;
import dw.editora.exception.RecursoNaoEncontradoException;
import dw.editora.service.ArtigoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/artigos")
public class ArtigoController {

    private final ArtigoService artigoService;

    public ArtigoController(ArtigoService artigoService) {
        this.artigoService = artigoService;
    }

    @GetMapping
    public ResponseEntity<List<Artigo>> listar(@RequestParam(required = false) String titulo) {
        try {
            List<Artigo> artigos = artigoService.listarArtigos(titulo);
            if (artigos.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(artigos);
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artigo> buscarPorId(@PathVariable Long id) {
        return artigoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Artigo> criar(@RequestBody Artigo artigo) {
        try {
            Artigo artigoSalvo = artigoService.salvar(artigo);
            return ResponseEntity.status(HttpStatus.CREATED).body(artigoSalvo);
        } catch (DadosInvalidosException erro) {
            return ResponseEntity.badRequest().build();
        } catch (RecursoNaoEncontradoException erro) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artigo> atualizar(@PathVariable Long id, @RequestBody Artigo artigo) {
        try {
            return artigoService.atualizar(id, artigo)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (DadosInvalidosException erro) {
            return ResponseEntity.badRequest().build();
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        try {
            if (artigoService.deletar(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> excluirTodos() {
        try {
            artigoService.deletarTodos();
            return ResponseEntity.noContent().build();
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/publicados")
    public ResponseEntity<List<Artigo>> listarPublicados() {
        try {
            List<Artigo> artigos = artigoService.listarPublicados();
            if (artigos.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(artigos);
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
