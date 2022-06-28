import { getCurrentTab } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
    // Create Bookmark UI elements
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");

    // Edit attributes
    // Bookmark Title
    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    // Controls
    controlsElement.className = "bookmark-controls";

    // New Bookmark
    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);

    // Add bookmark to ui
    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks=[]) => {
    // Get popup ui bookmarks element
    const bookmarkElement = document.getElementById("bookmarks");
    bookmarkElement.innerHTML = "";

    if(currentBookmarks.length > 0){
        for(let i=0; i<currentBookmarks.length; i++){
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarkElement, bookmark);
        }
    } else {
        bookmarkElement.innerHTML = '<i class=row>No bookmarks to show</i>';
    }
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getCurrentTab();
    // Send message to content script
    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime
    })
};

const onDelete = async e => {
    const activeTab = await getCurrentTab();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const elementToDelete = document.getElementById("bookmark-" + bookmarkTime);
    const body = document.querySelector('body');
    const html = document.querySelector('html');

    elementToDelete.parentNode.removeChild(elementToDelete);
    body.style.height = 'min-content';
    html.style.height = 'min-content';

    // Sent message to contentscript
    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarkTime
    }, viewBookmarks);
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
    // Create Control Element
    const controlElement = document.createElement("img");
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;

    // Add Event Listener
    controlElement.addEventListener("click", eventListener);

    controlParentElement.appendChild(controlElement);
};

const toggleDarkLightMode = (button) => {
    const body = document.querySelector('body');
    const title = document.getElementsByClassName('title')[0];
    const logoImage = document.getElementById('appLogo');
    const bookmark = document.getElementsByClassName('bookmark');

    body.classList.toggle('light-mode-body');
    title.classList.toggle('light-mode-title');
    logoImage.classList.toggle('light-mode-logo');
    
}



document.addEventListener("DOMContentLoaded", async () => {
    // Get the active tab and the search params
    const activeTab = await getCurrentTab();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    const darkLightModeBtn = document.querySelector('button');
    darkLightModeBtn.addEventListener('click', toggleDarkLightMode.bind(darkLightModeBtn), false);

    // Check if user is watching a YT video
    if(activeTab.url.includes("youtube.com/watch") && currentVideo){
        // Get saved bookmarks
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]): [];

            viewBookmarks(currentVideoBookmarks);
        })
    } else {
        // This code will run if the user is not on a YT video watch page
        // and will update the Extension UI in order to inform the user
        let popupTitle = document.getElementsByClassName('title')[0]
        popupTitle.textContent = 'This is not a YouTube video page.';
    }
});