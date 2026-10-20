# Trabalho de Desenvolvimento Web — Editora

## Sobre o Projeto

Este projeto é um sistema de editora desenvolvido em Java com Spring Boot e React, como parte do Trabalho 01 de Desenvolvimento Web.

A aplicação permite cadastrar autores e gerenciar artigos. Um autor pode escrever vários artigos, e cada artigo pertence a um único autor.

## Integrantes da Equipe

- Guilherme Domingues Galvão

## Tecnologias Utilizadas

- Java 17 ou superior
- Spring Boot
- JPA/Hibernate
- PostgreSQL
- React + Vite

## Funcionalidades

- Cadastro, consulta e exclusão de autores.
- Cadastro, consulta, edição e exclusão de artigos.
- Busca de artigos por título na interface.
- Listagem dos artigos de um autor.
- Validação de e-mail único para autores.
- Bloqueio da exclusão de autores que possuem artigos.

## Endpoints da API

Base: `http://localhost:8000/editora`

### Autor

- `GET /api/autores` — Listar todos os autores.
- `POST /api/autores` — Cadastrar um autor.
- `GET /api/autores/{id}` — Buscar um autor pelo ID.
- `GET /api/autores/{id}/artigos` — Listar os artigos de um autor.
- `DELETE /api/autores/{id}` — Excluir um autor sem artigos vinculados.

### Artigo

- `GET /api/artigos` — Listar todos os artigos.
- `POST /api/artigos` — Cadastrar um artigo.
- `GET /api/artigos/{id}` — Buscar um artigo pelo ID.
- `PUT /api/artigos/{id}` — Atualizar um artigo.
- `DELETE /api/artigos/{id}` — Excluir um artigo.
- `DELETE /api/artigos` — Excluir todos os artigos.
- `GET /api/artigos/publicados` — Listar artigos publicados.

## Estrutura do Banco de Dados

### Autor

- `id`: chave primária.
- `nome`: obrigatório.
- `email`: obrigatório e único.
- `biografia`: opcional, com até 5.000 caracteres.

### Artigo

- `id`: chave primária.
- `titulo`: obrigatório, com até 80 caracteres.
- `resumo`: obrigatório.
- `publicado`: indica se o artigo está publicado.
- `autor_id`: chave estrangeira obrigatória vinculada ao autor.

As tabelas são criadas automaticamente pelo JPA/Hibernate. O relacionamento entre autor e artigo é de um para muitos.
