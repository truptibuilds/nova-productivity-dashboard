/* ===============================
   NOVA — PERSONAL DASHBOARD
================================ */


/* ===============================
   CLOCK & DATE
================================ */

function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const date = now.toLocaleDateString([], {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    document.getElementById("clock").textContent = time;
    document.getElementById("date").textContent = date;
}

setInterval(updateClock, 1000);
updateClock();


/* ===============================
   DYNAMIC GREETING
================================ */

function updateGreeting() {
    const hour = new Date().getHours();

    let greeting;

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }

    document.getElementById("greeting").textContent = greeting;
}

updateGreeting();


/* ===============================
   DAILY QUOTE
================================ */

const quotes = [
    "Small progress is still progress.",
    "Consistency beats motivation.",
    "Focus on what you can control.",
    "Start where you are. Keep moving.",
    "Your future is built by what you do today.",
    "Discipline creates freedom.",
    "One productive day can change your week."
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);

    document.getElementById("quote").textContent =
        `"${quotes[randomIndex]}"`;
}

showRandomQuote();


/* ===============================
   TASK MANAGEMENT
================================ */

let tasks = JSON.parse(localStorage.getItem("novaTasks")) || [];


/* SAVE TASKS */

function saveTasks() {
    localStorage.setItem("novaTasks", JSON.stringify(tasks));
}


/* ===============================
   RENDER TASKS
================================ */

function renderTasks() {

    const taskLists = [
        document.getElementById("taskList"),
        document.getElementById("taskListPage")
    ];

    taskLists.forEach(list => {

        if (!list) return;

        list.innerHTML = "";

        if (tasks.length === 0) {

            const emptyMessage = document.createElement("li");

            emptyMessage.textContent = "No tasks yet. Add something to get started.";
            emptyMessage.style.color = "var(--muted)";
            emptyMessage.style.fontSize = "13px";
            emptyMessage.style.padding = "15px 4px";

            list.appendChild(emptyMessage);

            return;
        }


        tasks.forEach(task => {

            const li = document.createElement("li");

            li.className = "task-item";

            if (task.completed) {
                li.classList.add("completed");
            }


            /* CHECKBOX */

            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", () => {

                task.completed = checkbox.checked;

                saveTasks();
                renderTasks();
                updateProgress();
                updateStatistics();
                updateChart();

            });


            /* TASK TEXT */

            const text = document.createElement("span");

            text.className = "task-text";
            text.textContent = task.text;


            /* DELETE BUTTON */

            const deleteButton = document.createElement("button");

            deleteButton.className = "delete-task";
            deleteButton.textContent = "×";

            deleteButton.title = "Delete task";

            deleteButton.addEventListener("click", () => {

                tasks = tasks.filter(item => item.id !== task.id);

                saveTasks();
                renderTasks();
                updateProgress();
                updateStatistics();
                updateChart();

            });


            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(deleteButton);

            list.appendChild(li);

        });

    });
}


/* ===============================
   ADD TASK
================================ */

function addTask(inputElement) {

    const text = inputElement.value.trim();

    if (text === "") {
        return;
    }


    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };


    tasks.push(newTask);

    saveTasks();

    inputElement.value = "";

    renderTasks();
    updateProgress();
    updateStatistics();
    updateChart();
}


/* HOME TASK BUTTON */

document.getElementById("addTaskBtn").addEventListener("click", () => {

    addTask(document.getElementById("taskInput"));

});


/* HOME ENTER KEY */

document.getElementById("taskInput").addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask(document.getElementById("taskInput"));
    }

});


/* TASK PAGE BUTTON */

document.getElementById("addTaskBtnPage").addEventListener("click", () => {

    addTask(document.getElementById("taskInputPage"));

});


/* TASK PAGE ENTER KEY */

document.getElementById("taskInputPage").addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask(document.getElementById("taskInputPage"));
    }

});


/* ===============================
   PRODUCTIVITY PROGRESS
================================ */

function updateProgress() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;


    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }


    const progress = document.getElementById("progress");
    const progressText = document.getElementById("progressText");

    if (progress) {
        progress.style.width = `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }
}


/* ===============================
   STATISTICS
================================ */

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;


    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }


    /* STAT CARDS */

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("pendingTasks").textContent = pending;


    /* COMPLETION */

    document.getElementById("completionPercentage").textContent =
        `${percentage}%`;

    document.getElementById("statisticsProgress").style.width =
        `${percentage}%`;

    document.getElementById("completedLabel").textContent =
        `${completed} completed`;

    document.getElementById("totalLabel").textContent =
        `${total} total`;


    /* STATUS */

    const status = document.getElementById("productivityStatus");

    const message = document.getElementById("productivityMessage");


    if (total === 0) {

        status.textContent = "Ready to start";

        message.textContent =
            "Add a task and start making progress.";

    } else if (percentage === 100) {

        status.textContent = "All tasks completed 🎉";

        message.textContent =
            "Excellent work. Everything on your list is complete.";

    } else if (percentage >= 70) {

        status.textContent = "Great progress";

        message.textContent =
            "You're almost there. Keep going.";

    } else if (percentage >= 40) {

        status.textContent = "Good momentum";

        message.textContent =
            "You're making progress. Stay consistent.";

    } else {

        status.textContent = "Getting started";

        message.textContent =
            "Keep working through your tasks one by one.";
    }
}


/* ===============================
   PRODUCTIVITY CHART
================================ */

let productivityChart = null;


function createChart() {

    const canvas = document.getElementById("productivityChart");

    if (!canvas) return;


    const ctx = canvas.getContext("2d");


    productivityChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Completed",
                "Pending"
            ],

            datasets: [
                {
                    data: [0, 0],

                    backgroundColor: [
                        "#7c5cff",
                        "#2b3348"
                    ],

                    borderColor: "transparent",

                    borderWidth: 0,

                    hoverOffset: 8
                }
            ]
        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "70%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        color: getComputedStyle(
                            document.body
                        ).getPropertyValue("--text"),

                        padding: 20,

                        usePointStyle: true,

                        font: {
                            family: "Inter",
                            size: 12
                        }
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return ` ${context.label}: ${context.raw}`;

                        }

                    }
                }

            }
        }

    });

    updateChart();
}


/* UPDATE CHART */

function updateChart() {

    if (!productivityChart) return;


    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = tasks.length - completed;


    productivityChart.data.datasets[0].data = [
        completed,
        pending
    ];


    productivityChart.options.plugins.legend.labels.color =
        getComputedStyle(document.body)
            .getPropertyValue("--text");


    productivityChart.update();
}


/* ===============================
   THEME
================================ */

function setTheme(theme) {

    if (theme === "light") {

        document.body.classList.add("light-mode");

    } else {

        document.body.classList.remove("light-mode");

    }

    localStorage.setItem("novaTheme", theme);

    updateChart();
}


/* LOAD SAVED THEME */

const savedTheme = localStorage.getItem("novaTheme") || "dark";

setTheme(savedTheme);


/* THEME BUTTON */

document.getElementById("themeToggle").addEventListener(
    "click",
    () => {

        const isLight =
            document.body.classList.contains("light-mode");

        setTheme(isLight ? "dark" : "light");

    }
);


/* SETTINGS THEME BUTTON */

document.getElementById("settingsThemeBtn").addEventListener(
    "click",
    () => {

        const isLight =
            document.body.classList.contains("light-mode");

        setTheme(isLight ? "dark" : "light");

    }
);


/* ===============================
   CLEAR TASKS
================================ */

document.getElementById("clearTasksBtn").addEventListener(
    "click",
    () => {

        if (tasks.length === 0) {
            return;
        }


        const confirmed = confirm(
            "Are you sure you want to delete all tasks?"
        );


        if (!confirmed) {
            return;
        }


        tasks = [];

        saveTasks();

        renderTasks();
        updateProgress();
        updateStatistics();
        updateChart();

    }
);


/* ===============================
   SIDEBAR NAVIGATION
================================ */

const navItems = document.querySelectorAll(".nav-item");

const sections = document.querySelectorAll(".page-section");


navItems.forEach(item => {

    item.addEventListener("click", () => {

        const targetSection = item.dataset.section;


        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");


        sections.forEach(section => {

            section.classList.remove("active-section");

            if (section.id === targetSection) {
                section.classList.add("active-section");
            }

        });

    });

});


/* ===============================
   WEATHER
================================ */

function getWeatherDescription(code) {

    const descriptions = {

        0: "Clear sky",

        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",

        45: "Foggy",
        48: "Rime fog",

        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",

        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",

        71: "Slight snowfall",
        73: "Moderate snowfall",
        75: "Heavy snowfall",

        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",

        95: "Thunderstorm",

        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };


    return descriptions[code] || "Unknown weather";
}


/* WEATHER ICON */

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if ([1, 2].includes(code)) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if ([45, 48].includes(code)) {
        return "🌫️";
    }

    if (
        [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
    ) {
        return "🌧️";
    }

    if (
        [71, 73, 75].includes(code)
    ) {
        return "❄️";
    }

    if (
        [95, 96, 99].includes(code)
    ) {
        return "⛈️";
    }

    return "🌤️";
}


/* SEARCH WEATHER */

async function searchWeather() {

    const cityInput = document.getElementById("cityInput");

    const city = cityInput.value.trim();


    if (city === "") {
        return;
    }


    const result = document.getElementById("weatherResult");

    result.style.opacity = "0.5";


    try {

        /* FIND CITY */

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );


        const geoData = await geoResponse.json();


        if (!geoData.results || geoData.results.length === 0) {

            alert("City not found. Please try another city.");

            result.style.opacity = "1";

            return;
        }


        const location = geoData.results[0];


        /* GET WEATHER */

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );


        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        /* UPDATE WEATHER */

        document.getElementById("weatherCity").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("weatherDescription").textContent =
            getWeatherDescription(current.weather_code);

        document.querySelector(".weather-icon").textContent =
            getWeatherIcon(current.weather_code);

        document.getElementById("temperature").textContent =
            Math.round(current.temperature_2m);

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;


        /* HOME WEATHER */

        document.getElementById("homeWeather").innerHTML =
            `${getWeatherIcon(current.weather_code)} &nbsp;
            ${Math.round(current.temperature_2m)}°C
            · ${getWeatherDescription(current.weather_code)}
            · ${location.name}`;


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load weather right now. Please check your internet connection."
        );

    }


    result.style.opacity = "1";
}


/* WEATHER BUTTON */

document.getElementById("weatherBtn").addEventListener(
    "click",
    searchWeather
);


/* WEATHER ENTER KEY */

document.getElementById("cityInput").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            searchWeather();
        }

    }
);


/* ===============================
   INITIALIZE
================================ */

renderTasks();

updateProgress();

updateStatistics();

createChart();