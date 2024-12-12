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
    console.log('newTitleSet:', bilibiliData.map(data => data.title));
    return bilibiliData;
}



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


let mouseEnterTime;

function bindEventListener(dataList) {
    // 添加鼠标悬浮事件处理程序
    dataList.forEach(data => {
        if (data.parentDiv) {

            data.parentDiv.addEventListener('mouseenter', (event) => {
                console.log('鼠标悬浮:', data.title, data);
                mouseEnterTime = Date.now();
                if (data.title) {
                    // 设置弹窗内容
                    popup.innerHTML = `<button id="popupButton">跳转: ${data.title}</button>`;
                    popup.style.display = 'block';

                    // 添加按钮点击事件
                    document.getElementById('popupButton').addEventListener('click', () => {
                        window.open('https://search.douban.com/movie/subject_search?search_text=' + data.title);
                    });

                    popup.style.top = `${event.clientY + window.scrollY + 10}px`;
                    popup.style.left = `${event.clientX + window.scrollX + 10}px`;
                }
            });

            data.parentDiv.addEventListener('mouseleave', () => {

                const mouseLeaveTime = Date.now();
                if (mouseLeaveTime - mouseEnterTime >= 2000) { // 校验时间戳
                    console.log('hide popup', data.title, mouseLeaveTime, mouseEnterTime);
                    popup.style.display = 'none';
                }
            });

            // 打印找到的链接、上级 div 和子 div，并修改上级 div 的背景色
            if (data.parentDiv) {
                // data.parentDiv.style.backgroundColor = 'red'; // 修改背景色为红色
            }
        }
    });

}

function run() {
    console.log('start run')

    dataList = fetchDiv();
    bindEventListener(dataList);

    setTimeout(() => {
        run()
    }, 1000);
}

run();


