let imgs = [];
let imgCount = 15; // 减少元素数量
let placeholderColors;
let scaleFactor;
let scrollOffset = 0;
let canvasWidth = 1920;
let canvasHeight = 1080;
let totalWidth = canvasWidth * 5; // 五倍宽度

// 图层4：背景图
let imgBackground;
let backgroundLoaded = false;

// 添加图片变量数组
let imgArray = [];

// 打字效果变量
let typingTexts = [
  "第一次迁徙：东汉末年（约2世纪），黄巾起义和董卓之乱导致中原居民南迁，客家先民从黄河流域中原地区迁至江西南部和福建西部，开始形成客家群体。",
  "第二次迁徙：唐末（约9世纪），黄巢之乱和战争迫使大量中原人南迁，客家人再次从中原南移，主要到达今天的江西南部、福建西部和广东东部等地区。",
  "第三次迁徙：宋朝（12世纪），北方金朝入侵，特别是靖康之耻后，北方人大量南迁。客家人继续南移，定居于今广东、福建、江西等地。",
  "第四次迁徙：明朝初期（14世纪），北方战乱导致客家人等北方人开始南迁。特别是朱棣靖难之役后，客家人再次受战争影响迁往更南端的山区，主要是今福建、江西、广东交界的山区。",
  "第五次迁徙：清朝（17世纪），清朝建立后，特别是与南明对抗和后续农民起义，许多人从北方逃离。客家人受战争和政治迫害影响，进入广西、广东、福建等地，并开始迁往台湾、东南亚等地区。这也是客家人海外扩张的关键时期。"
];

let currentTypingText = "";
let shownText = "";
let index = 0;
let typing = false;
let lastTypedTime = 0;
let delay = 15;
let typingX = 0;
let typingY = 0;
let annotatedWords = [];

// 图层3：文本数组
let migrationTexts = [
  "The first migration",
  "(c. 2nd century AD)",
  "The second migration",
  "(c. 9th century AD)",
  "The third migration",
  "(12th century)",
  "The forth migration",
  "(14th century)",
  "The fifth migration",
  "(17th century)"
];

function preload() {
  // 加载背景图
  imgBackground = loadImage('imagbackground.jpg', 
    function() {
      backgroundLoaded = true;
      console.log('背景图加载成功');
    },
    function(err) {
      console.log('背景图加载失败:', err);
      backgroundLoaded = true; // 即使失败也继续
    }
  );
  
  // 加载6张图片
  imgArray[0] = loadImage('WechatIMG170.jpg');
  imgArray[1] = loadImage('WechatIMG171.jpg');
  imgArray[2] = loadImage('WechatIMG174.jpg');
  imgArray[3] = loadImage('WechatIMG175.jpg');
  imgArray[4] = loadImage('WechatIMG176.jpg'); 
  imgArray[5] = loadImage('WechatIMG177.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleFactor = min(windowWidth / canvasWidth, windowHeight / canvasHeight);

  rectMode(CENTER);
  imageMode(CENTER);
  noStroke();
  
  // 设置鼠标样式为更大的图标
  cursor('pointer');

  placeholderColors = ['#E57373', '#64B5F6', '#81C784', '#FFD54F', '#BA68C8', '#4DB6AC'];

  // 在整个画布范围内创建图片，确保无缝分布
  let totalImgCount = imgCount * 5; // 总共75张图片（减少数量）
  
  for (let i = 0; i < totalImgCount; i++) {
    let img = {
      color: random(placeholderColors),
      w: 128, // 增加宽度从64到128
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
    let spacing = random(-16, 16); // 减少间距范围从(0,32)到(-16,16)
    let prev = imgs[i - 1];
    let offset = (prev.w * prev.scale) / 2 + (imgs[i].w * imgs[i].scale) / 2 + spacing;
    imgs[i].x = prev.x + offset;
    imgs[i].originalX = imgs[i].x;
  }

  // 反向调整，确保图片分布更均匀
  for (let i = imgs.length - 2; i >= 0; i--) {
    let spacing = random(-64, 64); // 减少间距范围从(-32,128)到(-64,64)
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

  // 图层4：背景图（最底层）
  if (backgroundLoaded && imgBackground) {
    // 绘制背景图，覆盖整个画布宽度
    for (let i = 0; i < 5; i++) {
      image(imgBackground, i * canvasWidth + canvasWidth/2, canvasHeight/2, canvasWidth, canvasHeight);
    }
  }

  // 图层3：文本（第三层）
  push();
  textAlign(LEFT, TOP);
  textSize(24);
  textFont('Arial');
  fill(0, 0, 0, 100); // 70%透明度 (255 * 0.7 = 178)
  // 计算文本间距，等距分布
  let textSpacing = totalWidth / (migrationTexts.length + 1);
  
  // 计算文本Y位置：屏幕高度的1/20
  let textY = 1040;
  
  for (let i = 0; i < migrationTexts.length; i++) {
    let x = textSpacing * (i + 1)-900;
    text(migrationTexts[i], x, textY);
  }
  pop();

  // 图层2：现有元素（第二层）
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
    
    // 用6张图片循环替换所有彩色方块
    let imgIndex = i % 6; // 循环使用6张图片
    if (imgArray[imgIndex]) {
      image(imgArray[imgIndex], drawX, img.y, img.w * img.scale, img.h * img.scale);
    } else {
      fill(img.color);
      rect(drawX, img.y, img.w * img.scale, img.h * img.scale);
    }
    
    img.x = drawX;
  }

  // 打字效果处理
  handleTyping();
  // 绘制带注释的文本
  drawTextWithAnnotations();

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

// 鼠标点击事件处理
function mousePressed() {
  // 将鼠标坐标转换成逻辑坐标（考虑滚动偏移）
  let mx = (mouseX / scaleFactor + scrollOffset) - (width / scaleFactor - canvasWidth) / 2;
  let my = mouseY / scaleFactor - (height / scaleFactor - canvasHeight) / 2;
  
  // 检查是否点击了图片
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
      // 根据图片索引选择对应的文本
      let imgIndex = i % 6;
      if (imgIndex < 5) { // 只处理前5张图片
        currentTypingText = typingTexts[imgIndex];
        typing = true;
        index = 0;
        shownText = "";
        annotatedWords = [];
        
        // 设置打字位置在图片正上方
        typingX = img.x;
        typingY = img.y - halfH - 100; // 图片上方100像素（从50增加到100）
        
        console.log("点击了图片", imgIndex, "开始打字效果");
      } else {
        // 如果点击的是第6张图片，停止打字效果
        typing = false;
        shownText = "";
        annotatedWords = [];
      }
      return;
    }
  }
  
  // 检查是否点击了文字区域
  if (typing && shownText) {
    let chars = shownText.split("");
    let x = typingX - 200;
    let y = typingY;
    let lineHeight = 30;
    let charCount = 0;
    
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      let w = textWidth(char);
      
      // 每30个字符换行
      if (charCount >= 30 && char === ' ') {
        x = typingX - 200;
        y += lineHeight;
        charCount = 0;
        continue;
      }
      
      // 检查是否需要换行
      if (x + w > typingX + 200) {
        x = typingX - 200;
        y += lineHeight;
      }
      
      // 检查鼠标是否点击了这个字符
      if (
        mx > x && mx < x + w &&
        my > y - 20 && my < y + 10
      ) {
        // 只圈注这个单个字符
        let clickedChar = char;
        if (!annotatedWords.includes(clickedChar)) {
          annotatedWords.push(clickedChar);
          console.log("为字符添加注释:", clickedChar);
        }
        break;
      }
      
      x += w;
      charCount++;
    }
  }
}

// 打字效果处理函数
function handleTyping() {
  if (typing && index < currentTypingText.length) {
    let currentTime = millis();
    if (currentTime - lastTypedTime > delay) {
      shownText += currentTypingText.charAt(index);
      index++;
      lastTypedTime = currentTime;
      
      // 每打出一个空格，有概率生成一个"批注"
      if (currentTypingText.charAt(index) === ' ' && random() < 0.1) {
        let startIdx = max(0, index - int(random(3, 7)));
        let endIdx = index;
        let annotation = shownText.substring(startIdx, endIdx);
        if (!annotatedWords.includes(annotation)) {
          annotatedWords.push(annotation);
        }
      }
    }
  }
}

// 绘制带注释的文本
function drawTextWithAnnotations() {
  if (!typing || !shownText) return;
  
  push();
  textAlign(LEFT, TOP);
  textSize(16);
  textLeading(24);
  
  let x = typingX - 200; // 文本起始位置
  let y = typingY;
  let charCount = 0; // 字符计数
  let lineHeight = 30;
  
  // 将文本按字符分割
  let chars = shownText.split("");
  
  for (let i = 0; i < chars.length; i++) {
    let char = chars[i];
    let w = textWidth(char);
    
    // 每30个字符换行
    if (charCount >= 30 && char === ' ') {
      x = typingX - 200;
      y += lineHeight;
      charCount = 0;
      continue;
    }
    
    // 检查是否需要换行（超出宽度）
    if (x + w > typingX + 200) {
      x = typingX - 200;
      y += lineHeight;
    }
    
    // 绘制字符
    noStroke();
    fill(0, 0, 0, 200); // 半透明黑色
    
    // 检查是否为数字（包括汉字数字），如果是则加粗
    let isNumber = /[0-9一二三四五六七八九十]/.test(char);
    if (isNumber) {
      textStyle(BOLD);
      textSize(18); // 数字稍大一些
    } else {
      textStyle(NORMAL);
      textSize(16);
    }
    
    text(char, x, y);
    
    // 检查这个字符是否在注释范围内
    for (let annotation of annotatedWords) {
      if (annotation === char) {
        // 如果是被注释的单个字符，加圈
        noFill();
        stroke(0, 100, 255);
        strokeWeight(2);
        ellipse(x + w/2, y - 20, w + 10, 30);
        break;
      } else if (annotation.length > 1) {
        // 如果是被注释的字符片段，检查是否包含当前字符
        let startIdx = shownText.indexOf(annotation);
        let endIdx = startIdx + annotation.length;
        if (i >= startIdx && i < endIdx) {
          // 如果是被注释的词，加圈
          noFill();
          stroke(0, 100, 255);
          strokeWeight(2);
          ellipse(x + w/2, y - 20, w + 10, 30);
          break;
        }
      }
    }
    
    x += w;
    charCount++;
  }
  
  // 绘制红色十字指引符
  if (typing) { // 移除 index < currentTypingText.length 的条件
    let chars = shownText.split("");
    let x = typingX - 200;
    let y = typingY;
    let charCount = 0;
    
    // 计算最后一个字符的位置
    for (let i = 0; i < chars.length; i++) {
      let char = chars[i];
      let w = textWidth(char);
      
      // 每30个字符换行
      if (charCount >= 30 && char === ' ') {
        x = typingX - 200;
        y += lineHeight;
        charCount = 0;
        continue;
      }
      
      // 检查是否需要换行
      if (x + w > typingX + 200) {
        x = typingX - 200;
        y += lineHeight;
      }
      
      x += w;
      charCount++;
    }
    
    // 绘制红色十字
    stroke(255, 0, 0);
    strokeWeight(2);
    line(x - 8, y - 8, x + 8, y + 8);    // 斜线1
    line(x - 8, y + 8, x + 8, y - 8);    // 斜线2
  }
  
  pop();
}

// 自适应缩放
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleFactor = min(windowWidth / canvasWidth, windowHeight / canvasHeight);
}