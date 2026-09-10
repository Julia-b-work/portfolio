document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  var form = this;
  var feedback = document.getElementById("form-feedback");
  var btn = form.querySelector("button");

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    feedback.textContent = "Please fill in all fields.";
    feedback.style.color = "#e94560";
    feedback.style.display = "block";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Sending...";

  var body = "name=" + encodeURIComponent(name)
    + "&email=" + encodeURIComponent(email)
    + "&message=" + encodeURIComponent(message);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/contact", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    var resp = JSON.parse(xhr.responseText);
    feedback.textContent = resp.success || resp.error;
    feedback.style.color = resp.success ? "#4caf50" : "#e94560";
    feedback.style.display = "block";
    btn.disabled = false;
    btn.textContent = "Send";
    if (resp.success) form.reset();
  };

  xhr.onerror = function () {
    feedback.textContent = "Connection error. Try again.";
    feedback.style.color = "#e94560";
    feedback.style.display = "block";
    btn.disabled = false;
    btn.textContent = "Send";
  };

  xhr.send(body);
});

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
