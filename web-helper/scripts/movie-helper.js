// use set save title
let titleSet = new Set();
function fetchDiv() {
    // 获取页面中的所有链接元素
    const links = document.querySelectorAll('a[href]');

    // 筛选出符合条件的链接
    const bilibiliLinks = Array.from(links).filter(link => link.href.includes('//www.bilibili.com/bangumi/play'));

    // 提取符合条件的链接及其上级 div
    const bilibiliData = bilibiliLinks.map(link => {
        const childTitleDiv = link.querySelector('div.title');
        return {
            href: link.href,
            parentDiv: link.closest('div'), // 找到最近的上级 div 元素
            childTitleDiv: childTitleDiv, // 找到子 div 且 class=title
            title: childTitleDiv ? childTitleDiv.textContent.trim() : null // 提取子 div 的内容作为标题
        };
    }).filter(data => data.title)
        .filter(data => titleSet.has(data.title) === false)

    // add to titleSet
    bilibiliData.forEach(data => {
        titleSet.add(data.title);
    });

    return bilibiliData;
}


let mouseEnterTime;
let lastPopupTime = 0;
const POPUP_INTERVAL = 1500;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    debugger
    if (request.action === 'setResponseTime') {
        const responseTime = request.responseTime;
        console.log('从 popup.js 接收到的响应时间:', responseTime);
        // 你可以在这里使用接收到的响应时间
        POPUP_INTERVAL = responseTime;
        sendResponse('响应时间已设置');
    }
});

let state = {
    'id': 0,
    'title': '',
    'status': 'enter',
    'mouseEnterTime': 0,
    'mouseLeaveTime': 0,
}

// 创建一个数字框元素
const progressNumber = document.createElement('div');
progressNumber.style.position = 'absolute';
progressNumber.style.height = '20px';
progressNumber.style.width = '40px';
progressNumber.style.backgroundColor = '#fff';
progressNumber.style.border = '1px solid #ccc';
progressNumber.style.textAlign = 'center';
progressNumber.style.lineHeight = '20px';
progressNumber.style.zIndex = '1001';
document.body.appendChild(progressNumber);

function bindEventListener(dataList) {
    // 添加鼠标悬浮事件处理程序
    dataList.forEach(data => {
        if (data.parentDiv) {

            data.parentDiv.addEventListener('mouseenter', (event) => {
                state = {
                    'id': state.id + 1,
                    'title': data.title,
                    'status': 'enter',
                    'mouseEnterTime': Date.now(),
                    'mouseLeaveTime': 0,
                }
                const id = state.id;
                mouseEnterTime = Date.now();
                console.log('鼠标悬浮:', data.title, mouseEnterTime, data);

                // 显示数字框
                progressNumber.style.top = `${event.clientY + window.scrollY + 20}px`;
                progressNumber.style.left = `${event.clientX + window.scrollX + 20}px`;
                progressNumber.style.display = 'block';
                let startTime = Date.now();
                let interval = setInterval(() => {
                    let elapsed = Date.now() - startTime;
                    let percentage = Math.min(100, Math.floor((elapsed / POPUP_INTERVAL) * 100));
                    progressNumber.textContent = percentage + '%';
                    if (percentage >= 100) {
                        clearInterval(interval);
                    }
                }, Math.floor(POPUP_INTERVAL / 10));

                if (data.title) {
                    setTimeout(() => {
                        if (state.id !== id || state.status !== 'enter') {
                            clearInterval(interval);
                            return;
                        }

                        // 打开新标签页
                        window.open(`https://search.douban.com/movie/subject_search?search_text=${data.title}`, '_blank');
                        progressNumber.style.display = 'none';
                    }, POPUP_INTERVAL);
                }
            });

            data.parentDiv.addEventListener('mouseleave', () => {
                state.mouseLeaveTime = Date.now();
                state.status = 'leave';
                console.log('鼠标离开:', data.title, state.mouseLeaveTime);

                // 隐藏数字框
                progressNumber.style.display = 'none';
            });

            // 打印找到的链接、上级 div 和子 div，并修改上级 div 的背景色
            if (data.parentDiv) {
                // data.parentDiv.style.backgroundColor = 'red'; // 修改背景色为红色
            }
        }
    });

}

function run() {
    dataList = fetchDiv();
    if (dataList.length > 0) {
        console.log('newTitleSet:', dataList.map(data => data.title));
    }
    bindEventListener(dataList);

    setTimeout(() => {
        run()
    }, 1000);
}

run();


