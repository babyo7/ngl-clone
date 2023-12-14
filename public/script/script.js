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

function getRandomGradient() {
  const gradients = [
    "from-pink-500 via-red-500 to-yellow-500",
    "from-green-500 via-teal-500 to-blue-500",
    "from-purple-500 via-pink-500 to-red-500",
    "from-cyan-500 via-light-blue-500 to-blue-500",
    "from-yellow-500 via-orange-500 to-red-500",
    "from-indigo-500 via-blue-500 to-purple-500",
    "from-rose-500 via-pink-500 to-red-500",
    "from-amber-500 via-yellow-500 to-orange-500",
    "from-blue-500 via-light-blue-500 to-cyan-500",
    "from-emerald-500 via-green-500 to-teal-500",
  ];
  const randomGradient =
    gradients[Math.floor(Math.random() * gradients.length)];

  document.body.className = `bg-gradient-to-br ${randomGradient} bg-repeat`;
}
getRandomGradient();

form.addEventListener("submit", async (event) => {
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
