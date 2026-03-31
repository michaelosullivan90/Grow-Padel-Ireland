// FAQ Accordion + Contact Form
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

    // Scroll to top button
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

            if (ballY <= 20 || ballY >= courtHeight - 20) {
                speedY *= -1;
            }

            if (ballX <= 140 || ballX >= courtWidth - 140) {
                speedX *= -1;
            }

            ball.style.left = ballX + "px";
            ball.style.top = ballY + "px";

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
        weatherResult.innerHTML = `
            <div class="weather-box">
                <p>City not found.</p>
            </div>
        `;
        return;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;

            weatherResult.innerHTML = `
                <div class="weather-box">
                    <h3>${city}</h3>
                    <p>Temperature: ${weather.temperature}°C</p>
                    <p>Wind Speed: ${weather.windspeed} km/h</p>
                    <p class="weather-source">Data provided by a live weather API.</p>
                </div>
            `;
        })
        .catch(error => {
            weatherResult.innerHTML = `
                <div class="weather-box">
                    <p>Sorry, weather data could not be loaded.</p>
                </div>
            `;
        });
}

let pointsA = 0;
let pointsB = 0;
let gamesA = 0;
let gamesB = 0;
let setsA = 0;
let setsB = 0;
let matchFinished = false;

const pointLabels = ["0", "15", "30", "40"];

function updateTeamNames() {
    const teamAInput = document.getElementById("teamAName");
    const teamBInput = document.getElementById("teamBName");
    const displayTeamA = document.getElementById("displayTeamA");
    const displayTeamB = document.getElementById("displayTeamB");

    if (teamAInput && displayTeamA) {
        displayTeamA.textContent = teamAInput.value.trim() || "Team A";
    }

    if (teamBInput && displayTeamB) {
        displayTeamB.textContent = teamBInput.value.trim() || "Team B";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const teamAInput = document.getElementById("teamAName");
    const teamBInput = document.getElementById("teamBName");

    if (teamAInput) {
        teamAInput.addEventListener("input", updateTeamNames);
    }

    if (teamBInput) {
        teamBInput.addEventListener("input", updateTeamNames);
    }

    updateTeamNames();
    renderScoreboard();
});

function addPoint(team) {
    if (matchFinished) return;

    if (team === "A") {
        pointsA++;
    } else {
        pointsB++;
    }

    handlePointLogic();
    renderScoreboard();
}

function handlePointLogic() {
    if (pointsA >= 3 && pointsB >= 3) {
        if (Math.abs(pointsA - pointsB) >= 2) {
            if (pointsA > pointsB) {
                winGame("A");
            } else {
                winGame("B");
            }
        }
    } else {
        if (pointsA >= 4) {
            winGame("A");
        } else if (pointsB >= 4) {
            winGame("B");
        }
    }
}

function winGame(team) {
    if (team === "A") {
        gamesA++;
    } else {
        gamesB++;
    }

    pointsA = 0;
    pointsB = 0;

    checkSetWinner();
}

function checkSetWinner() {
    if (gamesA >= 6 || gamesB >= 6) {
        if (Math.abs(gamesA - gamesB) >= 2) {
            if (gamesA > gamesB) {
                setsA++;
            } else {
                setsB++;
            }

            gamesA = 0;
            gamesB = 0;

            checkMatchWinner();
        }
    }
}

function checkMatchWinner() {
    const matchStatus = document.getElementById("matchStatus");
    const teamAName = document.getElementById("teamAName")?.value.trim() || "Team A";
    const teamBName = document.getElementById("teamBName")?.value.trim() || "Team B";

    if (setsA >= 1) {
        matchFinished = true;
        if (matchStatus) {
            matchStatus.textContent = `${teamAName} win the match!`;
        }
    } else if (setsB >= 1) {
        matchFinished = true;
        if (matchStatus) {
            matchStatus.textContent = `${teamBName} win the match!`;
        }
    }
}

function getPointDisplay(a, b, side) {
    if (a >= 3 && b >= 3) {
        if (a === b) return "Deuce";

        if (side === "A") {
            if (a === b + 1) return "Adv";
            if (a > b + 1) return "Game";
            return "";
        }

        if (side === "B") {
            if (b === a + 1) return "Adv";
            if (b > a + 1) return "Game";
            return "";
        }
    }

    return pointLabels[side === "A" ? a : b] || "0";
}

function renderScoreboard() {
    const scoreAEl = document.getElementById("scoreA");
    const scoreBEl = document.getElementById("scoreB");
    const gamesAEl = document.getElementById("gamesA");
    const gamesBEl = document.getElementById("gamesB");
    const setsAEl = document.getElementById("setsA");
    const setsBEl = document.getElementById("setsB");
    const matchStatus = document.getElementById("matchStatus");

    if (scoreAEl) scoreAEl.textContent = getPointDisplay(pointsA, pointsB, "A");
    if (scoreBEl) scoreBEl.textContent = getPointDisplay(pointsA, pointsB, "B");
    if (gamesAEl) gamesAEl.textContent = gamesA;
    if (gamesBEl) gamesBEl.textContent = gamesB;
    if (setsAEl) setsAEl.textContent = setsA;
    if (setsBEl) setsBEl.textContent = setsB;

    if (!matchFinished && matchStatus) {
        matchStatus.textContent = "Match in Progress";
    }

    updateTeamNames();
}

function resetScoreboard() {
    pointsA = 0;
    pointsB = 0;
    gamesA = 0;
    gamesB = 0;
    setsA = 0;
    setsB = 0;
    matchFinished = false;

    renderScoreboard();
}