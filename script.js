window.onload = function() {
    const circleContainer = document.querySelector(".circle-container");

    for (let i = 1; i <= 10; i++) {
        const circle = document.createElement("div");
        circle.classList.add("circle");
        circle.textContent = i;

        if (i <= 6) {
            circle.classList.add("circle-1");
        } else if (i === 7 || i === 8) {
            circle.classList.add("circle-7");
        } else if (i === 9 || i === 10) {
            circle.classList.add("circle-10");
        } else {
            circle.style.borderColor = "#ccc";
        }

        circle.addEventListener("click", function() {
            showMessage(i);
            storeRating(i);

            // Notify parent page (mkdocs via iframe) about the new rating
            parent.postMessage({ type: 'newRating', rating: i }, '*');
        });

        circleContainer.appendChild(circle);
    }
};



function showMessage(rating) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");
    messageContainer.textContent = `You selected: ${rating}`;
    document.body.appendChild(messageContainer);

    setTimeout(function() {
        document.body.removeChild(messageContainer);
    }, 2000);
}

function storeRating(rating) {
    const apiUrl = "https://dark-pink-prawn-wear.cyclic.app/storeRating";
    const data = {
        rating: rating,
    };

    fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Rating stored:', rating);
        console.log("Rating stored data.message:", data.message);
    })
    .catch(error => {
        console.error("Error storing rating:", error);
    });

}


