import { createCard, getName, updateCommonConfig } from "./createCard.js";

// Creates the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Placeholder card back to show that canvas has been drawn
(() => {
    const cardback = new Image();
    cardback.onload = (() => {
        ctx.drawImage(cardback, 0, 0, cardback.width, cardback.height,
            0, 0, canvas.width, canvas.height);
    });
    cardback.src = "img/cardback.png";
})();


/* Event Listeners */
// Disables the download button while image is not built
const downloadbtn = document.getElementById("download");
downloadbtn.addEventListener("click", function(event) {
    if (downloadbtn.classList.contains("isDisabled")) {
        event.preventDefault();
    }
});

// Toggles between showing type specific inputs
// Clears values not shared between types
const changeType = document.getElementById("type");
changeType.addEventListener("change", function() {
    const prevType = document.getElementsByClassName("form-show");
    if (prevType.length > 0) {
        prevType[0].classList.remove("form-show");
        document.getElementById("type-form").reset();
        downloadbtn.classList.add("isDisabled");
    }

    updateCommonConfig("type", this.value);
    const type = document.getElementById(this.value);
    if (type) {
        type.classList.add("form-show");
    }
});

// Adds the uploaded art to the config
const uploadArt = document.getElementById("art");
uploadArt.addEventListener("change", function() {
    if (this.files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
            updateCommonConfig("art", reader.result);
        }
        reader.readAsDataURL(this.files[0]);
    }
}, false)

/* Exposed functions */

export function submit() {
    createCard(ctx).then(() => {
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
