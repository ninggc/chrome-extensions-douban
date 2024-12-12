console.log('load popup.js!');

$(document).ready(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    debugger
    const urlSuffix = tabs[0].url;
    const key = `pop:douban:enable:${urlSuffix}`;
    console.log('key:', key);
    let isEnabled = localStorage.getItem(key) === 'true';

    $('#toggleButton').text(isEnabled ? '禁用查找电影名称' : '启用查找电影名称');

    $('#toggleButton').click(function() {
      isEnabled = !isEnabled;
      localStorage.setItem(key, isEnabled);
      $(this).text(isEnabled ? '禁用查找电影名称' : '启用查找电影名称');
    });
  });
});
