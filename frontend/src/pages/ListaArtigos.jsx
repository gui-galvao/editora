import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import artigoService from "../services/artigoService";

function ListaArtigos() {
  const [artigos, setArtigos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");

  function carregarArtigos(titulo) {
    artigoService
      .listar(titulo)
      .then(resposta => setArtigos(resposta.data || []))
      .catch(erro => console.error("Não foi possível carregar os artigos:", erro));
  }

  useEffect(() => {
    carregarArtigos();
  }, []);

  function buscar() {
    setSelecionado(null);
    carregarArtigos(termoBusca);
  }

  function excluirTodos() {
    if (!window.confirm("Tem certeza que deseja excluir todos os artigos?")) {
      return;
    }
    artigoService
      .excluirTodos()
      .then(() => {
        setSelecionado(null);
        carregarArtigos();
      })
      .catch(erro => console.error("Não foi possível excluir os artigos:", erro));
  }

  return (
    <div className="row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por título"
            value={termoBusca}
            onChange={evento => setTermoBusca(evento.target.value)}
            onKeyDown={evento => evento.key === "Enter" && buscar()}
          />
          <button className="btn btn-outline-secondary" type="button" onClick={buscar}>
            Buscar
          </button>
        </div>
      </div>

      <div className="col-md-6">
        <h4>Artigos</h4>
        <ul className="list-group">
          {artigos.length > 0 ? (
            artigos.map(artigo => (
              <li
                key={artigo.id}
                className={"list-group-item " + (selecionado?.id === artigo.id ? "active" : "")}
                style={{ cursor: "pointer" }}
                onClick={() => setSelecionado(artigo)}
              >
                {artigo.titulo}
              </li>
            ))
          ) : (
            <li className="list-group-item">Nenhum artigo encontrado.</li>
          )}
        </ul>

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={excluirTodos}
          disabled={artigos.length === 0}
        >
          Excluir todos
        </button>
      </div>

      <div className="col-md-6">
        {selecionado ? (
          <div>
            <h4>Detalhes</h4>
            <div><strong>Título:</strong> {selecionado.titulo}</div>
            <div><strong>Resumo:</strong> {selecionado.resumo}</div>
            <div><strong>Status:</strong> {selecionado.publicado ? "Publicado" : "Não publicado"}</div>
            <div><strong>Autor:</strong> {selecionado.autor ? selecionado.autor.nome : "—"}</div>

            <Link to={"/artigos/" + selecionado.id} className="btn btn-sm btn-warning mt-2" role="button">
              Editar
            </Link>
          </div>
        ) : (
          <div>
            <h4>&nbsp;</h4>
            <p><i>Selecione um artigo para ver os detalhes.</i></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListaArtigos;
