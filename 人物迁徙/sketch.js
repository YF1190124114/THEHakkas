let imgs = [];
let imgCount = 30;
let placeholderColors;
let scaleFactor;
let scrollOffset = 0;
let canvasWidth = 1920;
let canvasHeight = 1080;
let totalWidth = canvasWidth * 3; // 三倍宽度

function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleFactor = min(windowWidth / canvasWidth, windowHeight / canvasHeight);

  rectMode(CENTER);
  imageMode(CENTER);
  noStroke();

  placeholderColors = ['#E57373', '#64B5F6', '#81C784', '#FFD54F', '#BA68C8', '#4DB6AC'];

  // 在整个画布范围内创建图片，确保无缝分布
  let totalImgCount = imgCount * 3; // 总共90张图片
  
  for (let i = 0; i < totalImgCount; i++) {
    let img = {
      color: random(placeholderColors),
      w: 64,
      h: 256,
      scale: random(0.8, 1.2),
      targetScale: null,
      x: 0,
      y: canvasHeight - random(135, 270),
      originalX: 0,
      moveOffset: 0,
      movingBack: false
    };
    imgs.push(img);
  }

  // 在整个画布范围内均匀分布图片
  let startX = canvasWidth / 2;
  imgs[0].x = startX;
  imgs[0].originalX = startX;

  for (let i = 1; i < imgs.length; i++) {
    let spacing = random(0, 32);
    let prev = imgs[i - 1];
    let offset = (prev.w * prev.scale) / 2 + (imgs[i].w * imgs[i].scale) / 2 + spacing;
    imgs[i].x = prev.x + offset;
    imgs[i].originalX = imgs[i].x;
  }

  // 反向调整，确保图片分布更均匀
  for (let i = imgs.length - 2; i >= 0; i--) {
    let spacing = random(-32, 128);
    let next = imgs[i + 1];
    let offset = (next.w * next.scale) / 2 + (imgs[i].w * imgs[i].scale) / 2 + spacing;
    imgs[i].x = next.x - offset;
    imgs[i].originalX = imgs[i].x;
  }
}

function draw() {
  background(255);
  push();
  scale(scaleFactor);
  
  // 应用滚动偏移
  translate(-scrollOffset, (height / scaleFactor - canvasHeight) / 2);

  let hoveredIndex = -1;

  // 将鼠标坐标转换成逻辑坐标（考虑滚动偏移）
  let mx = (mouseX / scaleFactor + scrollOffset) - (width / scaleFactor - canvasWidth) / 2;
  let my = mouseY / scaleFactor - (height / scaleFactor - canvasHeight) / 2;

  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    let halfW = (img.w * img.scale) / 2;
    let halfH = (img.h * img.scale) / 2;
    if (
      mx > img.x - halfW &&
      mx < img.x + halfW &&
      my > img.y - halfH &&
      my < img.y + halfH
    ) {
      hoveredIndex = i;
    }
  }

  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];

    // 缩放逻辑
    if (i === hoveredIndex) {
      img.targetScale = 1.5;
    } else {
      img.targetScale = img.movingBack ? img.scale : img.originalScale || img.scale;
    }

    if (!img.originalScale) {
      img.originalScale = img.scale;
    }

    img.scale = lerp(img.scale, img.targetScale, 0.1);

    if (i === hoveredIndex) {
      for (let j = 0; j < imgs.length; j++) {
        if (j === i) continue;
        let other = imgs[j];
        let dx = other.x - img.x;
        if (abs(dx) < 256) {
          let direction = dx > 0 ? 1 : -1;
          let targetOffset = direction * random(128, 256);
          other.moveOffset = lerp(other.moveOffset, targetOffset, 0.1);
          other.movingBack = false;
        }
      }
    }

    if (hoveredIndex === -1 && !img.movingBack && img.moveOffset !== 0) {
      img.movingBack = true;
    }

    if (img.movingBack) {
      img.moveOffset = lerp(img.moveOffset, 0, 0.1);
      if (abs(img.moveOffset) < 0.5) {
        img.moveOffset = 0;
        img.movingBack = false;
      }
    }

    let drawX = img.originalX + img.moveOffset;
    fill(img.color);
    rect(drawX, img.y, img.w * img.scale, img.h * img.scale);
    img.x = drawX;
  }

  pop();
}

// 鼠标滚轮事件处理
function mouseWheel(event) {
  let scrollSpeed = 100;
  scrollOffset += event.delta * scrollSpeed;
  
  // 限制滚动范围
  let maxScroll = totalWidth - canvasWidth;
  scrollOffset = constrain(scrollOffset, 0, maxScroll);
  
  return false; // 阻止默认滚动行为
}

// 自适应缩放
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleFactor = min(windowWidth / canvasWidth, windowHeight / canvasHeight);
}