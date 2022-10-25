# MermaidParseAPI

Express API that parses MermaidJS syntax and returns an object containing information such as the nodes and relations between them.

# Installation

After retrieving the code from this repository, you can install the dependencies of the server using the following command (make sure you have Node.js installed on your machine):

```
npm install
```

# Running the server locally

You can start the server locally using the following command:

```
npm start
```

This will start the server on port 8080.

# How to use MermaidParseAPI

You can send a POST request to "localhost:8080/parse" with the MermaidJS syntax in the body such as:

```JSON
{
    "input": "..."
}
```

#Data Layer

This next section will detail how the in-memory Knex.js database structure looks like and what type of queries are there

[Database structure](https://ibb.co/f4kBkPm)
