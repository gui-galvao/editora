import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import ListaArtigos from "./pages/ListaArtigos";
import NovoArtigo from "./pages/NovoArtigo";
import EditarArtigo from "./pages/EditarArtigo";
import ListaAutores from "./pages/ListaAutores";
import NovoAutor from "./pages/NovoAutor";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
        <div className="container">
          <Link to="/artigos" className="navbar-brand">
            <b><i>Editora</i></b>
          </Link>
          <div className="navbar-nav">
            <Link to="/artigos" className="nav-link">Artigos</Link>
            <Link to="/artigos/novo" className="nav-link">Novo artigo</Link>
            <Link to="/autores" className="nav-link">Autores</Link>
            <Link to="/autores/novo" className="nav-link">Novo autor</Link>
          </div>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Navigate to="/artigos" replace />} />
          <Route path="/artigos" element={<ListaArtigos />} />
          <Route path="/artigos/novo" element={<NovoArtigo />} />
          <Route path="/artigos/:id" element={<EditarArtigo />} />
          <Route path="/autores" element={<ListaAutores />} />
          <Route path="/autores/novo" element={<NovoAutor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
