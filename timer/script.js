// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentTime();
    // 每秒更新当前时间
    setInterval(updateCurrentTime, 1000);
    
    // 添加回车键监听
    document.getElementById('timestamp').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertTimestamp();
        }
    });
    
    // 添加输入框变化监听，实时转换
    document.getElementById('timestamp').addEventListener('input', function() {
        convertTimestamp();
    });
});

// 转换时间戳函数
function convertTimestamp() {
    const timestampInput = document.getElementById('timestamp').value.trim();
    const convertedTimeElement = document.getElementById('convertedTime');
    const timestampTypeElement = document.getElementById('timestampType');
    
    if (!timestampInput) {
        convertedTimeElement.textContent = '请输入时间戳';
        timestampTypeElement.textContent = '-';
        return;
    }
    
    // 检查输入是否为有效数字
    const timestamp = parseFloat(timestampInput);
    if (isNaN(timestamp)) {
        convertedTimeElement.textContent = '无效的时间戳格式';
        timestampTypeElement.textContent = '-';
        return;
    }
    
    let date;
    let timestampType;
    
    // 自动判断时间戳类型
    if (timestamp > 9999999999) {
        // 毫秒级时间戳（13位）
        date = new Date(timestamp);
        timestampType = '毫秒级 (13位)';
    } else {
        // 秒级时间戳（10位）
        date = new Date(timestamp * 1000);
        timestampType = '秒级 (10位)';
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        convertedTimeElement.textContent = '无效的时间戳';
        timestampTypeElement.textContent = '-';
        return;
    }
    
    // 格式化日期为 yyyy-MM-dd HH:mm:ss
    const formattedDate = formatDate(date);
    
    convertedTimeElement.textContent = formattedDate;
    timestampTypeElement.textContent = timestampType;
}

// 格式化日期函数
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 更新当前时间显示
function updateCurrentTime() {
    const now = new Date();
    const currentTimeElement = document.getElementById('currentTime');
    const currentSecondsElement = document.getElementById('currentSeconds');
    const currentMillisecondsElement = document.getElementById('currentMilliseconds');
    
    // 更新当前时间显示
    currentTimeElement.textContent = formatDate(now);
    
    // 更新当前时间戳
    const secondsTimestamp = Math.floor(now.getTime() / 1000);
    const millisecondsTimestamp = now.getTime();
    
    currentSecondsElement.textContent = secondsTimestamp;
    currentMillisecondsElement.textContent = millisecondsTimestamp;
} 