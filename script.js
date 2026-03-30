// FAQ Accordion
document.addEventListener("DOMContentLoaded", function () {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(question => {
        question.addEventListener("click", function () {
            const answer = this.nextElementSibling;

            if (answer.style.display === "block") {
                answer.style.display = "none";
            } else {
                answer.style.display = "block";
            }
        });
    });

    // Contact Form Validation
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const county = document.getElementById("county").value;
            const experience = document.getElementById("experience").value;
            const interest = document.getElementById("interest").value;
            const message = document.getElementById("message").value.trim();
            const formMessage = document.getElementById("formMessage");

            if (name === "") {
                formMessage.textContent = "Please enter your full name.";
                formMessage.style.color = "red";
                return;
            }

            if (!email.includes("@") || !email.includes(".")) {
                formMessage.textContent = "Please enter a valid email address.";
                formMessage.style.color = "red";
                return;
            }

            if (county === "") {
                formMessage.textContent = "Please choose your county.";
                formMessage.style.color = "red";
                return;
            }

            if (experience === "") {
                formMessage.textContent = "Please choose your experience level.";
                formMessage.style.color = "red";
                return;
            }

            if (interest === "") {
                formMessage.textContent = "Please select why you are interested in padel.";
                formMessage.style.color = "red";
                return;
            }

            if (message.length < 10) {
                formMessage.textContent = "Please enter a longer message.";
                formMessage.style.color = "red";
                return;
            }

            formMessage.textContent = "Thank you for your interest in Grow Padel Ireland!";
            formMessage.style.color = "green";
            contactForm.reset();
        });
    }
});

// Weather API using Open-Meteo
function getWeather(city) {
    const weatherResult = document.getElementById("weatherResult");

    const cityData = {
        Dublin: { lat: 53.3498, lon: -6.2603 },
        Cork: { lat: 51.8985, lon: -8.4756 },
        Galway: { lat: 53.2707, lon: -9.0568 }
    };

    const selectedCity = cityData[city];

    if (!selectedCity) {
        weatherResult.innerHTML = "<p>City not found.</p>";
        return;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;
            weatherResult.innerHTML = `
                <h3>${city}</h3>
                <p>Temperature: ${weather.temperature}°C</p>
                <p>Wind Speed: ${weather.windspeed} km/h</p>
                <p>This live weather feature helps players decide whether it is a good time for padel.</p>
            `;
        })
        .catch(error => {
            weatherResult.innerHTML = "<p>Sorry, weather data could not be loaded.</p>";
        });
}
const topBtn = document.getElementById("topBtn");

window.onscroll = function () {
    if (topBtn) {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    }
};

if (topBtn) {
    topBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
// Simple padel rally animation
document.addEventListener("DOMContentLoaded", function () {
    const ball = document.getElementById("ball");
    const court = document.getElementById("padelCourt");

    const leftTop = document.getElementById("playerLeftTop");
    const leftBottom = document.getElementById("playerLeftBottom");
    const rightTop = document.getElementById("playerRightTop");
    const rightBottom = document.getElementById("playerRightBottom");

    if (ball && court) {
        let ballX = 160;
        let ballY = 200;
        let speedX = 4;
        let speedY = 2;

        function animateRally() {
            const courtWidth = court.clientWidth;
            const courtHeight = court.clientHeight;

            ballX += speedX;
            ballY += speedY;

            // bounce top/bottom
            if (ballY <= 20 || ballY >= courtHeight - 20) {
                speedY *= -1;
            }

            // bounce left/right
            if (ballX <= 140 || ballX >= courtWidth - 140) {
                speedX *= -1;
            }

            // move ball
            ball.style.left = ballX + "px";
            ball.style.top = ballY + "px";

            // decide which player follows ball
            if (ballY < courtHeight / 2) {
                if (leftTop) leftTop.style.top = ballY + "px";
                if (rightTop) rightTop.style.top = ballY + "px";
            } else {
                if (leftBottom) leftBottom.style.top = ballY + "px";
                if (rightBottom) rightBottom.style.top = ballY + "px";
            }

            requestAnimationFrame(animateRally);
        }

        animateRally();
    }
});