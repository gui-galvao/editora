import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import artigoService from "../services/artigoService";
import autorService from "../services/autorService";

const formularioVazio = { titulo: "", resumo: "", autorId: "" };

function NovoArtigo() {
  const [formulario, setFormulario] = useState(formularioVazio);
  const [autores, setAutores] = useState([]);
  const [enviado, setEnviado] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    autorService
      .listar()
      .then(resposta => setAutores(resposta.data || []))
      .catch(erro => {
        console.error("Não foi possível carregar os autores:", erro);
        setMensagemErro("Não foi possível carregar os autores.");
      });
  }, []);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
    setMensagemErro("");
  }

  function salvar() {
    if (!formulario.titulo.trim() || !formulario.resumo.trim()) {
      setMensagemErro("Preencha o título e o resumo.");
      return;
    }
    if (!formulario.autorId) {
      setMensagemErro("Selecione o autor do artigo.");
      return;
    }

    const novoArtigo = {
      titulo: formulario.titulo,
      resumo: formulario.resumo,
      autor: { id: Number(formulario.autorId) },
    };

    artigoService
      .criar(novoArtigo)
      .then(() => setEnviado(true))
      .catch(erro => {
        console.error("Não foi possível criar o artigo:", erro);
        const status = erro.response && erro.response.status;
        if (status === 404) setMensagemErro("O autor selecionado não existe mais.");
        else if (status === 400) setMensagemErro("Confira os dados: título (até 80 caracteres), resumo e autor.");
        else setMensagemErro("Erro ao criar o artigo.");
      });
  }

  function cadastrarOutro() {
    setFormulario(formularioVazio);
    setEnviado(false);
    setMensagemErro("");
  }

  if (enviado) {
    return (
      <div style={{ maxWidth: "400px", margin: "auto" }}>
        <h5>O artigo foi enviado com sucesso!</h5>
        <button className="btn btn-success" onClick={cadastrarOutro}>
          Cadastrar outro artigo
        </button>
        <div className="mt-3">
          <Link to="/artigos">Voltar para a lista</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <div className="form-group mb-3">
        <label htmlFor="titulo"><strong>Título</strong></label>
        <input
          type="text"
          className="form-control"
          id="titulo"
          name="titulo"
          maxLength={80}
          value={formulario.titulo}
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
          placeholder="Digite o resumo do artigo aqui..."
          value={formulario.resumo}
          onChange={atualizarCampo}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="autorId"><strong>Autor</strong></label>
        {autores.length > 0 ? (
          <select
            className="form-select"
            id="autorId"
            name="autorId"
            value={formulario.autorId}
            onChange={atualizarCampo}
          >
            <option value="">Selecione um autor</option>
            {autores.map(autor => (
              <option key={autor.id} value={autor.id}>{autor.nome}</option>
            ))}
          </select>
        ) : (
          <p className="mb-0">
            <i>Nenhum autor cadastrado. </i>
            <Link to="/autores/novo">Cadastre um autor primeiro</Link>.
          </p>
        )}
      </div>

      {mensagemErro && <p className="text-danger">{mensagemErro}</p>}

      <button onClick={salvar} className="btn btn-success" disabled={autores.length === 0}>
        Enviar
      </button>
    </div>
  );
}

export default NovoArtigo;
