const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const admin = require("firebase-admin");

// IMPORTA A CHAVE PRIVADA DO FIREBASE
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
app.use(cors());
app.use(express.json());

// INICIALIZA O FIREBASE ADMIN (BACKEND)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const dbFirebase = admin.firestore();

// CONFIGURAÇÃO DO MYSQL
const dbMySQL = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "belladona",
  database: "cadastro"
});

// ROTA PARA EXPORTAR OS DADOS DO FIREBASE PARA O MYSQL
app.post("/exportar", async (req, res) => {
  try {
    const snapshot = await dbFirebase.collection("alunos").get();

    if (snapshot.empty) {
      return res.send("Nenhum aluno encontrado no Firebase.");
    }

    snapshot.forEach(doc => {
      const aluno = doc.data();

      dbMySQL.query(
        "INSERT INTO alunos (matricula, nome, email) VALUES (?, ?, ?)",
        [aluno.matricula, aluno.nome, aluno.email]
      );
    });

    res.send("Dados exportados com sucesso para o MySQL!");
  } catch (error) {
    console.error("Erro ao exportar:", error);
    res.status(500).send("Erro ao exportar dados.");
  }
});

// INICIA O SERVIDOR
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
