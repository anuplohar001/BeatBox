let currFolder;
let currsongs = new Audio();
let a = document.getElementsByClassName("left");
let b = document.getElementsByClassName("right");
let c = document.getElementsByClassName("seekbar");
const token = "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";

function getname(names) {
    let newele = decodeURI(names);
    let temp = `https://raw.githubusercontent.com/anuplohar001/BeatBox/main/songs/${currFolder}/[SPOTIFY-DOWNLOADER.COM]`;
    let news = newele.replace(temp, " ");
    return news;
}

function updatesongname(currsongs) {
    let songname = document.getElementsByClassName("songname");
    let temp = getname(currsongs.src);
    songname[0].innerHTML = `${temp}`;
}

function secondsToMinutesSeconds(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    minutes = minutes.toString().padStart(2, '0');
    remainingSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

async function fetchSongs(folder) {
    currFolder = folder;
    try {
        let response = await fetch(`https://api.github.com/repos/anuplohar001/BeatBox/contents/songs/${folder}`);
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        let data = await response.json();

        let songs = [];
        data.forEach(item => {
            if (item.type === "file" && item.name.endsWith(".mp3")) {
                // Remove '[SPOTIFY-DOWNLOADER.COM]' from the song name
                let cleanName = item.name.replace(/\[SPOTIFY-DOWNLOADER\.COM\]/g, "").trim(); // Using regex to remove it
                songs.push({
                    name: decodeURIComponent(cleanName),  // Decode the song name
                    url: item.download_url  // Use download URL
                });
            }
        });
        console.log(songs);
        displaySongs(songs);
        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}



function displaySongs(songs) {
    let list = document.getElementById("lists");
    list.innerHTML = "";
    songs.forEach(song => {
        list.innerHTML += `<li> <img src="svg/music.svg" alt=""> ${song.name} </li>`;
    });
}

function playselect(songs) {
    let list = document.getElementById("lists");
    let x = list.getElementsByTagName("li");
    for (let i = 0; i < songs.length; i++) {
        x[i].addEventListener('click', () => {
            currsongs.src = songs[i].url;
            updatesongname(currsongs);
            currsongs.play();
            document.getElementById("play").src = "svg/pause.svg";
        });
    }
}

async function dynamicAlbums() {
    let song = await fetch(`https://api.github.com/repos/anuplohar001/BeatBox/contents/songs`,{headers: {
        "Authorization": `token ${token}`
    }});
    let respons = await song.json();
    let cardc = document.getElementsByClassName("cardcontain")[0];  // Correct element access
    respons.forEach(e => {
        if (e.name && e.type === "dir") {
            let fname = e.name;
            cardc.innerHTML += `<div data-folder="${fname}" class="flex card">
                            <img class="one" src="/songs/${fname}/cover.jpg" alt="">
                            <img class="two" src="svg/aplay.svg" alt="">
                            <div class="title">${fname} !</div>
                            <p>Hits to boost your mood and fill you with happened</p>
                        </div>`;
        }
    });
}

async function main() {
    let bar = document.getElementsByClassName("bar")[0];  // Correct element access
    let close = document.getElementsByClassName("close")[0];  // Correct element access
    let play = document.getElementById("play");
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    let songs = await fetchSongs("Arijit_Sing");
    let n = songs.length - 1;

    await dynamicAlbums();

    playselect(songs);
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let fName = item.currentTarget.dataset.folder;
            songs = await fetchSongs(fName);
            n = songs.length - 1;
            document.getElementById("aname").innerText = `Album Name : ${fName}`;
            playselect(songs);
            bar.style.background = 'yellow';
        });
    });

    play.addEventListener('click', () => {
        if (currsongs.paused) {
            play.src = "svg/pause.svg";
            if (!currsongs.src) {
                currsongs.src = songs[0].url;
                updatesongname(currsongs);
            }
            currsongs.play();
        } else {
            play.src = "svg/play.svg";
            currsongs.pause();
        }
    });

    prev.addEventListener('click', () => {
        let ind = songs.findIndex(song => song.url === currsongs.src);
        ind = Math.max(0, ind - 1);
        currsongs.src = songs[ind].url;
        currsongs.play();
        play.src = "svg/pause.svg";
        updatesongname(currsongs);
    });

    next.addEventListener('click', () => {
        let ind = songs.findIndex(song => song.url === currsongs.src);
        ind = Math.min(n, ind + 1);
        currsongs.src = songs[ind].url;
        currsongs.play();
        play.src = "svg/pause.svg";
        updatesongname(currsongs);
    });

    let seek = document.getElementsByClassName("seek")[0];  // Correct element access
    currsongs.addEventListener("timeupdate", e => {
        document.querySelector(".thumb").style.left = (currsongs.currentTime / currsongs.duration) * 100 + "%";
        document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(currsongs.duration)} / ${secondsToMinutesSeconds(currsongs.currentTime)}`;
    });

    seek.addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        currsongs.currentTime = (currsongs.duration * percent) / 100;
    });

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", e => {
        currsongs.volume = parseInt(e.target.value) / 100;
    });

    bar.addEventListener("click", () => {
        a[0].style.left = '0';  // Fixed typo 'a' instead of bar
    });
    close.addEventListener("click", () => {
        a[0].style.left = '-5000px';  // Fixed typo 'a' instead of close
    });
}

main();
