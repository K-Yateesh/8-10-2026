
class Book {
    constructor(isbn, title, author, available = true) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.available = available;
    }
}

class Library {
    constructor() {
        this.books = [];           // Master list of Book objects
        this.borrowers = new Map(); // Name -> Set of borrowed ISBNs
    }

    // 1. Add a book, ignoring duplicate ISBNs
    addBook(book) {
        const exists = this.books.some(
            existingBook => existingBook.isbn === book.isbn
        );

        if (!exists) {
            this.books.push(book);
        }
    }

    // 2. Remove a book and its ISBN from every borrower's Set
    removeBook(isbn) {
        const index = this.books.findIndex(
            book => book.isbn === isbn
        );

        if (index === -1) {
            return;
        }

        this.books.splice(index, 1);

        for (const borrowedBooks of this.borrowers.values()) {
            borrowedBooks.delete(isbn);
        }
    }

    // 3. Check out a book if it is available
    checkout(isbn, borrower) {
        const book = this.books.find(
            book => book.isbn === isbn
        );

        if (!book || !book.available) {
            return;
        }

        book.available = false;

        if (!this.borrowers.has(borrower)) {
            this.borrowers.set(borrower, new Set());
        }

        this.borrowers.get(borrower).add(isbn);
    }

    // 4. Return a book only if this borrower has checked it out
    returnBook(isbn, borrower) {
        const borrowedBooks = this.borrowers.get(borrower);

        if (!borrowedBooks || !borrowedBooks.has(isbn)) {
            return;
        }

        const book = this.books.find(
            book => book.isbn === isbn
        );

        if (!book) {
            return;
        }

        borrowedBooks.delete(isbn);
        book.available = true;

        if (borrowedBooks.size === 0) {
            this.borrowers.delete(borrower);
        }
    }

    // 5. Return titles of all available books
    listAvailable() {
        return this.books
            .filter(book => book.available)
            .map(book => book.title);
    }

    // 6. Return titles borrowed by a particular borrower
    borrowerReport(borrower) {
        const borrowedBooks = this.borrowers.get(borrower);

        if (!borrowedBooks) {
            return [];
        }

        return this.books
            .filter(book => borrowedBooks.has(book.isbn))
            .map(book => book.title);
    }
}

module.exports = { Book, Library };
