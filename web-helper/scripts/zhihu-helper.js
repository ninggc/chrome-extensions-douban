
function run() {

    deleteElements();
    hideSpec();
    shrinkImagesToCursorSize();
    changeBlueButtonsToWhite();
    replaceZhihuWithTilde();
}

function deleteElements() {
    
    let arr = ['.AppHeader'
        // 右侧栏: data-za-detail-view-path-module="RightSideBar"
        , 'div[data-za-detail-view-path-module="RightSideBar"]']
    arr.forEach(str => {
        deleteElement(str);
    });
}

function deleteElement(str) {
    // AppHeader
    const divs = document.querySelectorAll(str)
    // do delete
    divs.forEach(div => {
        div.remove();
    });
}

function hideSpec() {
    let arr = []


    // 广告栏
    // class="Pc-Business-Card-PcTopFeedBanner __web-inspector-hide-shortcut__"
    arr.push('.Pc-Business-Card-PcTopFeedBanner');

    // 顶部区域
    // data-za-module="TopNavBar"
    arr.push('div[data-za-module="TopNavBar"]');

    // class="Tabs AppHeader-Tabs css-g0ay3v"
    arr.push('.Tabs.AppHeader-Tabs.css-g0ay3v');

    for (let i = 0; i < arr.length; i++) {
        hide(arr[i]);
    }
}

/**
 * 把知乎替换为tilde
 */
function replaceZhihuWithTilde() {
    function walk(node) {
        if (node.nodeType === 3) { // Text node
            node.textContent = node.textContent.replace(/知乎/g, '～');
        } else if ([1, 9, 11].includes(node.nodeType)) { // Element, Document, DocumentFragment
            node.childNodes.forEach(walk);
        }
    }

    walk(document.body);
}

/**
 * 把所有蓝色按钮变成白色
 */
function changeBlueButtonsToWhite() {
    // Common selectors for buttons (you can expand this list)
    const buttonSelector = 'button, .Button, .btn, .ant-btn';

    const buttons = document.querySelectorAll(buttonSelector);
    buttons.forEach(button => {
        // Get computed background color
        const computedStyle = window.getComputedStyle(button);
        const bgColor = computedStyle.backgroundColor;

        // Check if it's a "blue-like" color
        if (
            bgColor.includes('rgb(0, 0, 255)') ||     // pure blue
            bgColor.includes('rgb(0, 132, 255)') ||   // light blue
            bgColor.includes('rgb(33, 150, 243)') ||  // material blue
            bgColor.includes('rgb(21, 156, 255)')     // another common blue
        ) {
            button.style.backgroundColor = 'white';
            button.style.color = 'black'; // Optional: adjust text color for contrast
        }
    });
}

/**
 * 把所有图片缩小到鼠标的尺寸

 */
function shrinkImagesToCursorSize() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Store original size
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Shrink to cursor-like size
        img.style.width = '16px';
        img.style.height = '16px';
        img.style.transition = 'width 0.3s, height 0.3s';

        // Optional: Add tooltip or show original on hover
        img.addEventListener('mouseenter', () => {
            img.style.width = `${originalWidth}px`;
            img.style.height = `${originalHeight}px`;
        });

        img.addEventListener('mouseleave', () => {
            img.style.width = '16px';
            img.style.height = '16px';
        });
    });
}

function collapse(str) {
    const divs = document.querySelectorAll(str);
    divs.forEach(div => {
        div.addEventListener('click', () => {
            div.style.display = 'none';
            const button = document.createElement('button');
            button.innerText = '展开';
            button.addEventListener('click', () => {
                div.style.display = 'block';
                button.remove();
            });
            div.parentNode.appendChild(button);
        });
    });
}

function hide(str) {
    const divs = document.querySelectorAll(str);
    divs.forEach(div => {
        div.style.display = 'none';
    });

    // 当前秒数是10的倍数时候打印一次
    if (new Date().getSeconds() % 10 === 0) {
        console.log('str:', str, ' divs:', divs);
    }
}

function changeColor(str) {
    const divs = document.querySelectorAll(str);
    divs.forEach(div => {
        div.style.backgroundColor = 'white';
    });
    console.log('divs:', divs);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'runZhihuHelper') {
    chrome.storage.local.get(['zhihuEnabled'], function(result) {
      if (result.zhihuEnabled !== false) {
        run();
      }
    });
  }
});

