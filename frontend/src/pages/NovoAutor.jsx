import { useState } from "react";
import { Link } from "react-router-dom";
import autorService from "../services/autorService";

const formularioVazio = { nome: "", email: "", biografia: "" };

function NovoAutor() {
  const [formulario, setFormulario] = useState(formularioVazio);
  const [cadastrado, setCadastrado] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
    setMensagemErro("");
  }

  function salvar() {
    autorService
      .cadastrar(formulario)
      .then(() => setCadastrado(true))
      .catch(erro => {
        console.error("Não foi possível cadastrar o autor:", erro);
        const status = erro.response && erro.response.status;
        if (status === 409) setMensagemErro("Já existe um autor com este e-mail.");
        else if (status === 400) setMensagemErro("Nome e e-mail são obrigatórios.");
        else setMensagemErro("Erro ao cadastrar o autor.");
      });
  }

  function cadastrarOutro() {
    setFormulario(formularioVazio);
    setCadastrado(false);
    setMensagemErro("");
  }

  if (cadastrado) {
    return (
      <div style={{ maxWidth: "400px", margin: "auto" }}>
        <h5>O autor foi cadastrado com sucesso!</h5>
        <button className="btn btn-success" onClick={cadastrarOutro}>
          Cadastrar outro autor
        </button>
        <div className="mt-3">
          <Link to="/autores">Ver autores</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <div className="form-group mb-3">
        <label htmlFor="nome"><strong>Nome</strong></label>
        <input
          type="text"
          className="form-control"
          id="nome"
          name="nome"
          value={formulario.nome}
          onChange={atualizarCampo}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="email"><strong>E-mail</strong></label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formulario.email}
          onChange={atualizarCampo}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="biografia"><strong>Biografia</strong> (opcional)</label>
        <textarea
          rows={4}
          className="form-control"
          id="biografia"
          name="biografia"
          value={formulario.biografia}
          onChange={atualizarCampo}
        />
      </div>

      {mensagemErro && <p className="text-danger">{mensagemErro}</p>}

      <button onClick={salvar} className="btn btn-success">
        Enviar
      </button>
    </div>
  );
}

export default NovoAutor;
