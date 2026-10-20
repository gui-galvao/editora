import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import { iniciarApiFalsa } from "./apiFalsa";

let api;
let App;
const usuario = userEvent.setup();

function abrirPagina(rota) {
  window.history.pushState({}, "", rota);
  render(<App />);
}

beforeAll(async () => {
  api = await iniciarApiFalsa();
  vi.stubEnv("VITE_API_URL", api.url);
  App = (await import("../App")).default;
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

afterAll(() => api.encerrar());

describe("Autores e artigos pela interface", () => {
  it("mostra a lista de autores vazia", async () => {
    abrirPagina("/autores");
    expect(await screen.findByText("Nenhum autor encontrado.")).toBeInTheDocument();
  });

  it("avisa e bloqueia o envio de artigo quando não há autores", async () => {
    abrirPagina("/artigos/novo");
    expect(await screen.findByText(/Nenhum autor cadastrado/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
  });

  it("cadastra um autor", async () => {
    abrirPagina("/autores/novo");
    await usuario.type(screen.getByLabelText("Nome"), "Maria");
    await usuario.type(screen.getByLabelText("E-mail"), "maria@email.com");
    await usuario.type(screen.getByLabelText(/Biografia/), "Escritora de teste");
    await usuario.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("O autor foi cadastrado com sucesso!")).toBeInTheDocument();
    expect(api.banco.autores).toHaveLength(1);
    expect(api.banco.autores[0].biografia).toBe("Escritora de teste");
  });

  it("mostra erro ao cadastrar e-mail repetido", async () => {
    abrirPagina("/autores/novo");
    await usuario.type(screen.getByLabelText("Nome"), "Outra Maria");
    await usuario.type(screen.getByLabelText("E-mail"), "maria@email.com");
    await usuario.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Já existe um autor com este e-mail.")).toBeInTheDocument();
    expect(api.banco.autores).toHaveLength(1);
  });

  it("mostra erro ao cadastrar autor sem nome", async () => {
    abrirPagina("/autores/novo");
    await usuario.type(screen.getByLabelText("E-mail"), "sem.nome@email.com");
    await usuario.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Nome e e-mail são obrigatórios.")).toBeInTheDocument();
  });

  it("não envia artigo com título e resumo vazios", async () => {
    abrirPagina("/artigos/novo");
    await screen.findByRole("option", { name: "Maria" });
    await usuario.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Preencha o título e o resumo.")).toBeInTheDocument();
    expect(api.banco.artigos).toHaveLength(0);
  });

  it("não envia artigo sem escolher o autor", async () => {
    abrirPagina("/artigos/novo");
    await screen.findByRole("option", { name: "Maria" });
    await usuario.type(screen.getByLabelText("Título"), "Meu primeiro artigo");
    await usuario.type(screen.getByLabelText("Resumo"), "Resumo do artigo");
    await usuario.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Selecione o autor do artigo.")).toBeInTheDocument();
    expect(api.banco.artigos).toHaveLength(0);
  });

  it("cria um artigo escolhendo o autor e envia o id dele", async () => {
    abrirPagina("/artigos/novo");
    await screen.findByRole("option", { name: "Maria" });
    await usuario.type(screen.getByLabelText("Título"), "Meu primeiro artigo");
    await usuario.type(screen.getByLabelText("Resumo"), "Resumo do artigo");
    await usuario.selectOptions(screen.getByLabelText("Autor"), "Maria");
    await usuario.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("O artigo foi enviado com sucesso!")).toBeInTheDocument();

    const envio = api.banco.requisicoes.find(r => r.metodo === "POST" && r.caminho === "/artigos");
    expect(envio.corpo.autor).toEqual({ id: 1 });
    expect(api.banco.artigos[0].autor.nome).toBe("Maria");
  });

  it("mostra o autor nos detalhes do artigo", async () => {
    abrirPagina("/artigos");
    await usuario.click(await screen.findByText("Meu primeiro artigo", { selector: "li" }));

    expect(await screen.findByText("Maria")).toBeInTheDocument();
  });

  it("avisa quando a busca por título não encontra nada", async () => {
    abrirPagina("/artigos");
    await screen.findByText("Meu primeiro artigo", { selector: "li" });
    await usuario.type(screen.getByPlaceholderText("Buscar por título"), "zzz");
    await usuario.click(screen.getByRole("button", { name: "Buscar" }));

    expect(await screen.findByText("Nenhum artigo encontrado.")).toBeInTheDocument();
  });

  it("edita o título do artigo e troca o status de publicação", async () => {
    abrirPagina("/artigos/1");
    const campoTitulo = await screen.findByLabelText("Título");
    expect(screen.getByText("Maria")).toBeInTheDocument();

    await usuario.clear(campoTitulo);
    await usuario.type(campoTitulo, "Título revisado");
    await usuario.click(screen.getByRole("button", { name: "Atualizar" }));
    expect(await screen.findByText("Artigo atualizado com sucesso!")).toBeInTheDocument();
    expect(api.banco.artigos[0].titulo).toBe("Título revisado");

    await usuario.click(screen.getByRole("button", { name: "Marcar como não publicado" }));
    expect(await screen.findByText("Status atualizado com sucesso!")).toBeInTheDocument();
    expect(api.banco.artigos[0].publicado).toBe(false);
  });

  it("mostra erro ao salvar artigo com título vazio", async () => {
    abrirPagina("/artigos/1");
    await usuario.clear(await screen.findByLabelText("Título"));
    await usuario.click(screen.getByRole("button", { name: "Atualizar" }));

    expect(await screen.findByText(/são obrigatórios/)).toBeInTheDocument();
    expect(api.banco.artigos[0].titulo).toBe("Título revisado");
  });

  it("mostra os artigos do autor na tela de autores", async () => {
    abrirPagina("/autores");
    await usuario.click(await screen.findByText("Maria", { selector: "li" }));

    expect(await screen.findByRole("link", { name: "Título revisado" })).toBeInTheDocument();
  });

  it("não deixa excluir um autor que possui artigos", async () => {
    abrirPagina("/autores");
    await usuario.click(await screen.findByText("Maria", { selector: "li" }));
    await screen.findByRole("link", { name: "Título revisado" });
    await usuario.click(screen.getByRole("button", { name: "Excluir autor" }));

    expect(await screen.findByText("Não é possível excluir um autor que possui artigos.")).toBeInTheDocument();
    expect(api.banco.autores).toHaveLength(1);
  });

  it("exclui o artigo pela tela de edição e volta para a lista", async () => {
    abrirPagina("/artigos/1");
    await usuario.click(await screen.findByRole("button", { name: "Excluir" }));

    expect(await screen.findByText("Nenhum artigo encontrado.")).toBeInTheDocument();
    expect(api.banco.artigos).toHaveLength(0);
  });

  it("exclui o autor depois que ele ficou sem artigos", async () => {
    abrirPagina("/autores");
    await usuario.click(await screen.findByText("Maria", { selector: "li" }));
    expect(await screen.findByText("Este autor ainda não tem artigos.")).toBeInTheDocument();
    await usuario.click(screen.getByRole("button", { name: "Excluir autor" }));

    expect(await screen.findByText("Nenhum autor encontrado.")).toBeInTheDocument();
    expect(api.banco.autores).toHaveLength(0);
  });
});
