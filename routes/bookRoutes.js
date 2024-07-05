import express from 'express';
const bookRouter = express.Router(); 


import { addBook, getAllBooks, getBookById, deleteBook, updateBook } from '../controllers/booksController.js';

bookRouter.post('/create-books', addBook); // Create book
bookRouter.get('/books', getAllBooks); // Get all books
bookRouter.get('/books/:id', getBookById); // Get book by ID
bookRouter.delete('/books/:id', deleteBook); // Delete book
bookRouter.put('/update-books/:id', updateBook); // Update book

export default bookRouter;