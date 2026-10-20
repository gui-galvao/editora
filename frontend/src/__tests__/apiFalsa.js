import http from "node:http";

export function iniciarApiFalsa() {
  const banco = { autores: [], artigos: [], proximoAutor: 1, proximoArtigo: 1, requisicoes: [] };

  const servidor = http.createServer((req, res) => {
    const cabecalhos = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (req.method === "OPTIONS") {
      res.writeHead(204, cabecalhos);
      return res.end();
    }

    let texto = "";
    req.on("data", pedaco => (texto += pedaco));
    req.on("end", () => {
      const corpo = texto ? JSON.parse(texto) : {};
      const url = new URL(req.url, "http://localhost");

      const responder = (status, conteudo) => {
        if (conteudo === undefined) {
          res.writeHead(status, cabecalhos);
          return res.end();
        }
        res.writeHead(status, { ...cabecalhos, "Content-Type": "application/json" });
        res.end(JSON.stringify(conteudo));
      };

      if (!url.pathname.startsWith("/editora/api")) return responder(404);
      const caminho = url.pathname.replace("/editora/api", "");
      const metodo = req.method;
      banco.requisicoes.push({ metodo, caminho: caminho + url.search, corpo });
      let partes;

      if (caminho === "/autores" && metodo === "POST") {
        if (!corpo.nome || !corpo.email) return responder(400);
        if (banco.autores.some(autor => autor.email === corpo.email)) return responder(409);
        const autor = { id: banco.proximoAutor++, nome: corpo.nome, email: corpo.email, biografia: corpo.biografia || null };
        banco.autores.push(autor);
        return responder(201, autor);
      }

      if (caminho === "/autores" && metodo === "GET") {
        return banco.autores.length ? responder(200, banco.autores) : responder(204);
      }

      if ((partes = caminho.match(/^\/autores\/(\d+)\/artigos$/)) && metodo === "GET") {
        const id = Number(partes[1]);
        if (!banco.autores.some(autor => autor.id === id)) return responder(404);
        const artigosDoAutor = banco.artigos.filter(artigo => artigo.autor.id === id);
        return artigosDoAutor.length ? responder(200, artigosDoAutor) : responder(204);
      }

      if ((partes = caminho.match(/^\/autores\/(\d+)$/))) {
        const id = Number(partes[1]);
        const autor = banco.autores.find(item => item.id === id);
        if (metodo === "GET") return autor ? responder(200, autor) : responder(404);
        if (metodo === "DELETE") {
          if (!autor) return responder(404);
          if (banco.artigos.some(artigo => artigo.autor.id === id)) return responder(409);
          banco.autores = banco.autores.filter(item => item.id !== id);
          return responder(204);
        }
      }

      if (caminho === "/artigos" && metodo === "POST") {
        if (!corpo.titulo || !corpo.resumo || corpo.titulo.length > 80) return responder(400);
        if (!corpo.autor || corpo.autor.id == null) return responder(400);
        const autor = banco.autores.find(item => item.id === corpo.autor.id);
        if (!autor) return responder(404);
        const artigo = { id: banco.proximoArtigo++, titulo: corpo.titulo, resumo: corpo.resumo, publicado: true, autor };
        banco.artigos.push(artigo);
        return responder(201, artigo);
      }

      if (caminho === "/artigos" && metodo === "GET") {
        const busca = (url.searchParams.get("titulo") || "").toLowerCase();
        const encontrados = banco.artigos.filter(artigo => artigo.titulo.toLowerCase().includes(busca));
        return encontrados.length ? responder(200, encontrados) : responder(204);
      }

      if (caminho === "/artigos" && metodo === "DELETE") {
        banco.artigos = [];
        return responder(204);
      }

      if ((partes = caminho.match(/^\/artigos\/(\d+)$/))) {
        const id = Number(partes[1]);
        const artigo = banco.artigos.find(item => item.id === id);
        if (metodo === "GET") return artigo ? responder(200, artigo) : responder(404);
        if (metodo === "PUT") {
          if (!artigo) return responder(404);
          if (!corpo.titulo || !corpo.resumo) return responder(400);
          Object.assign(artigo, { titulo: corpo.titulo, resumo: corpo.resumo, publicado: corpo.publicado });
          return responder(200, artigo);
        }
        if (metodo === "DELETE") {
          if (!artigo) return responder(404);
          banco.artigos = banco.artigos.filter(item => item.id !== id);
          return responder(204);
        }
      }

      return responder(404);
    });
  });

  return new Promise(resolver => {
    servidor.listen(0, "127.0.0.1", () => {
      const porta = servidor.address().port;
      resolver({
        banco,
        url: `http://127.0.0.1:${porta}/editora/api`,
        encerrar: () => servidor.close(),
      });
    });
  });
}
