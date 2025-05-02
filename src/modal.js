const modal = document.getElementById("modal");

const openBtn = document.querySelector(".open-btn");
const  closeBtn = document.querySelector(".close-btn")
openBtn.addEventListener("click", ()=>{
    modal.showModal()
})

closeBtn.addEventListener("click", ()=>{
    modal.close();
})


const textArea = document.querySelector(".text-area");
const characterCounter = document.querySelector(".character-counter");


const maxLength = parseInt(textArea.getAttribute("maxlength"));

textArea.addEventListener("input", ()=>{
    let remainingChars = maxLength- textArea.value.length 
    if (remainingChars <= 50) {
        characterCounter.style.color = "red";
    }
    else if (remainingChars>=50){
        characterCounter.style.color = "white"
    }
    characterCounter.textContent= remainingChars
})


