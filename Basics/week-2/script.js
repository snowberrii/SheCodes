function updateH1(newH1) {
  let h1 = document.querySelector("h1");
  h1.innerHTML = newH1;
}

function changeCity() {
  let city = prompt("What city do you live in?");
  let temperature = prompt("What temperature is it?");

  if (temperature >= 40) {
    updateH1(`🥵 <br /> Currently ${temperature}&deg;C in ${city} `);
  } else {
    if (temperature >= 30) {
      updateH1(`🌞 <br /> Currently ${temperature}&deg;C in ${city} `);
    } else {
      if (temperature >= 20) {
        updateH1(`😊 <br /> Currently ${temperature}&deg;C in ${city} `);
      } else {
        if (temperature >= 0) {
          updateH1(`🥶 <br /> Currently ${temperature}&deg;C in ${city} `);
        } else {
          updateH1(`💀<br /> Currently ${temperature}&deg;C in ${city} `);
        }
      }
    }
  }
}

let changeCityButton = document.querySelector("button");
changeCityButton.addEventListener("click", changeCity);
