const { error } = require("console");
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use("/bootstrap", express.static(path.join(__dirname, "/node_modules/bootstrap/dist")));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("success");
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM article", (error, results) => {
    res.render("index.ejs", { article: results });
  });
});

app.get("/detail/:id", (req, res) => {
  connection.query("SELECT * FROM article WHERE id = ?", [req.params.id], (error, results) => {
    res.render("detail.ejs", { artikel: results[0] });
  });
});

app.get("/tambah", (req, res) => {
  res.render("tambah.ejs");
});

app.post("/add", (req, res) => {
  const { JudulArtikel, RangkumanArtikel, IsiArtikel } = req.body;
  connection.query("INSERT INTO article (judul,rangkuman,isi) VALUES (?,?,?)", [JudulArtikel, RangkumanArtikel, IsiArtikel], (error, results) => {
    res.redirect("/");
  });
});

app.get("/ubah/:id", (req, res) => {
  connection.query("SELECT * FROM article WHERE id = ?", [req.params.id], (error, results) => {
    res.render("ubah.ejs", { artikel: results[0] });
  });
});

app.post("/edit/:id", (req, res) => {
  const { JudulArtikel, RangkumanArtikel, IsiArtikel } = req.body;
  const articleId = req.params.id;
  connection.query("UPDATE article SET judul = ?, rangkuman = ?, isi = ? WHERE id = ?", [JudulArtikel, RangkumanArtikel, IsiArtikel, articleId], (error, results) => {
    res.redirect("/");
  });
});

app.post("/delete/:id", (req, res) => {
  connection.query("DELETE FROM article WHERE id = ?", [req.params.id], (error, results) => {
    res.redirect("/");
  });
});

app.listen(8080);
