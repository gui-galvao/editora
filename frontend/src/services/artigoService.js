import api from "./api";

const artigoService = {
  listar: titulo => api.get("/artigos", { params: { titulo: titulo || "" } }),
  buscarPorId: id => api.get(`/artigos/${id}`),
  criar: artigo => api.post("/artigos", artigo),
  atualizar: (id, artigo) => api.put(`/artigos/${id}`, artigo),
  excluir: id => api.delete(`/artigos/${id}`),
  excluirTodos: () => api.delete("/artigos"),
};

export default artigoService;
