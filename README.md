# Virtual Library Canister

This repository contains the code for a "Virtual Library" canister developed using Azle. The canister allows users to manage a virtual library of books.

## Features

The canister provides the following functionalities:

1. **Add a Book**: Users can add a book with a title, author, published year, and summary.
2. **Update a Book**: Users can update the details of a book.
3. **Delete a Book**: Users can delete a book from the library.
4. **Retrieve All Books**: Users can retrieve the details of all books in the library.
5. **Retrieve a Specific Book**: Users can retrieve the details of a specific book by its id.

## Getting Started

To use this canister, you need to have the DFINITY Canister SDK installed on your machine. You can then deploy the canister to a local or remote network.

- Clone the repo

 ```
 git clone 
 ```

- Move to the repo directory

 ```
 cd Azle-Virtual-Library
 ```

- Install the packages

 ```
 npm install
 ```

- Start the ICP blockchain locally

 ```
 dfx start --background --clean
 ```

- Deploy the canister on the local blockchain

 ```
 dfx deploy
 ```

## Data Structures

The canister uses the following data structures:

- `Book`: A record that represents a book. Each book has an `id`, `title`, `author`, `publishedYear`, and `summary`.
- `BookPayload`: A record that represents the payload for adding or updating a book. It includes a `title`, `author`, `publishedYear`, and `summary`.

## Functions

The canister provides the following functions:

- `getBooks`: A query function that retrieves all books.
 
  ```
  dfx canister call library_app getBooks
  ```
  
- `getBook`: A query function that retrieves a specific book by its id.

  ```
  dfx canister call library_app getBook '("book-id")'
  ```
  
- `addBook`: An update function that adds a book.

  ```
  dfx canister call library_app addBook '(record { title = "<Book Title>"; publishedYear = 2022; author = "<Author Name>"; summary = "<Book Summary>" })'
  ```
  
- `updateBook`: An update function that updates the details of a book.

  ```
  dfx canister call library_app updateBook '("book-id", record { title = "<Book Title>"; publishedYear = 2022; author = "<Author Name>"; summary = "<Book Summary>" })'
  ```
  
- `deleteBook`: An update function that deletes a book.

  ```
  dfx canister call library_app deleteBook '("book-id")'
  ```

## Workaround for UUID Generation

The canister uses a workaround to make the `uuid` package work with Azle. The `getRandomValues` function returns a `Uint8Array` of 32 random values.

## Contributing

Contributions are welcome! Please read the contributing guidelines before getting started.

## License

This project is licensed under the terms of the MIT license.
