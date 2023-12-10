import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Define the book record structure
type Book = Record<{
    id: string;
    title: string;
    author: string;
    publishedYear: nat64;
    summary: string;
}>;

// Define the book payload structure
type BookPayload = Record<{
    title: string;
    author: string;
    publishedYear: nat64;
    summary: string;
}>;

// Initialize the storage for books
const bookStorage = new StableBTreeMap<string, Book>(0, 44, 1024);

// Query to get all books
$query;
export function getBooks(): Result<Vec<Book>, string> {
    try {
        // Use try-catch for error handling
        return Result.Ok<Vec<Book>, string>(bookStorage.values());
    } catch (error: any) {
        return Result.Err<Vec<Book>, string>(`Failed to get books: ${error}`);
    }
}

// Query to get a specific book by ID
$query;
export function getBook(id: string): Result<Book, string> {
    try {
        // Validate book ID
        if (!id) {
            return Result.Err<Book, string>("Invalid book ID.");
        }

        return match(bookStorage.get(id), {
            Some: (book) => Result.Ok<Book, string>(book),
            None: () => Result.Err<Book, string>(`A book with id=${id} not found`)
        });
    } catch (error: any) {
        return Result.Err<Book, string>(`Failed to get book: ${error}`);
    }
}

// Update to add a new book
$update;
export function addBook(payload: BookPayload): Result<Book, string> {
    try {
        // Validate payload properties
        if (!payload || !payload.title || !payload.author || !payload.publishedYear || !payload.summary) {
            return Result.Err<Book, string>("Invalid book payload.");
        }

        // Create a new book with individual properties
        const book: Book = {
            id: uuidv4(),
            title: payload.title,
            author: payload.author,
            publishedYear: payload.publishedYear,
            summary: payload.summary,
        };

        // Insert the book into storage
        bookStorage.insert(book.id, book);
        return Result.Ok(book);
    } catch (error: any) {
        return Result.Err<Book, string>(`Failed to add book: ${error}`);
    }
}

// Update to modify an existing book
$update;
export function updateBook(id: string, payload: BookPayload): Result<Book, string> {
    try {
        // Validate book ID and payload properties
        if (!id || !payload || !payload.title || !payload.author || !payload.publishedYear || !payload.summary) {
            return Result.Err<Book, string>("Invalid book ID or payload.");
        }

        return match(bookStorage.get(id), {
            Some: (book) => {
                // Update the book with individual properties
                const updatedBook: Book = {
                    ...book,
                    title: payload.title,
                    author: payload.author,
                    publishedYear: payload.publishedYear,
                    summary: payload.summary,
                };

                // Insert the updated book into storage
                bookStorage.insert(book.id, updatedBook);
                return Result.Ok<Book, string>(updatedBook);
            },
            None: () => Result.Err<Book, string>(`Couldn't update a book with id=${id}. Book not found`)
        });
    } catch (error: any) {
        return Result.Err<Book, string>(`Failed to update book: ${error}`);
    }
}

// Update to delete a book by ID
$update;
export function deleteBook(id: string): Result<Book, string> {
    try {
        // Validate book ID
        if (!id) {
            return Result.Err<Book, string>("Invalid book ID.");
        }

        return match(bookStorage.remove(id), {
            Some: (deletedBook) => Result.Ok<Book, string>(deletedBook),
            None: () => Result.Err<Book, string>(`Couldn't delete a book with id=${id}. Book not found.`)
        });
    } catch (error: any) {
        return Result.Err<Book, string>(`Failed to delete book: ${error}`);
    }
}

// Workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};
