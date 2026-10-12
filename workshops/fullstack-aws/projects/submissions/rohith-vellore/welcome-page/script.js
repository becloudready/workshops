const welcomeButton = document.getElementById("welcomeButton");
const message = document.getElementById("message");

welcomeButton.addEventListener("click", function () {
    message.classList.toggle("hidden");

    if (message.classList.contains("hidden")) {
        welcomeButton.textContent = "Explore Workshop";
    } else {
        welcomeButton.textContent = "Hide Message";
    }
});