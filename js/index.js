import { updateConfig, drawCard, getName } from "./createCard.js";

const canvas = document.getElementById("canvas");

// Make it visually fill the positioned parent
// canvas.style.width  = '100%';
// canvas.style.height = '100%';

const ctx = canvas.getContext("2d");

// Placeholder
ctx.fillStyle = "#800";
ctx.fillRect(0 , 0, canvas.width, canvas.height);

/* Event Listeners */
// Disables the download button while image is not built
const downloadbtn = document.getElementById("download");
downloadbtn.addEventListener("click", function(event) {
    if (downloadbtn.classList.contains("isDisabled")) {
        event.preventDefault();
    }
});

const changeType = document.getElementById("type");
changeType.addEventListener("change", function() {
    const prevType = document.getElementsByClassName("form-show");
    if (prevType.length > 0) {
        prevType[0].classList.remove("form-show");
        document.getElementById("form").reset();
        downloadbtn.classList.add("isDisabled");
    }

    updateConfig("type", this.value);
    const type = document.getElementById(this.value);
    type.classList.add("form-show");    
});

const uploadArt = document.getElementById("art");
uploadArt.addEventListener("change", function() {
    const reader = new FileReader();
    reader.onload = () => {
        updateConfig("art", reader.result);
    }
    if (this.files.length > 0) {
        reader.readAsDataURL(this.files[0]);
    }
}, false)

/* Exposed functions */

export function submit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const data = new FormData(document.getElementById('form'));
    for (const [key, value] of data.entries()) {
        updateConfig(key, value);
    }

    drawCard(ctx).then(() => {
        downloadbtn.classList.remove("isDisabled");
    })
}

export function download (el) {
    if (!downloadbtn.classList.contains("isDisabled")) {
        const image = canvas.toDataURL("image/jpg");
        el.download = getName();
        el.href = image;
    }
}
