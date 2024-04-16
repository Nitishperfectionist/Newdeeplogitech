async function fetchLatestStories() {
    try {
        const response = await fetch('/latest-stories')
        const data = await response.json();
        const storiesList = document.getElementById('storiesList');

        data.forEach((story, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${story}`;
            storiesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching latest stories:', error);
    }
}

// Fetch latest stories when the page loads
fetchLatestStories();