let moodData = [];
let allData = [];
let timeStampsInMs = [];
let averages = [];

let values = []; // filled dynamically from latest mood entry

let weight = [
  1,  // Happiness
  1,  // Sleep
  1,  // Food
  1,  // Sanity
  1,  // Motivation
  -1, // Needy
  -1, // Depression
  -1  // Anxiety
];

let names = [
  "Happiness:",
  "Sleep:",
  "Food:",
  "Sanity:",
  "Motivation:",
  "Needy:",
  "Depression:",
  "Anxiety:",
];

let score = 0;

function setup() {
  createCanvas(800, 400);
  loadJSON(
    "https://script.google.com/macros/s/AKfycbyLMjJoLrxZt8PNgE6piS73hphFuIVnJPqh--tTXvXw5y-aazhDQDYza0qMRQJju465/exec",
    gotData
  );
}

function gotData(data) {
  console.log("Received data:", data);

  // Fill averages
  averages = data.averages;

  // Only keep the 20 most recent scores
  const allScores = data.scores || [];
  allData = allScores.slice(-20); // 👈 keeps last 20

  // Most recent mood entry
  const latest = data.status;

  // Fill values[] from most recent stats
  values = [
    Number(latest.Happiness),
    Number(latest.Sleep),
    Number(latest.Food),
    Number(latest.Sanity),
    Number(latest.Motivation),
    Number(latest.Needy),
    Number(latest.Depression),
    Number(latest.Anxiety),
  ];

  // If available, store timestamp and score for graphing
  if (latest.timestamp) {
    moodData.push({
      timestamp: latest.timestamp,
      Score: Number(latest.Score)
    });
  }
}

function draw() {
  background(255);
  textSize(18);
  fill(0);
  text("How am I doing?", 20, 26);

  if (values.length === 0 || !averages.Score) {
    text("Loading data...", 20, 60);
    return;
  }

  text("Last 7d:", 420, 42);

  // --- Calculate overall score ---
  score = 0;
  for (let i = 0; i < values.length; i++) {
    if (weight[i] < 0) {
      score += 10 - values[i];
    } else {
      score += values[i];
    }
  }
  score = round((score / (values.length * 10)) * 100);
  text("Score: " + score + "%", 250, 40);

  // --- Draw mood bars ---
  for (let i = 0; i < values.length; i++) {
    textSize(12);
    fill(0);
    text(names[i], 20, i * 40 + 60);
    text(values[i], 94, i * 40 + 60);

    fill(255);
    rect(20, i * 40 + 70, 360, 15, 5);

    // Bar color logic
    if (weight[i] < 0) {
      if (values[i] <= 3) fill(0, 255, 17);
      else if (values[i] <= 7) fill(247, 255, 0);
      else fill(255, 0, 0);
    } else {
      if (values[i] <= 3) fill(255, 0, 0);
      else if (values[i] < 7) fill(247, 255, 0);
      else fill(0, 255, 17);
    }

    rect(20, i * 40 + 70, (360 / 10) * values[i], 15, 5);
  }

  // --- Draw Averages ---
  fill(0);
  text("Average: " + round(averages.Score * 10) / 10, 260, 15);
  text("Average: " + round(averages.Happiness * 10) / 10, 260, 60);
  text("Average: " + round(averages.Sleep * 10) / 10, 260, 100);
  text("Average: " + round(averages.Food * 10) / 10, 260, 140);
  text("Average: " + round(averages.Sanity * 10) / 10, 260, 180);
  text("Average: " + round(averages.Motivation * 10) / 10, 260, 220);
  text("Average: " + round(averages.Needy * 10) / 10, 260, 260);
  text("Average: " + round(averages.Depression * 10) / 10, 260, 300);
  text("Average: " + round(averages.Anxiety * 10) / 10, 260, 340);

  // --- Draw Scores Graph (right side) ---
  drawGraph();
}

function drawGraph() {
  if (!allData || allData.length === 0) return;

  let graphX = 420;
  let graphY = 20;
  let graphWidth = 360;
  let graphHeight = 350;

  // Axis background
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(graphX, graphY, graphWidth, graphHeight);

  // Grid lines
  stroke(220);
  strokeWeight(1);
  for (let i = 0; i <= 10; i++) {
    let y = map(i, 0, 10, graphY, graphY + graphHeight);
    line(graphX, y, graphX + graphWidth, y);
  }

  // Plot line of scores
  noFill();
  stroke(0, 150, 255);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < allData.length; i++) {
    let x = map(i, 0, allData.length - 1, graphX, graphX + graphWidth);
    let y = map(allData[i], 0, 100, graphY + graphHeight, graphY);
    vertex(x, y);
  }
  endShape();

  // Axis labels
  fill(0);
  stroke(200,200,200);
  textSize(12);
  textAlign(RIGHT);
  for (let i = 0; i <= 10; i++) {
    let label = 100 - i * 10;
    let y = map(label, 0, 100, graphY + graphHeight, graphY);
    text(label, graphX - 5, y + 4);
  }

  textAlign(LEFT);
  text("Recent Scores", graphX, graphY - 5);
}
