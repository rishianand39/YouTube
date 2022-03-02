let menuIcon = document.querySelector(".menu-icon");
let sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");

menuIcon.onclick = function() {
    sidebar.classList.toggle("small-sidebar");
    container.classList.toggle("large-container");
};

function relatedVideos() {
    let input = document.querySelector("#userInput").value;
    console.log(input);
    localStorage.setItem("user-input", input);
    window.location.href = "list.html";
}

//---------------------YouTube Data Fetch----------------------------

let key = "AIzaSyBDOYBgOHZ9n4fgDx5sgTXSgrP-lt_BrO8";

const getData = async() => {
    try {
        let res = await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=50&key=${key}`
        );
        let data = await res.json();
        console.log(data);
        data.items.forEach(function(videoitems) {
            getChannelIcon(videoitems);
        });
    } catch (error) {
        console.log("err", error);
    }
};
getData();

const getChannelIcon = async(video_data) => {
    try {
        let res1 = await fetch(
            ` https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${video_data.snippet.channelId}&key=${key}`
        );
        let data1 = await res1.json();
        video_data["stat"] = data1.items[0];
        appendData(video_data);
    } catch (error) {
        console.log("err", error);
    }
};

const appendData = (videoData) => {
    let list_container = document.querySelector(".list-container");
    // console.log(videoData);

    let vid_div = document.createElement("div");

    // ------------------Storing video information in local storage-----------
    vid_div.addEventListener("click", () => {
        localStorage.setItem("videoArray", JSON.stringify(videoData));
        window.location.href = "playvideo.html";
    });
    vid_div.setAttribute("class", "video");
    let thumbnail = document.createElement("img");
    thumbnail.setAttribute("class", "thumbnail");
    thumbnail.src = videoData.snippet.thumbnails.medium.url;

    let info_div = document.createElement("div");
    info_div.setAttribute("class", "info");

    let icon = document.createElement("img");
    icon.src = videoData.stat.snippet.thumbnails.default.url;

    let title = document.createElement("p");

    title.textContent = videoData.snippet.title;

    info_div.append(icon, title);

    let channel = document.createElement("div");
    channel.setAttribute("class", "channel");
    let name = document.createElement("p");
    name.textContent = videoData.snippet.channelTitle;
    let views = document.createElement("p");
    views.textContent = `${Math.floor(
    Number(videoData.stat.statistics.viewCount) / 1000000
  )}K`;

    channel.append(name, views);
    vid_div.append(thumbnail, info_div, channel);
    list_container.append(vid_div);
};