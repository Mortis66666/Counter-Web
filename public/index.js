let x = parseInt(localStorage.getItem('count')) || 0;
const num = document.getElementById("number");
const add = document.getElementById("add");
const reset = document.getElementById("reset");
const minus = document.getElementById("minus");
// document.getElementById("number").textContent = `Number: ${x}`;

const counterList = document.querySelector('#counterList');
const deletebtns = document.querySelectorAll(".delete");
const addbtns = document.querySelectorAll(".add");
const minusbtns = document.querySelectorAll(".minus");
const resetbtns = document.querySelectorAll(".reset");
const socket = io();

socket.on('new counter', (response) => {
    console.log("New counter received:", response.result);
    const counter = response.result;
    // create a wrapper for the counter
    const wrapper = document.createElement('div');
    const escape = document.createElement('p');
    escape.classList.add("counterName")
    escape.textContent = `Name: ${counter.name}`
    wrapper.classList.add('counter');
    wrapper.setAttribute('id',`${counter._id}`)
    wrapper.append(escape);
    // build inner HTML (matches your partial's structure)
    wrapper.innerHTML = `
        <p class="number"">Number: ${counter.value}</p> 
        <div class="buttons">
            <button class="add" id="add" data-doc="${counter._id}">Add 1</button>
            <button class="reset" id="reset" data-doc="${counter._id}">Reset</button>
            <button class="minus" id="minus" data-doc="${counter._id}">Minus 1</button>
            <button class="delete" id="delete" data-doc="${counter._id}">Delete Counter</button>
        </div>
    `;
    // append to header's parent (probably <body> or a <main>)
    counterList.append(wrapper);
});

socket.on('delete counter', (id) => {
    console.log("Deleted counter:", id);
    const deletedCounter = document.getElementById(`${id.id}`);
    deletedCounter.remove()
})

socket.on('update counter', (response) => {
    console.log("Change counter:", response);
    const counterData = response.result;
    const counter = document.getElementById(`${counterData._id}`);
    const counterNumber = counter.querySelector(".number");
    counterNumber.textContent = `Number: ${counterData.value}`
})

socket.on('reset counter', (response) => {
    console.log("Reset counter:", response);
    const counterData = response.result;
    const counter = document.getElementById(`${counterData._id}`);
    const counterNumber = counter.querySelector(".number");
    counterNumber.textContent = `Number: 0`
})

//Global listener, so op, no need to add event listener to each button wtf
document.querySelector('#counterList').addEventListener('click', (e) => {
    if (e.target.classList.contains('add')) {
        const counterId = e.target.dataset.doc;
        console.log("Add clicked for:", counterId);
        
        const response = fetch( '/', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id : counterId,
                change: 1
            })
        })
        .then((response) => response.json())
        // .then((data) => window.location.href = data.redirect)
        .catch((err) => console.log("Failed to add: ", err))
    }

    if (e.target.classList.contains('minus')) {
        const counterId = e.target.dataset.doc;
        console.log("Minus clicked for:", counterId);
        
        const response = fetch( '/', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id : counterId,
                change: -1
            })
        })
        .then((response) => response.json())
        // .then((data) => window.location.href = data.redirect)
        .catch((err) => console.log("Failed to add: ", err))
    }

    if (e.target.classList.contains('reset')) {
        const counterId = e.target.dataset.doc;
        console.log("Reset clicked for:", counterId);
       
        const response = fetch( '/', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id : counterId,
                value: 0
            })
        })
        .then((response) => response.json())
        // .then((data) => window.location.href = data.redirect)
        .catch((err) => console.log("Failed to add: ", err))
    }

    if (e.target.classList.contains('delete')) {
        const counterId = e.target.dataset.doc;
        console.log("Delete clicked for:", counterId);
        
        fetch('/', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: counterId })
        })
        .then((response) => response.json())
        // .then((data) => window.location.href = data.redirect)
        .catch((err) => console.log("Failed to delete: ", err))
    }
});

//Old approach of adding event listener to each button instead of global event listener

// deletebtns.forEach(deletebtn => {
//     deletebtn.addEventListener('click', () => {
//         const counterId = deletebtn.dataset.doc;
//         fetch('http://localhost:3000/', {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ id: counterId })
//         })
//         .then((response) => response.json())
//         .then((data) => window.location.href = data.redirect)
//         .catch((err) => console.log("Failed to delete: ", err))
//     });
// });

// addbtns.forEach(addbtn => {
//     addbtn.addEventListener('click', () => {
//         const counterId = addbtn.dataset.doc;
//         const response = fetch( 'http://localhost:3000/', {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 id : counterId,
//                 change: 1
//             })
//         })
//         .then((response) => response.json())
//         .then((data) => window.location.href = data.redirect)
//         .catch((err) => console.log("Failed to add: ", err))
//     });
// });

// minusbtns.forEach(minusbtn => {
//     minusbtn.addEventListener('click', () => {
//         const counterId = minusbtn.dataset.doc;
//         const response = fetch( 'http://localhost:3000/', {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 id : counterId,
//                 change: -1
//             })
//         })
//         .then((response) => response.json())
//         .then((data) => window.location.href = data.redirect)
//         .catch((err) => console.log("Failed to add: ", err))
//     });
// });

// resetbtns.forEach(resetbtn => {
//     resetbtn.addEventListener('click', () => {
//         const counterId = resetbtn.dataset.doc;
//         const response = fetch( 'http://localhost:3000/', {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 id : counterId,
//                 value: 0
//             })
//         })
//         .then((response) => response.json())
//         .then((data) => window.location.href = data.redirect)
//         .catch((err) => console.log("Failed to add: ", err))
//     });
// });

// Save scroll position
window.addEventListener("scroll", () => {
localStorage.setItem("scrollY", window.scrollY);
});

// Restore scroll position
window.addEventListener("load", () => {
const scrollY = localStorage.getItem("scrollY");
if (scrollY !== null) {
    window.scrollTo(0, parseInt(scrollY, 10));
}
});
