// main.js
// Elements for login and library sections
const loginForm = document.getElementById("loginForm");
const librarySection = document.getElementById("library");

// Login elements
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

// Book library elements
const bookTitleInput = document.getElementById("bookTitle");
const bookAuthorInput = document.getElementById("bookAuthor");
const bookCategorySelect = document.getElementById("bookCategory");
const addBookBtn = document.getElementById("addBookBtn");
const logoutBtn = document.getElementById("logoutBtn");
const booksList = document.getElementById("books");
const borrowedBooksList = document.getElementById("borrowedBooks");
const historyList = document.getElementById("historyList");
const sortOptions = document.getElementById("sortOptions");
const bookCategoryFilter = document.getElementById("bookCategoryFilter");

// Mock storage for users and books
let users = [];
let books = [];

// Login function
loginBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        alert("Login successful!");
        loginForm.style.display = "none";
        librarySection.style.display = "block";
    } else {
        alert("Invalid username or password.");
    }
});

// Register function
registerBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (users.some(user => user.username === username)) {
        alert("Username already exists!");
    } else {
        users.push({ username, password });
        alert("Registration successful! You can now log in.");
    }
});

// Logout function
logoutBtn.addEventListener("click", () => {
    loginForm.style.display = "block";
    librarySection.style.display = "none";
    usernameInput.value = "";
    passwordInput.value = "";
});

// Add a new book to the library
addBookBtn.addEventListener("click", () => {
    const title = bookTitleInput.value;
    const author = bookAuthorInput.value;
    const category = bookCategorySelect.value;
    if (title && author) {
        const book = { title, author, category, borrowed: false };
        books.push(book);
        updateBookList();
        bookTitleInput.value = "";
        bookAuthorInput.value = "";
    } else {
        alert("Please enter both title and author.");
    }
});

// Function to delete a book from the list
function deleteBook(book) {
    const index = books.indexOf(book);
    if (index > -1) {
        books.splice(index, 1);
        updateBookList();
    }
}

// Update the book list function to include delete button
function updateBookList() {
    booksList.innerHTML = "";
    const filterCategory = bookCategoryFilter.value;
    const sortedBooks = [...books];

    // Sort books based on selected sort option
    sortedBooks.sort((a, b) => a[sortOptions.value].localeCompare(b[sortOptions.value]));

    // Filter books by selected category if not "All"
    const filteredBooks = filterCategory === "All"
        ? sortedBooks
        : sortedBooks.filter(book => book.category === filterCategory);

    filteredBooks.forEach(book => {
        const bookItem = document.createElement("li");
        bookItem.textContent = `${book.title} by ${book.author} (${book.category})`;

        // Borrow button
        const borrowBtn = document.createElement("button");
        borrowBtn.textContent = book.borrowed ? "Return" : "Borrow";
        borrowBtn.onclick = () => toggleBorrow(book);
        bookItem.appendChild(borrowBtn);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteBook(book);
        bookItem.appendChild(deleteBtn);

        booksList.appendChild(bookItem);
    });
}

// Toggle borrow/return status of a book
function toggleBorrow(book) {
    book.borrowed = !book.borrowed;
    const action = book.borrowed ? "Borrowed" : "Returned";
    updateHistory(book, action);
    updateBookList();
    updateBorrowedList();
}

// Update borrowed books list
function updateBorrowedList() {
    borrowedBooksList.innerHTML = "";
    const borrowedBooks = books.filter(book => book.borrowed);
    borrowedBooks.forEach(book => {
        const borrowedItem = document.createElement("li");
        borrowedItem.textContent = `${book.title} by ${book.author} (${book.category})`;
        borrowedBooksList.appendChild(borrowedItem);
    });
}

// Update history list with actions
function updateHistory(book, action) {
    const historyItem = document.createElement("li");
    historyItem.textContent = `${action}: ${book.title} by ${book.author}`;
    historyList.appendChild(historyItem);
}

// Sort and filter event listeners
sortOptions.addEventListener("change", updateBookList);
bookCategoryFilter.addEventListener("change", updateBookList);

// Function to search and display books by title
// Function to search and display books by exact title match
function searchBookByTitle() {
    const searchTitle = document.getElementById("searchTitle").value.toLowerCase();
    const matchingBooks = books.filter(book => book.title.toLowerCase() === searchTitle);

    // Clear and update books list with exact matches
    booksList.innerHTML = "";
    matchingBooks.forEach(book => {
        const bookItem = document.createElement("li");
        bookItem.textContent = `${book.title} by ${book.author} (${book.category})`;

        // Borrow button
        const borrowBtn = document.createElement("button");
        borrowBtn.textContent = book.borrowed ? "Return" : "Borrow";
        borrowBtn.onclick = () => toggleBorrow(book);
        bookItem.appendChild(borrowBtn);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteBook(book);
        bookItem.appendChild(deleteBtn);

        booksList.appendChild(bookItem);
    });
}

// Event listener for search button
document.getElementById("searchBtn").addEventListener("click", searchBookByTitle);
