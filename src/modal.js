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

textArea.addEventListener("input", () => {
  // Prevent input beyond max length
  if (textArea.value.length > maxLength) {
    textArea.value = textArea.value.substring(0, maxLength);
  }

  let remainingChars = maxLength - textArea.value.length;

  // Change color if near limit
  if (remainingChars <= 50) {
    characterCounter.style.color = "red";
  } else {
    characterCounter.style.color = "white";
  }

  // Update the text content
  characterCounter.textContent = remainingChars;
});



