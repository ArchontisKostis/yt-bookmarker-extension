import { getCurrentTab } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
    // Create Bookmark UI elements
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");

    // Edit attributes
    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);
    console.log(bookmark.time);

    // Add bookmark to ui
    newBookmarkElement.appendChild(bookmarkTitleElement);
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

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", async () => {
    // Get the active tab and the search params
    const activeTab = await getCurrentTab();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

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
        let container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title"> This is not a YouTube video page.</div>';
    }
});