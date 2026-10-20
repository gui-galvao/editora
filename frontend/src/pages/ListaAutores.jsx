import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import autorService from "../services/autorService";

function ListaAutores() {
  const [autores, setAutores] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [artigosDoAutor, setArtigosDoAutor] = useState([]);
  const [mensagem, setMensagem] = useState("");

  function carregarAutores() {
    autorService
      .listar()
      .then(resposta => setAutores(resposta.data || []))
      .catch(erro => console.error("Não foi possível carregar os autores:", erro));
  }

  useEffect(() => {
    carregarAutores();
  }, []);

  function selecionar(autor) {
    setSelecionado(autor);
    setArtigosDoAutor([]);
    setMensagem("");
    autorService
      .listarArtigos(autor.id)
      .then(resposta => setArtigosDoAutor(resposta.data || []))
      .catch(erro => console.error("Não foi possível carregar os artigos do autor:", erro));
  }

  function excluir() {
    if (!window.confirm("Tem certeza que deseja excluir este autor?")) {
      return;
    }
    autorService
      .excluir(selecionado.id)
      .then(() => {
        setSelecionado(null);
        setArtigosDoAutor([]);
        carregarAutores();
      })
      .catch(erro => {
        console.error("Não foi possível excluir o autor:", erro);
        const status = erro.response && erro.response.status;
        if (status === 409) setMensagem("Não é possível excluir um autor que possui artigos.");
        else setMensagem("Erro ao excluir o autor.");
      });
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Autores</h4>
        <ul className="list-group">
          {autores.length > 0 ? (
            autores.map(autor => (
              <li
                key={autor.id}
                className={"list-group-item " + (selecionado?.id === autor.id ? "active" : "")}
                style={{ cursor: "pointer" }}
                onClick={() => selecionar(autor)}
              >
                {autor.nome}
              </li>
            ))
          ) : (
            <li className="list-group-item">Nenhum autor encontrado.</li>
          )}
        </ul>
      </div>

      <div className="col-md-6">
        {selecionado ? (
          <div>
            <h4>Detalhes</h4>
            <div><strong>Nome:</strong> {selecionado.nome}</div>
            <div><strong>E-mail:</strong> {selecionado.email}</div>
            <div><strong>Biografia:</strong> {selecionado.biografia || "—"}</div>

            <div className="mt-3">
              <strong>Artigos:</strong>
              {artigosDoAutor.length > 0 ? (
                <ul>
                  {artigosDoAutor.map(artigo => (
                    <li key={artigo.id}>
                      <Link to={"/artigos/" + artigo.id}>{artigo.titulo}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p><i>Este autor ainda não tem artigos.</i></p>
              )}
            </div>

            <button className="btn btn-sm btn-danger mt-2" onClick={excluir}>
              Excluir autor
            </button>
            {mensagem && <p className="mt-3 text-danger">{mensagem}</p>}
          </div>
        ) : (
          <div>
            <h4>&nbsp;</h4>
            <p><i>Selecione um autor para ver os detalhes.</i></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListaAutores;
