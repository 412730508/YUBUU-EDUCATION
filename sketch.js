let initialStudents = [
  { name: "廖馗準", score: 0 }, { name: "蕭語銓", score: 0 }, { name: "李昕霓", score: 0 },
  { name: "羅言樂", score: 0 }, { name: "郭善正", score: 0 }, { name: "劉莉君", score: 0 },
  { name: "劉諒君", score: 0 }, { name: "葉明睿", score: 0 }, { name: "趙悅米", score: 0 },
  { name: "陳界安", score: 0 }, { name: "陳逸凡", score: 0 }, { name: "羅人緯", score: 0 },
  { name: "吳彥呈", score: 0 }, { name: "陳亦紘", score: 0 }, { name: "張晴晴", score: 0 },
  { name: "謝蕎安", score: 0 }, { name: "魏任紳", score: 0 }, { name: "劉樂君", score: 0 },
  { name: "徐苡豪", score: 0 }, { name: "劉芮彤", score: 0 }, { name: "蕭子昀", score: 0 },
  { name: "劉星甫", score: 0 }, { name: "梁重皿", score: 0 }, { name: "廖苡嫙", score: 0 },
  { name: "盧羿妏", score: 0 }, { name: "張宜卉", score: 0 }, { name: "謝東佑", score: 0 },
  { name: "劉晨佑", score: 0 }, { name: "沈宥廷", score: 0 }, { name: "周宜璇", score: 0 },
  { name: "吳奕霏", score: 0 }, { name: "許嘉珍", score: 0 }, { name: "林筱晴", score: 0 }
];

let groups = {
  '第一組': ["劉諒君", "葉明睿", "趙悅米", "陳界安", "陳逸凡", "羅人緯"],
  '第二組': ["廖馗準", "蕭語銓", "李昕霓", "羅言樂", "郭善正", "劉莉君"],
  '第三組': ["吳彥呈", "陳亦紘", "張晴晴", "謝蕎安", "魏任紳", "劉樂君"],
  '第四組': ["徐苡豪", "劉芮彤", "蕭子昀", "劉星甫", "梁重皿", "廖苡嫙"],
  '第五組': ["盧羿妏", "張宜卉", "謝東佑", "劉晨佑", "沈宥廷"],
  '第六組': ["周宜璇", "吳奕霏", "許嘉珍", "林筱晴"]
};

let students = [];
let selectedStudents = [];
let checkboxes = [];
let inputBox, addButton, deleteButton, confirmDeleteButton, backButton, stopButton, autoStopCheckbox, selectAllButton, numberOfDrawsSelect, colorChangeButton, modeSwitchButton, groupSelect;
let columns = 2;
let isDrawingLots = false;
let animationInterval;
let finalResult = false;
let autoStopEnabled = false;
let numberOfDraws = 5;
let colorChangeEnabled = false;
let mode = 'cyber'; 
let hueValue = 0;

function preload() {
  textFont('Monaco');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  students = [...initialStudents];

  inputBox = createInput('');
  styleInput(inputBox, 50, 100, 200, 40);

  addButton = createButton('增加學生');
  styleButton(addButton, 270, 100, 150, 40);
  addButton.mousePressed(addStudent);

  deleteButton = createButton('選擇要刪除的學生');
  styleButton(deleteButton, 50, 160, 200, 40);
  deleteButton.mousePressed(deleteStudents);

  confirmDeleteButton = createButton('確認刪除學生');
  styleButton(confirmDeleteButton, 270, 160, 200, 40);
  confirmDeleteButton.mousePressed(confirmPermanentDeletion);
  confirmDeleteButton.hide();

  backButton = createButton('返回');
  styleButton(backButton, 50, 220, 150, 40);
  backButton.mousePressed(goBack);
  backButton.hide();

  let drawButton = createButton('抽籤');
  styleButton(drawButton, width / 2 - 100, height - 120, 200, 40);
  drawButton.mousePressed(startDrawLots);

  stopButton = createButton('停止');
  styleButton(stopButton, width / 2 + 120, height - 120, 100, 40);
  stopButton.mousePressed(stopDrawLots);
  stopButton.hide();

  autoStopCheckbox = createCheckbox('自動停止', autoStopEnabled);
  styleCheckbox(autoStopCheckbox, width / 2 + 240, height - 120);

  selectAllButton = createButton('全部勾選');
  styleButton(selectAllButton, width - 250, height - 80, 200, 40);
  selectAllButton.mousePressed(selectAllStudents);

  numberOfDrawsSelect = createSelect();
  styleSelect(numberOfDrawsSelect, width - 500, 40);
  numberOfDrawsSelect.option('1');
  numberOfDrawsSelect.option('2');
  numberOfDrawsSelect.option('3');
  numberOfDrawsSelect.option('4');
  numberOfDrawsSelect.option('5');
  numberOfDrawsSelect.selected('5');
  numberOfDrawsSelect.changed(updateNumberOfDraws);

  colorChangeButton = createButton('開始變色');
  styleButton(colorChangeButton, width - 250, height - 140, 200, 40);
  colorChangeButton.mousePressed(toggleColorChange);

  modeSwitchButton = createButton('切換模式');
  styleButton(modeSwitchButton, width - 250, height - 200, 200, 40);
  modeSwitchButton.mousePressed(toggleMode);

  // 創建分組選擇下拉選單
  groupSelect = createSelect();
  styleSelect(groupSelect, 50, 300);
  groupSelect.option('選擇分組');
  for (let group in groups) {
    groupSelect.option(group);
  }
  groupSelect.changed(selectGroup);

  createCheckboxes();
}

function draw() {
  if (colorChangeEnabled) {
    hueValue = (hueValue + 0.5) % 360;  // 調整色相的增加速度
    colorMode(HSB, 360, 100, 100);
    let bgColor = color(hueValue, 100, 20);
    let textColor = color(hueValue, 100, 100);
    
    // 只在顏色改變時重新繪製背景和文字
    background(bgColor);
    fill(textColor);
    for (let i = 0; i < selectedStudents.length; i++) {
      textSize(30);
      textAlign(CENTER);
      text((i + 1) + " : " + selectedStudents[i].name, width / 2, 100 + i * 40);
    }
  } else {
    applyModeStyles();
    textSize(30);
    textAlign(CENTER);
    for (let i = 0; i < selectedStudents.length; i++) {
      text((i + 1) + " : " + selectedStudents[i].name, width / 2, 100 + i * 40);
    }
  }

  if (isDrawingLots) {
    runAnimation();
  } else if (finalResult) {
    displayFinalResult();
  }
}

function applyModeStyles() {
  if (mode === 'cyber') {
    background('#0d0d0d');
    fill('#00ffea');
  } else if (mode === 'default') {
    background('#ffffff');
    fill('#000000');  // 白色背景下使用黑色文字
  } else if (mode === 'modern') {
    background('#f0f0f0');
    fill('#333333');  // Dark gray text on light gray background
  }

  // Display the current mode at the top of the screen
  textSize(20);
  textAlign(LEFT);
  fill(150);
  text("模式: " + mode, 20, 30);
}

function createCheckboxes() {
  for (let checkbox of checkboxes) {
    checkbox.remove();
  }
  checkboxes = [];

  let rows = ceil(students.length / columns);

  for (let i = 0; i < students.length; i++) {
    let col = floor(i / rows);
    let row = i % rows;
    let xPos = width - 500 + col * 130;
    let yPos = 100 + row * 30;
    let checkbox = createCheckbox(students[i].name, false);
    styleCheckbox(checkbox, xPos, yPos);
    checkboxes.push(checkbox);
  }
}

function startDrawLots() {
  isDrawingLots = true;
  finalResult = false;
  stopButton.show();
  animationStartTime = millis();
  selectedStudents = [];
  animationInterval = setInterval(runAnimation, 100);

  if (autoStopEnabled) {
    setTimeout(() => {
      stopDrawLots();
    }, 3000);
  }
}

function stopDrawLots() {
  clearInterval(animationInterval);
  drawLots();
  isDrawingLots = false;
  finalResult = true;
  stopButton.hide();
}

function runAnimation() {
  let tempStudents = [];

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked()) {
      tempStudents.push(students[i]);
    }
  }

  if (tempStudents.length > 0) {
    selectedStudents = [];
    for (let i = 0; i < numberOfDraws; i++) {
      if (tempStudents.length === 0) break;
      let randomIndex = floor(random(tempStudents.length));
      selectedStudents.push(tempStudents[randomIndex]);
      tempStudents.splice(randomIndex, 1);
    }
  }

  if (!colorChangeEnabled) {
    applyModeStyles();
    textSize(30);
    textAlign(CENTER);
    for (let i = 0; i < selectedStudents.length; i++) {
      text((i + 1) + " : " + selectedStudents[i].name, width / 2, 100 + i * 40);
    }
  }
}

function drawLots() {
  let tempStudents = [];
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked()) {
      tempStudents.push(students[i]);
    }
  }
  if (tempStudents.length > 0) {
    selectedStudents = [];
    for (let i = 0; i < numberOfDraws; i++) {
      if (tempStudents.length === 0) break;
      let randomIndex = floor(random(tempStudents.length));
      selectedStudents.push(tempStudents[randomIndex]);
      tempStudents.splice(randomIndex, 1);
    }
  } else {
    selectedStudents = [];
  }
}

function displayFinalResult() {
  applyModeStyles();
  textSize(30);
  textAlign(CENTER);
  for (let i = 0; i < selectedStudents.length; i++) {
    text((i + 1) + " : " + selectedStudents[i].name, width / 2, 100 + i * 40);
  }
}

function addStudent() {
  let name = inputBox.value().trim();
  if (name !== '') {
    students.push({ name: name, score: 0 });
    inputBox.value('');
    createCheckboxes();
  }
}

function deleteStudents() {
  confirmDeleteButton.show();
  backButton.show();
}

function confirmPermanentDeletion() {
  for (let i = checkboxes.length - 1; i >= 0; i--) {
    if (checkboxes[i].checked()) {
      students.splice(i, 1);
    }
  }
  createCheckboxes();
  confirmDeleteButton.hide();
  backButton.hide();
}

function goBack() {
  confirmDeleteButton.hide();
  backButton.hide();
}

function toggleAutoStop() {
  autoStopEnabled = autoStopCheckbox.checked();
}

function selectAllStudents() {
  let allSelected = checkboxes.every(checkbox => checkbox.checked());

  for (let checkbox of checkboxes) {
    checkbox.checked(!allSelected);
  }
}

function updateNumberOfDraws() {
  numberOfDraws = int(numberOfDrawsSelect.value());
}

function toggleColorChange() {
  colorChangeEnabled = !colorChangeEnabled;
  if (colorChangeEnabled) {
    colorChangeButton.html('停止變色');
  } else {
    colorChangeButton.html('開始變色');
    // 關閉變色模式後，恢復當前模式的背景
    applyModeStyles();
  }
}

function toggleMode() {
  if (mode === 'cyber') {
    mode = 'default';
    modeSwitchButton.html('切換到賽博模式');
  } else if (mode === 'default') {
    mode = 'modern';
    modeSwitchButton.html('切換到默認模式');
  } else {
    mode = 'cyber';
    modeSwitchButton.html('切換到現代科技簡約風');
  }

  updateStylesForMode();
}

function updateStylesForMode() {
  if (mode === 'cyber') {
    styleButton(addButton, 270, 100, 150, 40, '#00ffea', '#0d0d0d');
    styleButton(deleteButton, 50, 160, 200, 40, '#00ffea', '#0d0d0d');
    styleButton(confirmDeleteButton, 270, 160, 200, 40, '#00ffea', '#0d0d0d');
    styleButton(backButton, 50, 220, 150, 40, '#00ffea', '#0d0d0d');
    styleButton(stopButton, width / 2 + 120, height - 120, 100, 40, '#00ffea', '#0d0d0d');
    styleButton(selectAllButton, width - 250, height - 80, 200, 40, '#00ffea', '#0d0d0d');
    styleButton(colorChangeButton, width - 250, height - 140, 200, 40, '#00ffea', '#0d0d0d');
    styleButton(modeSwitchButton, width - 250, height - 200, 200, 40, '#00ffea', '#0d0d0d');
  } else if (mode === 'default') {
    styleButton(addButton, 270, 100, 150, 40, '#00ff00', '#ffffff');
    styleButton(deleteButton, 50, 160, 200, 40, '#00ff00', '#ffffff');
    styleButton(confirmDeleteButton, 270, 160, 200, 40, '#00ff00', '#ffffff');
    styleButton(backButton, 50, 220, 150, 40, '#00ff00', '#ffffff');
    styleButton(stopButton, width / 2 + 120, height - 120, 100, 40, '#00ff00', '#ffffff');
    styleButton(selectAllButton, width - 250, height - 80, 200, 40, '#00ff00', '#ffffff');
    styleButton(colorChangeButton, width - 250, height - 140, 200, 40, '#00ff00', '#ffffff');
    styleButton(modeSwitchButton, width - 250, height - 200, 200, 40, '#00ff00', '#ffffff');
  } else if (mode === 'modern') {
    styleButton(addButton, 270, 100, 150, 40, '#ffffff', '#333333');
    styleButton(deleteButton, 50, 160, 200, 40, '#ffffff', '#333333');
    styleButton(confirmDeleteButton, 270, 160, 200, 40, '#ffffff', '#333333');
    styleButton(backButton, 50, 220, 150, 40, '#ffffff', '#333333');
    styleButton(stopButton, width / 2 + 120, height - 120, 100, 40, '#ffffff', '#333333');
    styleButton(selectAllButton, width - 250, height - 80, 200, 40, '#ffffff', '#333333');
    styleButton(colorChangeButton, width - 250, height - 140, 200, 40, '#ffffff', '#333333');
    styleButton(modeSwitchButton, width - 250, height - 200, 200, 40, '#ffffff', '#333333');
  }
}

function selectGroup() {
  let selectedGroup = groupSelect.value();
  for (let checkbox of checkboxes) {
    checkbox.checked(false); // 先取消所有勾選
  }
  if (groups[selectedGroup]) {
    for (let i = 0; i < checkboxes.length; i++) {
      if (groups[selectedGroup].includes(students[i].name)) {
        checkboxes[i].checked(true);
      }
    }
  }
}

function styleButton(button, x, y, width, height, textColor = '#00ffea', bgColor = '#0d0d0d') {
  button.position(x, y);
  button.size(width, height);
  button.style('font-size', '20px');
  button.style('background-color', bgColor);
  button.style('color', textColor);
  button.style('border', 'none');
  button.style('border-radius', '5px');
  button.style('cursor', 'pointer');
  button.style('text-shadow', `0 0 10px ${textColor}`);
}

function styleInput(input, x, y, width, height, textColor = '#00ffea', bgColor = '#0d0d0d', borderColor = '#00ffea') {
  input.position(x, y);
  input.size(width, height);
  input.style('font-size', '20px');
  input.style('background-color', bgColor);
  input.style('color', textColor);
  input.style('border', `2px solid ${borderColor}`);
  input.style('border-radius', '5px');
  input.style('padding', '5px');
  input.style('text-shadow', `0 0 10px ${textColor}`);
}

function styleCheckbox(checkbox, x, y, textColor = '#00ffea', textShadow = '0 0 10px #00ffea') {
  checkbox.position(x, y);
  checkbox.style('font-size', '16px');
  checkbox.style('color', textColor);
  checkbox.style('text-shadow', textShadow);
}

function styleSelect(select, x, y, textColor = '#00ffea', bgColor = '#0d0d0d', borderColor = '#00ffea') {
  select.position(x, y);
  select.style('font-size', '20px');
  select.style('background-color', bgColor);
  select.style('color', textColor);
  select.style('border', `2px solid ${borderColor}`);
  select.style('border-radius', '5px');
  select.style('padding', '5px');
  select.style('text-shadow', `0 0 10px ${textColor}`);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createCheckboxes();
}
