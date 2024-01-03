"use strict";

let message = document.querySelector(".message");
let form = document.querySelector("#form");
let dice = document.querySelector(".dice");
let loader = document.querySelector("#loader");
let senLabel = document.querySelector("#senLabel");
let send = document.querySelector("#send");
let id = document.querySelector("#id");
let suggestion = 0;
let diceContent = null;

fetch("../data/dice.json")
  .then((response) => response.json())
  .then((data) => {
    diceContent = data;
    dice.addEventListener("click", (e) => {
      message.value = diceContent[suggestion].text;
      suggestion++;
      console.log(suggestion, message.value);
    });
  })
  .catch((error) => {
    console.error(error);
  });



document.body.style.background = '#EC1187 linear-gradient(to bottom right, #EC1187 0%, #FF8D10 100%)';


send.addEventListener("click", async (event) => {
  if(!message.value.trim()){
    return
  }
  const loader = new Loader();
  loader.show();
  event.preventDefault();
  let fromData = {
    message: message.value,
    id: id.textContent,
  };

  fetch("/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fromData),
  })
    .then(async (response) => {
      if (!response.ok) {
        this.response = await response.json();
        throw new Error(this.response.error);
      }
      return response.json();
    })
    .then(() => {
      loader.hide();
    })
    .catch((error) => {
      console.log(error);
      alert(error.message);
      location.reload();
    });
});

function Loader() {
  this.show = () => {
    send.disabled = true;
    senLabel.style.display = "none";
    loader.style.display = "block";
  };
  this.hide = () => {
    loader.style.display = "none";
    senLabel.style.display = "block";
    senLabel.textContent = "Message Sent!";
    setTimeout(() => {
      send.disabled = false;
      message.value = '';
      senLabel.textContent = "Send another message";
    }, 1700);
  };
}
