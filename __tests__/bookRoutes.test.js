process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

let book0;

describe("Book Routes Test", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books");

    book0 = await Book.create({
      isbn: "978-1568361512",
      amazon_url: "https://www.amazon.com/Miffy-Dick-Bruna/dp/1568361513",
      author: "Dick Bruna",
      language: "English",
      pages: 28,
      publisher: "Kodansha USA Inc",
      title: "Miffy",
      year: 1996,
    });
  });

  describe("GET /books", () => {
    test("Get list of 1 book", async () => {
      const response = await request(app).get(`/books`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({books: [book0]});
    });
  });

  describe("GET /books/:isbn", () => {
    test("Get book by isbn", async () => {
      const response = await request(app).get(`/books/${book0.isbn}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({book: book0});
    });
  });

  describe("POST /books", function () {
    test("create book with valid data", async function () {
      const book = {
        isbn: "978-1471120824",
        amazon_url:
          "https://www.amazon.com/Miffy-at-Zoo-Dick-Bruna/dp/1471120821/ref=pd_lpo_sccl_1/136-3189536-2338336?pd_rd_w=Jhkjp&content-id=amzn1.sym.c9f182d8-0dba-4a43-9420-58bac33ca34e&pf_rd_p=c9f182d8-0dba-4a43-9420-58bac33ca34e&pf_rd_r=WQH5148QY3CAYYPFFT2A&pd_rd_wg=hkKYA&pd_rd_r=4d3df5da-377c-45b7-8fdb-004d2dee248a&pd_rd_i=1471120821&psc=1",
        author: "Dick Bruna",
        language: "English",
        pages: 28,
        publisher: "Simon & Schuster Childrens Books",
        title: "Miffy At The Zoo",
        year: 2014,
      };
      const response = await request(app).post("/books").send(book);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ book });
    });
    test("create book with invalid data", async function () {
      const book = {
        isbn: "978-14711208243874923",
        amazon_url: "http://flsakjefl.com",
        author: "Dick Bruna",
        language: "English",
        pages: 0,
        publisher: "Simon & Schuster Childrens Books",
        title: "Miffy At The Zoo",
        year: 2025,
      };
      const response = await request(app).post("/books").send(book);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("PUT /books/:isbn", function () {
    test("update book with valid data", async function () {
      const book = {
        isbn: "978-1568361512",
        amazon_url:
          "https://www.amazon.com/Miffy-random",
        author: "Dick Bruna",
        language: "English",
        pages: 28,
        publisher: "Miffy Publishing Co",
        title: "Miffy and Flowers",
        year: 2024,
      };
      const response = await request(app).put(`/books/${book0.isbn}`).send(book);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ book });
    });
    test("update book with invalid data", async function () {
      const book = {
        isbn: "978-1568361512",
        amazon_url: "http://flsakjefl.com",
        author: "Dick Bruna",
        language: "English",
        pages: 0,
        publisher: "Simon & Schuster Childrens Books",
        title: "Miffy At The Zoo",
        year: 2025,
      };
      const response = await request(app).put(`/books/${book0.isbn}`).send(book);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("DELETE /books/:isbn", () => {
    test("delete book", async () => {
      const response = await request(app).delete(`/books/${book0.isbn}`);
      expect(response.statusCode).toBe(200);
    });
  });


  afterAll(async function () {
    await db.end();
  });
});
