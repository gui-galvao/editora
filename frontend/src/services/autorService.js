import api from "./api";

const autorService = {
  listar: () => api.get("/autores"),
  buscarPorId: id => api.get(`/autores/${id}`),
  cadastrar: autor => api.post("/autores", autor),
  excluir: id => api.delete(`/autores/${id}`),
  listarArtigos: id => api.get(`/autores/${id}/artigos`),
};

export default autorService;
