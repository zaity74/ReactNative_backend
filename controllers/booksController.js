import Books from "../models/Books/books.js";
import asyncHandler from "express-async-handler";


// CREATE BOOKS 
export const addBook = asyncHandler(async (req, res) => {
    const { title, description, year, author, category} = req.body;

    try {
        const newBook = new Books({
            title,
            description,
            year,
            author,
            category,
        });

        const savedBook = await newBook.save();

        res.status(201).json(savedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET ALL BOOKS
export const getAllBooks = asyncHandler(async (req, res) => {
    try {
        const books = await Books.find({});
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET BOOK BY ID
export const getBookById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Books.findById(id);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// DELETE BOOK
export const deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Books.findByIdAndDelete(id);
        if (book) {
            res.status(200).json({ message: 'Book deleted successfully' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// UPDATE BOOK
export const updateBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, year, author, category, thumbnail } = req.body;

    try {
        const book = await Books.findById( id );
        if (book) {
            book.title = title || book.title;
            book.description = description || book.description;
            book.year = year || book.year;
            book.author = author || book.author;
            book.category = category || book.category;
            book.thumbnail = thumbnail || book.thumbnail;
            book.updatedAt = Date.now();

            const updatedBook = await book.save();
            res.status(200).json(updatedBook);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
