
function run() {
    // 根据自定义标签查询div
    // 自定义标签为: data-za-detail-view-path-module="RightSideBar"
    const divs = document.querySelectorAll('div[data-za-detail-view-path-module="RightSideBar"]');
    // 设置为隐藏
    divs.forEach(div => {
        div.style.display = 'none';
    });

    // class="Pc-Business-Card-PcTopFeedBanner __web-inspector-hide-shortcut__"
    const banners = document.querySelectorAll('.Pc-Business-Card-PcTopFeedBanner');
    banners.forEach(banner => {
        banner.style.display = 'none';
    });
}

run();


