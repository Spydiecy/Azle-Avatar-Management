import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

type Book = Record<{
    id: string;
    title: string;
    author: string;
    publishedYear: nat64;
    summary: string;
}>

type BookPayload = Record<{
    title: string;
    author: string;
    publishedYear: nat64;
    summary: string;
}>

const bookStorage = new StableBTreeMap<string, Book>(0, 44, 1024);

$query;
export function getBooks(): Result<Vec<Book>, string> {
    return Result.Ok(bookStorage.values());
}

$query;
export function getBook(id: string): Result<Book, string> {
    return match(bookStorage.get(id), {
        Some: (book) => Result.Ok<Book, string>(book),
        None: () => Result.Err<Book, string>(`A book with id=${id} not found`)
    });
}

$update;
export function addBook(payload: BookPayload): Result<Book, string> {
    const book: Book = { id: uuidv4(), ...payload };
    bookStorage.insert(book.id, book);
    return Result.Ok(book);
}

$update;
export function updateBook(id: string, payload: BookPayload): Result<Book, string> {
    return match(bookStorage.get(id), {
        Some: (book) => {
            const updatedBook: Book = {...book, ...payload};
            bookStorage.insert(book.id, updatedBook);
            return Result.Ok<Book, string>(updatedBook);
        },
        None: () => Result.Err<Book, string>(`Couldn't update a book with id=${id}. Book not found`)
    });
}

$update;
export function deleteBook(id: string): Result<Book, string> {
    return match(bookStorage.remove(id), {
        Some: (deletedBook) => Result.Ok<Book, string>(deletedBook),
        None: () => Result.Err<Book, string>(`Couldn't delete a book with id=${id}. Book not found.`)
    });
}

// a workaround to make uuid package work with Azle
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
