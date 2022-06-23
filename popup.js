import { getCurrentTab } from "./utils";

// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = () => {};

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

            // TODO: view bookmarks
            console.log("yt");
        })
    } else {
        console.log("not yt");
        // This code will run if the user is not on a YT video watch page
        // and will update the Extension UI in order to inform the user
        let container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title"> This is not a YouTube video page.</div>';
    }
});