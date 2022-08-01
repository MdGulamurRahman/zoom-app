const chatbox = document.getElementById('chat_box');
const chatButton = document.getElementById('chat_button');
const participantbox = document.getElementById('participant_box');
const participantButton = document.getElementById('participant_button');
const expandButton = document.querySelector('#expand');
const videoGrid = document.getElementById('video-grid');
// console.log(videoGrid.children);
// console.log([... videoGrid.children]);


chatButton.addEventListener('click', function (e) {
    const display = chatbox.style.display === 'none' ? 'block' : 'none';
    chatbox.style.display = display;
    participantbox.style.display = 'none';
});


participantButton.addEventListener('click', function (e) {
    const display = participantbox.style.display === 'block' ? 'none' : 'block';
    participantbox.style.display = display;
    chatbox.style.display = 'none';
    console.log(display);
});


[... videoGrid.children].forEach( el => {
      el.addEventListener('click', function (e) {
        // console.log(e.target);
          
          if (el.id === e.target.id) {
              console.log(el.id);
              const name = el.id;

              if (el.id) {
                  
              }
          } 
    })


});

//start video apps
var socket = io();
const video = document.getElementById("video")
const muteBtn = document.getElementById("muteBtn")
const cameraOff = document.getElementById("cameraOff")
const selectCam = document.getElementById("selectCam")
const selectMic = document.getElementById("selectMic");
const screenShare = document.getElementById("screenShare");

let mediaStream;
let mute = false;
let camera = true;
let currentCam;

async function getMedia(cameraId, micId){
    currentCam = cameraId === null ? currentCam : cameraId;
    const initialConstraints = {
        video: true,
        audio: true
    }
    const preferredVideoConstraints = {
        video: {deviceId: cameraId},
        audio: true
    }
    const videoOption = currentCam ? {deviceId: currentCam} : true;
    const preferredAudioConstraints = {
        video: videoOption,
        audio: {deviceId: micId}
    }
    try {
        mediaStream = await window.navigator.mediaDevices.getUserMedia(cameraId || micId ? cameraId? preferredVideoConstraints : preferredAudioConstraints : initialConstraints)
        displayMedia()
    } catch (error) {
        console.log(error);
    }
};
getMedia();
getAllCameras();
getAllMics()

function displayMedia(){
    video.srcObject = mediaStream;
    video.addEventListener("loadedmetadata", ()=>{
        video.play()
    })

};
//mute button
muteBtn.addEventListener("click", (e)=>{
    if(mute){
        mute = false;
        muteBtn.innerHTML = `
        <i  class="fas fa-microphone"></i>
        <span >Mute</span>
        `;
        mediaStream.getAudioTracks()
        .forEach(track => {
            track.enabled = true;
        })
    }else{
        mute = true;
        muteBtn.innerHTML = `
        <i class="fas fa-microphone-slash"></i>
        <span >Unmute</span>
        `;
        mediaStream.getAudioTracks()
        .forEach(track => {
            track.enabled = false;
        })
    }
});

//camera off
cameraOff.addEventListener("click", (e)=>{
    if(camera){
        camera = false;
        cameraOff.innerHTML = `
        <i class="fas fa-video-slash"></i>
        <span>On Video</span>
        `;
        mediaStream.getVideoTracks()
        .forEach(track=>{
            track.enabled = false;
        })
    }else{
        camera = true;
        cameraOff.innerHTML = `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
        `;
        mediaStream.getVideoTracks()
        .forEach(track=>{
            console.log(track);
            track.enabled =true
        })
    }
})


// get all cameras
async function getAllCameras(){
    const allDevices = await window.navigator.mediaDevices.enumerateDevices();
    allDevices.forEach(device =>{
        if(device.kind === "videoinput"){
            const anchor = document.createElement("a");
            anchor.style.fontSize = "14px"
            anchor.value = device.deviceId;
            anchor.textContent = device.label;
            
            selectCam.appendChild(anchor)
        }
    })
};


selectCam.addEventListener("input", (e)=>{
    const cameraId = e.target.value;
    getMedia(cameraId)
})

// get all audio
async function getAllMics(){
    const allDevices = await window.navigator.mediaDevices.enumerateDevices();
    allDevices.forEach(device =>{
        if(device.kind === "audioinput"){
            const anchor = document.createElement("a");
            anchor.style.fontSize = "14px"
            anchor.value = device.deviceId;
            anchor.textContent = device.label;
            
            selectMic.appendChild(anchor)
        }
    })
};

selectMic.addEventListener("input", (e)=>{
    const micId = e.target.value;
    getMedia(null, micId)
})

//screen share
async function getScreenMedia(){
    try {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: true
        });
        displayMedia()
    } catch (error) {
        console.log(error);
    }
}


screenShare.addEventListener("click", getScreenMedia);


// chatting area
const messages = document.querySelector(".messages")
let chat_message = document.getElementById("chat_message");
const participantsList = document.querySelector(".participants_list")
chat_message.addEventListener("keypress", (e)=>{
    console.log(e);
    if(e.key === "Enter"){
        getChatValue()
    }
})

function getChatValue(){
    const msgValue = chat_message.value;
    if(!msgValue) return;
    socket.emit("setName", msgValue, ()=>{
        console.log("sent");
    })
    const li = document.createElement("li");
    li.textContent = msgValue;
    messages.appendChild(li)
    
};

socket.on("get_active_users", (activeUsers)=>{
    msgValue.innerHTML = ""
    activeUsers.forEach(user =>{
        const li = document.createElement("li");
        li.textContent = user.name;
        li.dataset.id = user.id;
        participantsList.appendChild(li)
    })
})