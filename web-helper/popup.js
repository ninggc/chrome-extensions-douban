console.log('load popup.js!');

$(document).ready(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log('tabs:', tabs);
    if (!tabs || !tabs[0] || !tabs[0].url) {
      console.error('Unable to get current tab URL');
      return;
    }
    const currentUrl = tabs[0].url;
    const urlSuffix = currentUrl;
    const key = `pop:douban:enable:${urlSuffix}`;
    const responseTimeKey = `pop:douban:responseTime:${urlSuffix}`;
    console.log('currentUrl', currentUrl, 'key:', key);
    let isEnabled = localStorage.getItem(key) === 'true';
    let responseTime = localStorage.getItem(responseTimeKey) || 500;

    // Zhihu section
    if (currentUrl && currentUrl.includes('zhihu.com')) {
      const zhihuKey = `pop:zhihu:enable:${urlSuffix}`;
      let zhihuEnabled = localStorage.getItem(zhihuKey) === 'true';
      
      $('#zhihuToggleButton').text(zhihuEnabled ? 'Disable' : 'Enable');
      $('#reloadButton').show();
      
      $('#zhihuToggleButton').click(function() {
        zhihuEnabled = !zhihuEnabled;
        localStorage.setItem(zhihuKey, zhihuEnabled);
        $(this).text(zhihuEnabled ? 'Disable' : 'Enable');
      });
      
      $('#reloadButton').click(function() {
        if (zhihuEnabled) {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'runZhihuHelper'});
          });
        }
      });
    } else {
      $('#group-zhihu').hide();
    }
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

    $('#reloadButton').click(function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'runZhihuHelper'});
      });
    });
  });
});
