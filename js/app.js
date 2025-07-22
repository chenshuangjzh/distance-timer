/**
 * 应用入口文件 - 初始化并启动距离计时器应用
 */

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 显示加载指示器
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
    
    // 创建浏览器兼容性检查器
    const browserCompatibility = new BrowserCompatibility();
    
    // 应用兼容性修复
    browserCompatibility.applyCompatibilityFixes();
    
    // 显示时区信息
    const timezoneInfo = browserCompatibility.getTimeZoneInfo();
    const timezoneNameElement = document.getElementById('timezone-name');
    if (timezoneNameElement) {
        timezoneNameElement.textContent = `${timezoneInfo.timeZoneName} (UTC${timezoneInfo.offsetHours >= 0 ? '+' : ''}${timezoneInfo.offsetHours})`;
    }
    
    // 创建错误处理器
    const errorHandler = new ErrorHandler({
        enableGlobalHandling: true,
        errorCallback: (errorInfo) => {
            // 显示错误信息
            showError(`发生错误: ${errorInfo.message}`);
        }
    });
    
    // 创建性能监控器
    const performanceMonitor = new PerformanceMonitor({
        sampleInterval: 1000, // 每秒采样一次
        maxSamples: 60, // 最多保存60个样本
        autoStart: false // 不自动开始监控
    });
    
    try {
        // 检查兼容性并显示警告
        const compatibilityWarnings = browserCompatibility.showCompatibilityWarnings();
        
        // 创建距离计时器实例
        const distanceTimer = new DistanceTimer({
            containerId: 'timer-container',
            updateInterval: 100, // 每100毫秒更新一次
            pauseWhenHidden: true // 页面隐藏时暂停更新
        });
        
        // 启动计时器
        distanceTimer.start();
        
        // 将实例存储在全局变量中，以便在控制台中访问
        window.distanceTimer = distanceTimer;
        window.errorHandler = errorHandler;
        window.browserCompatibility = browserCompatibility;
        window.performanceMonitor = performanceMonitor;
        
        // 添加性能监控按钮事件
        const showPerformanceButton = document.getElementById('show-performance');
        if (showPerformanceButton) {
            showPerformanceButton.addEventListener('click', () => {
                performanceMonitor.startMonitoring();
                performanceMonitor.showPerformancePanel();
            });
        }
        
        // 定期优化性能
        setInterval(() => {
            if (performanceMonitor.isMonitoring) {
                performanceMonitor.optimizeUpdateFrequency(distanceTimer.performanceManager, 30);
            }
        }, 5000); // 每5秒优化一次
        
        // 添加页面卸载时的清理逻辑
        window.addEventListener('beforeunload', () => {
            distanceTimer.cleanup();
            errorHandler.cleanup();
            performanceMonitor.cleanup();
        });
        
        // 记录更新时间
        const originalUpdate = distanceTimer.update;
        distanceTimer.update = function() {
            const startTime = performance.now();
            originalUpdate.call(distanceTimer);
            const endTime = performance.now();
            performanceMonitor.recordUpdateTime(endTime - startTime);
        };
        
        console.log('距离计时器应用已初始化');
        
        // 隐藏加载指示器
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        
        // 如果有兼容性警告，记录到控制台
        if (compatibilityWarnings && compatibilityWarnings.length > 0) {
            console.warn('浏览器兼容性警告:', compatibilityWarnings);
        }
        
        // 24小时后进行内存泄漏检查
        setTimeout(() => {
            if (performanceMonitor.isMonitoring) {
                const report = performanceMonitor.getPerformanceReport();
                console.log('24小时性能报告:', report);
                
                // 检查内存使用情况
                if (report.memory && report.memory.usedJSHeapSize > report.memory.totalJSHeapSize * 0.9) {
                    console.warn('内存使用率过高，可能存在内存泄漏');
                }
            }
        }, 24 * 60 * 60 * 1000); // 24小时
        
    } catch (error) {
        console.error('初始化距离计时器应用时发生错误:', error);
        
        // 报告错误
        errorHandler.reportError(error, 'app-initialization');
        
        // 显示错误信息
        showError(`初始化计时器时发生错误: ${error.message}`);
        
        // 隐藏加载指示器
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
    
    /**
     * 显示错误信息
     * @param {string} message - 错误消息
     */
    function showError(message) {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.classList.remove('hidden');
        }
    }
});