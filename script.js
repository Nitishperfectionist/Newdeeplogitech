async function fetchLatestStories() {
    try {
        const response = await fetch('/latest-stories')
        const data = await response.json();
        const storiesList = document.getElementById('list');

        data.forEach((story, i) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${i + 1}. ${story}`;
            storiesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error latest stories:', error);
    }
}
fetchLatestStories();