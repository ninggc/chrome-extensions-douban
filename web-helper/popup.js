console.log('load popup.js!');

$(document).ready(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const urlSuffix = tabs[0].url;
    const key = `pop:douban:enable:${urlSuffix}`;
    const responseTimeKey = `pop:douban:responseTime:${urlSuffix}`;
    console.log('key:', key);
    let isEnabled = localStorage.getItem(key) === 'true';
    let responseTime = localStorage.getItem(responseTimeKey) || 500;
    // document.addEventListener('DOMContentLoaded', () => {
    //   const responseTimeInput = document.getElementById('responseTime');
    //   responseTimeInput.addEventListener('change', () => {
    //     const responseTime = responseTimeInput.value;
    //     chrome.runtime.sendMessage({ action: 'setResponseTime', responseTime: responseTime });
    //   });
    // });
    chrome.runtime.sendMessage({ action: 'setResponseTime', responseTime: responseTime });

    $('#toggleButton').text(isEnabled ? '禁用查找电影名称' : '启用查找电影名称');
    $('#responseTime').val(responseTime);

    $('#toggleButton').click(function () {
      isEnabled = !isEnabled;
      localStorage.setItem(key, isEnabled);
      $(this).text(isEnabled ? '禁用查找电影名称' : '启用查找电影名称');
    });

    $('#responseTime').change(function () {
      responseTime = $(this).val();
      localStorage.setItem(responseTimeKey, responseTime);
    });
  });
});
