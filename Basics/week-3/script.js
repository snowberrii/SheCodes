function shopNow() {
  let name = prompt(`What is your name?`);
  let userEmail = prompt(`What is your email?`);
  let correctEmailFormat = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;

  if (userEmail.match(correctEmailFormat)) {
    alert(
      `Thank you ${name} for your interest! An email has been sent to you.`
    );
  } else {
    alert(`Sorry ${name}! You have enter an invalid email. Please try again.`);
  }
}

let shopNowBtn = document.querySelector(".shop-now-btn");
shopNowBtn.addEventListener("click", shopNow);
