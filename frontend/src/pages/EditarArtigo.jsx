import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import artigoService from "../services/artigoService";

function EditarArtigo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artigo, setArtigo] = useState(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    artigoService
      .buscarPorId(id)
      .then(resposta => setArtigo(resposta.data))
      .catch(erro => {
        console.error(`Não foi possível carregar o artigo ${id}:`, erro);
        setNaoEncontrado(true);
      });
  }, [id]);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setArtigo({ ...artigo, [name]: value });
    setMensagem("");
  }

  function mudarPublicacao(publicado) {
    artigoService
      .atualizar(artigo.id, { ...artigo, publicado })
      .then(() => {
        setArtigo({ ...artigo, publicado });
        setMensagem("Status atualizado com sucesso!");
      })
      .catch(erro => {
        console.error("Não foi possível atualizar o status:", erro);
        setMensagem("Erro ao atualizar o status.");
      });
  }

  function salvarAlteracoes() {
    artigoService
      .atualizar(artigo.id, artigo)
      .then(() => setMensagem("Artigo atualizado com sucesso!"))
      .catch(erro => {
        console.error("Não foi possível atualizar o artigo:", erro);
        const status = erro.response && erro.response.status;
        if (status === 400) setMensagem("Título (até 80 caracteres) e resumo são obrigatórios.");
        else setMensagem("Erro ao atualizar o artigo.");
      });
  }

  function excluir() {
    if (!window.confirm("Tem certeza que deseja excluir este artigo?")) {
      return;
    }
    artigoService
      .excluir(artigo.id)
      .then(() => navigate("/artigos"))
      .catch(erro => {
        console.error("Não foi possível excluir o artigo:", erro);
        setMensagem("Erro ao excluir o artigo.");
      });
  }

  let conteudo;
  if (naoEncontrado) {
    conteudo = <p><i>Artigo não encontrado.</i></p>;
  } else if (!artigo) {
    conteudo = <p><i>Carregando artigo...</i></p>;
  } else {
    conteudo = (
      <div>
        <h4>Editar artigo</h4>
        <form onSubmit={evento => evento.preventDefault()}>
          <div className="form-group mb-3">
            <label htmlFor="titulo"><strong>Título</strong></label>
            <input
              type="text"
              className="form-control"
              id="titulo"
              name="titulo"
              maxLength={80}
              value={artigo.titulo}
              onChange={atualizarCampo}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="resumo"><strong>Resumo</strong></label>
            <textarea
              rows={3}
              className="form-control"
              id="resumo"
              name="resumo"
              value={artigo.resumo}
              onChange={atualizarCampo}
            />
          </div>
          <div className="form-group">
            <strong>Status:</strong>
            <b className="ms-2">{artigo.publicado ? "Publicado" : "Não publicado"}</b>
          </div>
          <div className="form-group">
            <strong>Autor:</strong>
            <span className="ms-2">{artigo.autor ? artigo.autor.nome : "—"}</span>
          </div>
        </form>

        <div className="mt-3">
          {artigo.publicado ? (
            <button className="btn btn-sm btn-primary me-2" onClick={() => mudarPublicacao(false)}>
              Marcar como não publicado
            </button>
          ) : (
            <button className="btn btn-sm btn-primary me-2" onClick={() => mudarPublicacao(true)}>
              Publicar
            </button>
          )}
          <button className="btn btn-sm btn-danger me-2" onClick={excluir}>
            Excluir
          </button>
          <button className="btn btn-sm btn-success" onClick={salvarAlteracoes}>
            Atualizar
          </button>
        </div>

        {mensagem && <p className="mt-3">{mensagem}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      {conteudo}
      <div className="mt-4">
        <Link to="/artigos">Voltar para a lista</Link>
      </div>
    </div>
  );
}

export default EditarArtigo;
