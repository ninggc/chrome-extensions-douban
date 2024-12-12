// 检测浏览器控制台是否打开
function isConsoleOpen() {
    const startTime = new Date();
    debugger;
    const endTime = new Date();
    return endTime - startTime > 100;
}

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
});

// 创建一个弹窗元素
const popup = document.createElement('div');
popup.style.position = 'absolute';
popup.style.backgroundColor = '#fff';
popup.style.border = '1px solid #ccc';
popup.style.padding = '10px';
popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
popup.style.display = 'none';
popup.style.zIndex = '1000';
document.body.appendChild(popup);

// 添加鼠标悬浮事件处理程序
bilibiliData.forEach(data => {
    if (data.parentDiv) {
        data.parentDiv.addEventListener('mouseenter', (event) => {
            if (data.title) {
                // 设置弹窗内容
                popup.innerHTML = `<button id="popupButton">跳转${data.title}</button>`;
                const rect = data.parentDiv.getBoundingClientRect();
                popup.style.top = `${rect.top}px`;

                // 添加按钮点击事件
                document.getElementById('popupButton').addEventListener('click', () => {
                    window.open('https://search.douban.com/movie/subject_search?search_text=' + data.title);
                });
            }
        });
    }
});

const isDebug = bilibiliData && isConsoleOpen()

// 打印找到的链接、上级 div 和子 div，并修改上级 div 的背景色
bilibiliData.forEach(data => {
    console.log('链接:', data.href);
    console.log('上级 div:', data.parentDiv);
    console.log('子 div (class=title):', data.childTitleDiv);
    console.log('标题:', data.title);
    if (isDebug && data.parentDiv) {
        data.parentDiv.style.backgroundColor = 'red'; // 修改背景色为红色
    }
});
