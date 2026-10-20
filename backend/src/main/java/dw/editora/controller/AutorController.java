package dw.editora.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dw.editora.entity.Artigo;
import dw.editora.entity.Autor;
import dw.editora.exception.ConflitoException;
import dw.editora.exception.DadosInvalidosException;
import dw.editora.service.ArtigoService;
import dw.editora.service.AutorService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/autores")
public class AutorController {

    private final AutorService autorService;
    private final ArtigoService artigoService;

    public AutorController(AutorService autorService, ArtigoService artigoService) {
        this.autorService = autorService;
        this.artigoService = artigoService;
    }

    @PostMapping
    public ResponseEntity<Autor> cadastrar(@RequestBody Autor autor) {
        try {
            Autor autorSalvo = autorService.salvar(autor);
            return ResponseEntity.status(HttpStatus.CREATED).body(autorSalvo);
        } catch (DadosInvalidosException erro) {
            return ResponseEntity.badRequest().build();
        } catch (ConflitoException erro) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Autor>> listar() {
        try {
            List<Autor> autores = autorService.listar();
            if (autores.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(autores);
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Autor> buscarPorId(@PathVariable Long id) {
        return autorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/artigos")
    public ResponseEntity<List<Artigo>> listarArtigosDoAutor(@PathVariable Long id) {
        try {
            if (autorService.buscarPorId(id).isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            List<Artigo> artigos = artigoService.listarPorAutor(id);
            if (artigos.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(artigos);
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        try {
            if (autorService.deletar(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (ConflitoException erro) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception erro) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
