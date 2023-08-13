
    // Function to initialize Mermaid
    function initializeMermaid() {
        mermaid.initialize({
            theme: 'base',
            themeVariables: {
                pie1: '#2bc275',
                pie2: '#5f60ff',
                pie3: '#d74e26',
                pieStrokeWidth: '0px',
                textPosition: '0.5',
                pieOpacity: '1'
            }
        });
    }

    // Function to update the Mermaid graph
    function updateMermaidGraph() {
        // Fetch ratings data and generate Mermaid syntax
        const apiUrl = "https://dark-pink-prawn-wear.cyclic.app/getRatings";

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const ratings = data.ratings;

                // Count the number of each type of rating
                const promoterCount = ratings.filter(rating => rating >= 9).length;
                const passiveCount = ratings.filter(rating => rating >= 7 && rating <= 8).length;
                const detractorCount = ratings.filter(rating => rating >= 0 && rating <= 6).length;

                // Generate the updated Mermaid syntax
                const updatedMermaidSyntax = `%%{init: {'theme': 'base', 'themeVariables': { 'pie1': '#2bc275', 'pie2': '#5f60ff', 'pie3': '#d74e26', 'pieStrokeWidth': '0px', 'textPosition': '0.5', 'pieOpacity': '1'}}}%%
            pie
                "Promoter" : ${promoterCount}
                "Passive" : ${passiveCount}
                "Detractor" : ${detractorCount}`;

                // Insert the Mermaid syntax into the mermaid-container div
                const mermaidContainer = document.getElementById('mermaid-container');
                mermaidContainer.innerHTML = updatedMermaidSyntax;

                // Show total number of counts
                const countContainer = document.getElementById('count-container');
                countText = `Promoters: ${promoterCount} Passives: ${passiveCount} Detractors: ${detractorCount}</p>`;
                countContainer.innerHTML = countText;

                // Remove the 'data-processed' attribute to render mermaid again
                mermaidContainer.removeAttribute('data-processed');

                // Render the Mermaid chart
                mermaid.init(undefined, mermaidContainer);

            })
            .catch(error => {
                console.error("Error fetching ratings:", error);
            });
    }

    const circles = document.querySelectorAll('.circle');

    circles.forEach((circle, index) => {
        circle.addEventListener("click", function() {
            showMessage(index + 1);
            updateMermaidGraph();
            // Update the Mermaid graph after storing the rating
            storeRating(index + 1).then(() => {
                updateMermaidGraph();
            });
        });
    });

 // Function to store rating
    function storeRating(rating) {
        const apiUrl = "https://dark-pink-prawn-wear.cyclic.app/storeRating";
        const data = {
            rating: rating,
        };

        return fetch(apiUrl, {
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

    // Function to show message
    function showMessage(rating) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("rating-message-container");
        messageContainer.textContent = `You selected: ${rating}`;
        document.body.appendChild(messageContainer);

        setTimeout(function() {
            document.body.removeChild(messageContainer);
        }, 2000);
    }
    initializeMermaid()
    updateMermaidGraph();