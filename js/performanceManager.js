/**
 * PerformanceManager类 - 负责管理计时器性能和更新频率
 * 实现需求4.1和4.2，处理性能优化的逻辑
 */
class PerformanceManager {
    /**
     * 构造函数 - 初始化性能管理器
     * @param {Object} options - 配置选项
     * @param {number} options.updateInterval - 更新间隔（毫秒），默认为100
     * @param {boolean} options.pauseWhenHidden - 页面隐藏时是否暂停，默认为true
     */
    constructor(options = {}) {
        // 配置选项
        this.updateInterval = options.updateInterval || 100; // 默认100毫秒更新一次
        this.pauseWhenHidden = options.pauseWhenHidden !== false; // 默认为true
        
        // 内部状态
        this.timerId = null;
        this.lastUpdateTime = 0;
        this.isRunning = false;
        this.callback = null;
        this.isPaused = false;
        
        // 绑定方法到实例
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.updateLoop = this.updateLoop.bind(this);
        
        // 如果启用了页面可见性管理，添加事件监听器
        if (this.pauseWhenHidden) {
            this.setupVisibilityListener();
        }
    }
    
    /**
     * 设置页面可见性变化的事件监听器
     */
    setupVisibilityListener() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
    
    /**
     * 处理页面可见性变化事件
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // 页面隐藏，暂停计时器
            this.pauseTimer();
        } else {
            // 页面可见，恢复计时器
            this.resumeTimer();
        }
    }
    
    /**
     * 启动计时器
     * @param {Function} callback - 每次更新时调用的回调函数
     */
    startTimer(callback) {
        // 存储回调函数
        this.callback = callback;
        
        // 如果计时器已经在运行，先停止它
        if (this.isRunning) {
            this.stopTimer();
        }
        
        // 设置初始状态
        this.isRunning = true;
        this.isPaused = false;
        this.lastUpdateTime = performance.now();
        
        // 启动更新循环
        this.requestUpdate();
    }
    
    /**
     * 请求下一次更新
     */
    requestUpdate() {
        // 使用requestAnimationFrame优化渲染
        this.timerId = requestAnimationFrame(this.updateLoop);
    }
    
    /**
     * 更新循环
     * @param {number} timestamp - 当前时间戳
     */
    updateLoop(timestamp) {
        // 如果计时器已停止或暂停，不执行更新
        if (!this.isRunning || this.isPaused) {
            return;
        }
        
        // 计算自上次更新以来经过的时间
        const elapsed = timestamp - this.lastUpdateTime;
        
        // 如果经过的时间超过更新间隔，执行更新
        if (elapsed >= this.updateInterval) {
            // 更新上次更新时间
            this.lastUpdateTime = timestamp;
            
            // 调用回调函数
            if (this.callback) {
                this.callback();
            }
        }
        
        // 请求下一次更新
        this.requestUpdate();
    }
    
    /**
     * 暂停计时器
     */
    pauseTimer() {
        if (this.isRunning && !this.isPaused) {
            this.isPaused = true;
            
            // 如果使用的是setTimeout，清除定时器
            if (this.timerId && !this.usingRAF) {
                clearTimeout(this.timerId);
                this.timerId = null;
            }
        }
    }
    
    /**
     * 恢复计时器
     */
    resumeTimer() {
        if (this.isRunning && this.isPaused) {
            this.isPaused = false;
            this.lastUpdateTime = performance.now();
            
            // 重新启动更新循环
            if (!this.timerId) {
                this.requestUpdate();
            }
        }
    }
    
    /**
     * 停止计时器
     */
    stopTimer() {
        this.isRunning = false;
        this.isPaused = false;
        
        // 清除定时器
        if (this.timerId) {
            cancelAnimationFrame(this.timerId);
            this.timerId = null;
        }
        
        // 清除回调
        this.callback = null;
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        // 停止计时器
        this.stopTimer();
        
        // 移除事件监听器
        if (this.pauseWhenHidden) {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        }
    }
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceManager;
}