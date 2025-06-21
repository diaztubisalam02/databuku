document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("bookForm");
    const searchForm = document.getElementById("searchBook");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    let books = JSON.parse(localStorage.getItem("books")) || [];

    function saveBooks() {
        localStorage.setItem("books", JSON.stringify(books));
    }

    function renderBooks(filteredBooks = null) {
        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";
        
        (filteredBooks || books).forEach((book) => {
            const bookElement = document.createElement("div");
            bookElement.setAttribute("data-bookid", book.id);
            bookElement.setAttribute("data-testid", "bookItem");
            bookElement.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div>
                    <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
                    <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                </div>
            `;
            
            bookElement.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", function () {
                book.isComplete = !book.isComplete;
                saveBooks();
                renderBooks();
            });
            
            bookElement.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", function () {
                books = books.filter(b => b.id !== book.id);
                saveBooks();
                renderBooks();
            });
            
            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
    }

    bookForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.getElementById("bookFormTitle").value;
        const author = document.getElementById("bookFormAuthor").value;
        const year = Number(document.getElementById("bookFormYear").value);
        const isComplete = document.getElementById("bookFormIsComplete").checked;

        const newBook = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete
        };

        books.push(newBook);
        saveBooks();
        renderBooks();
        bookForm.reset();
    });

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = document.getElementById("searchBookTitle").value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
        renderBooks(filteredBooks);
    });

    renderBooks();
});
