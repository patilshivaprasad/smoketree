const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.post("/register/", async (request, response) => {
  const userDetails = request.body;
  const { id, name } = userDetails;
  const addBookQuery = `
    INSERT INTO
      User (id,name)
    VALUES
      (
        '${id}',
         ${name},
      );`;

  const dbResponse = await db.run(addBookQuery);
  const userId = dbResponse.lastID;
  response.send({ id: userId });
});
app.post("/register/", async (request, response) => {
  const addressDetails = request.body;
  const { id, address } = addressDetails;
  const addBookQuery = `
    INSERT INTO
      User (id,address)
    VALUES
      (
        '${id}',
         ${address},
      );`;

  const dbResponse = await db.run(addBookQuery);
  const userId = dbResponse.lastID;
  response.send({ id: userId });
});
app.get("/User/:id/register/", async (request, response) => {
  const { authorId } = request.params;
  const getAuthorBooksQuery = `
    SELECT
     *
    FROM
     User
    WHERE
      id = ${authorId};`;
  const booksArray = await db.all(getAuthorBooksQuery);
  response.send(booksArray);
});
