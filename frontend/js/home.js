const contactModal = document.getElementById("contactModal");
const signOutBtn = document.getElementById("signOut");
var modal = document.querySelector(".modal");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

contactModal.addEventListener('click', (event) => {
    event.preventDefault();

    toggleModal();
});

signOutBtn.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('token');
    location.href = "index.html";
});
