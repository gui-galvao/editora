package dw.editora.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import dw.editora.entity.Artigo;
import dw.editora.entity.Autor;
import dw.editora.service.ArtigoService;
import dw.editora.service.AutorService;

@Component
public class DadosDeExemplo implements ApplicationRunner {

    private static final String TEXTO_EXEMPLO = "Texto de exemplo. Teste, teste, teste. Bla bla bla. Bla bla bla bla.";

    private final AutorService autorService;
    private final ArtigoService artigoService;
    private final boolean ativo;

    public DadosDeExemplo(AutorService autorService,
                          ArtigoService artigoService,
                          @Value("${editora.dados-exemplo:true}") boolean ativo) {
        this.autorService = autorService;
        this.artigoService = artigoService;
        this.ativo = ativo;
    }

    @Override
    public void run(ApplicationArguments argumentos) {
        if (!ativo || !autorService.listar().isEmpty()) {
            return;
        }

        Autor guilherme = cadastrarAutor("Guilherme", "guilhermedominguesgalvao@gmail.com", "Autor de exemplo. Teste, bla bla bla.");
        Autor maria = cadastrarAutor("Maria Teste", "maria.teste@exemplo.com", "Autora de exemplo. Bla bla bla, teste.");
        cadastrarAutor("Ana Exemplo", "ana.exemplo@exemplo.com", "Autora de exemplo sem artigos. Teste.");

        cadastrarArtigo("Artigo de exemplo 1", guilherme);
        cadastrarArtigo("Artigo de exemplo 2", guilherme);
        cadastrarArtigo("Teste de artigo da Maria", maria);
        cadastrarArtigo("Bla bla bla: outro artigo de exemplo", maria);
    }

    private Autor cadastrarAutor(String nome, String email, String biografia) {
        Autor autor = new Autor();
        autor.setNome(nome);
        autor.setEmail(email);
        autor.setBiografia(biografia);
        return autorService.salvar(autor);
    }

    private void cadastrarArtigo(String titulo, Autor autor) {
        Artigo artigo = new Artigo();
        artigo.setTitulo(titulo);
        artigo.setResumo(TEXTO_EXEMPLO);
        artigo.setAutor(autor);
        artigoService.salvar(artigo);
    }
}
