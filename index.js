const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const users = Math.max(...persons.map((p) => p.id));
  const date = Date();

  response.write(`<p>Phonebook has info for ${users} people</p><p>${date}</p>`);
  response.end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const maxId = persons.length > 0 ? Math.floor(Math.random() * 1000) : 0;
  const name = request.body.name;
  const number = request.body.number;

  const checkDuplicate = () => {
    const usedNames = persons.map((p) => p.name);

    if (usedNames.includes(name)) {
      return true;
    }
  };

  const person = request.body;
  person.id = String(maxId);

  if (name == undefined || number == undefined) {
    response.statusMessage = "missing name or number";
    response.status(406).end();
  } else if (checkDuplicate()) {
    response.statusMessage = "name must be unique";
    response.status(226).end();
  } else {
    persons = persons.concat(person);
    response.json(person);
  }
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
