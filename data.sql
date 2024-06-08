\c books-test

CREATE TABLE books (
  isbn TEXT PRIMARY KEY,
  amazon_url TEXT,
  author TEXT NOT NULL,
  language TEXT NOT NULL, 
  pages INTEGER NOT NULL,
  publisher TEXT NOT NULL,
  title TEXT NOT NULL, 
  year INTEGER NOT NULL
);
