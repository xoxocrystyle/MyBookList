//Book Class: Represents a book 
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//UI Class: Handle UI Tasks 
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        const title = document.querySelector('#title').value = '';
        const author = document.querySelector('#author').value = '';
        const isbn = document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 
        2000);
    }
}
//Store Class: Handle Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}
//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a book 
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //prevent actual submit
    e.preventDefault();

    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields.', 'danger');
    } else {
        //instatiate book
        const book = new Book(title, author, isbn);

        //Add Book to UI
        UI.addBookToList(book);

        //add book to store
        Store.addBook(book);

        //Show success message
        UI.showAlert('Book Added', 'success');

        //clear fields 
        UI.clearFields();
    }
})

//Event: remove a book 
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    //Remove book from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed.', 'success');
})