CREATE DATABASE cadastro;
USE cadastro;

CREATE TABLE alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matricula VARCHAR(50),
  nome VARCHAR(100),
  email VARCHAR(100)
);


select * from alunos;