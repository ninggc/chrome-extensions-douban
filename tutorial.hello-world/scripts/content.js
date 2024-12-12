console.log('load content.js!');
console.log('2 load content.js!');

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

// 打印找到的链接、上级 div 和子 div，并修改上级 div 的背景色
bilibiliData.forEach(data => {
    console.log('链接:', data.href);
    console.log('上级 div:', data.parentDiv);
    console.log('子 div (class=title):', data.childTitleDiv);
    console.log('标题:', data.title);
    if (data.parentDiv) {
        data.parentDiv.style.backgroundColor = 'red'; // 修改背景色为红色
    }
});



