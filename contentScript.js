(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {type, value, videoId} = obj;

        if(type === "NEW"){
            currentVideo = videoId;
            newVideoLoaded();
        }
    });

    // newVideoLoaded function
    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        
        if(!bookmarkBtnExists){
            // Create Bookmark Button
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            // Get YT controls
            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            // Add Bookmark Button to left YT controls
            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    newVideoLoaded();
})();