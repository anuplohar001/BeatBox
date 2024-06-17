
let a = document.getElementsByClassName("left");
let b = document.getElementsByClassName("right");
let c = document.getElementsByClassName("seekbar");
let currFolder
let currsongs = new Audio();

function getname(names) {
    let newele = decodeURI(names);
    let temp = `https://github.com/anuplohar001/BeatBox/tree/c357a8a18aa0073ac03790311fba76574e8a5f3c/songs/${currFolder}/`;
    let news = newele.replace(temp, " ");
    return news;
}


function updatesongname(currsongs) {
    let songname = document.getElementsByClassName("songname")
    let temp = getname(currsongs.src)
    songname[0].innerHTML = `${temp}`;
}


function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    minutes = minutes.toString().padStart(2, '0');
    remainingSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder
    let song = await fetch(`https://github.com/anuplohar001/BeatBox/tree/c357a8a18aa0073ac03790311fba76574e8a5f3c/songs/${folder}/`);

    let respons = await song.text();
    let div = document.createElement("div");
    div.innerHTML = respons;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3"))
            songs.push(element.href);
    }
    console.log(songs)
    let list = document.getElementById("lists");
    list.innerHTML = " "
    for (let index = 0; index < songs.length; index++) {
        let element = songs[index];
        let newele = getname(element);
        list.innerHTML = list.innerHTML + `<li> <img src="svg\\music.svg" alt=""> ${newele} </li>`;
    }
    return songs
}

function playselect(songs) {
    let list = document.getElementById("lists")
    let x = list.getElementsByTagName("li")
    for (let i = 0; i < songs.length; i++) {
        x[i].addEventListener('click', () => {
            console.log(x[i])
            currsongs.src = songs[i];
            updatesongname(currsongs);
            currsongs.play();
            play.src = "svg\\pause.svg"
        })
    }
}

async function dynamicAlbums() {

    let song = await fetch(`https://github.com/anuplohar001/BeatBox/tree/c357a8a18aa0073ac03790311fba76574e8a5f3c/songs`);

    let respons = await song.text();
    let div = document.createElement("div");
    div.innerHTML = respons;
    let folders = Array.from(div.getElementsByTagName("a"))

    for (let index = 0; index < folders.length; index++) {
        const e = folders[index];
        if (e.href.includes("/songs/")) {
            let fname = e.href.split("/").slice(-1)[0]
            console.log(fname);
            let cardc = document.getElementsByClassName("cardcontain")
            cardc[0].innerHTML += `<div data-folder="${fname}" class="flex card">
                            <img class="one" src="/songs/${fname}/cover.jpg" alt="">
                            <img class="two" src="svg/aplay.svg" alt="">
                            <div class="title">${fname} !</div>
                            <p>Hits to boost your mood and fill you with happened</p>
                        </div>`
        }
    }
}


async function main() {

    let bar = document.getElementsByClassName("bar")
    let close = document.getElementsByClassName("close")
    let play = document.getElementById("play");
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    let songs = await getSongs("Arijit_Sing")
    let n = songs.length - 1;

    await dynamicAlbums()

    playselect(songs)
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", async item => {
            let fName = item.currentTarget.dataset.folder
            songs = await getSongs(`${fName}`)
            n = songs.length - 1;
            let aname = document.getElementById("aname")
            aname.innerText = `Album Name : ${fName}`
            playselect(songs)
            bar[0].style.background = 'yellow'
        })
    })

    play.addEventListener('click', () => {
        if (currsongs.paused) {
            play.src = "svg\\pause.svg";
            if (!currsongs.src) {
                currsongs.src = songs[0];
                updatesongname(currsongs);
            }
            currsongs.play();
        }
        else {
            play.src = "svg\\play.svg";
            currsongs.pause();
        }
    })

    //previous
    prev.addEventListener('click', () => {
        let ind = songs.indexOf(currsongs.src);
        ind = Math.max(0, ind - 1);
        currsongs.src = songs[ind];
        currsongs.play();
        play.src = "svg\\pause.svg";
        updatesongname(currsongs)
    })


    //next
    next.addEventListener('click', () => {
        let ind = songs.indexOf(currsongs.src);
        ind = Math.min(n, ind + 1);
        currsongs.src = songs[ind];
        console.log(n)
        currsongs.play();
        play.src = "svg\\pause.svg";
        updatesongname(currsongs)
    })

    let seek = document.getElementsByClassName("seek")
    currsongs.addEventListener("timeupdate", e => {
        document.querySelector(".thumb").style.left = (e.offsetX / e.target.getBoundingClientRect().width * 100) + "%";
        document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(currsongs.duration)} / ${secondsToMinutesSeconds(currsongs.currentTime)}`;
        document.querySelector(".thumb").style.left = (currsongs.currentTime / currsongs.duration) * 100 + "%";
    })

    seek[0].addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        document.querySelector(".thumb").style.left = (percent + "%");
        currsongs.currentTime = (currsongs.duration * percent) / 100;
    })

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", e => {
        currsongs.volume = parseInt(e.target.value) / 100
    })


    bar[0].addEventListener("click", () => {
        a[0].style.left = '0'
    })
    close[0].addEventListener("click", () => {
        a[0].style.left = '-5000px'
    })



}

main()

