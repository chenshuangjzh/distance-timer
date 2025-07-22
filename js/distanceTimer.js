/**
 * DistanceTimer类 - 主应用类，协调各个模块
 * 实现需求1.1，处理应用的初始化和生命周期
 */
class DistanceTimer {
    /**
     * 构造函数 - 初始化距离计时器应用
     * @param {Object} options - 配置选项
     * @param {string} options.containerId - 计时器容器的DOM ID，默认为'timer-container'
     * @param {number} options.updateInterval - 更新间隔（毫秒），默认为100
     * @param {boolean} options.pauseWhenHidden - 页面隐藏时是否暂停，默认为true
     */
    constructor(options = {}) {
        // 配置选项
        this.containerId = options.containerId || 'timer-container';
        this.updateInterval = options.updateInterval || 100;
        this.pauseWhenHidden = options.pauseWhenHidden !== false;
        
        // 获取容器元素
        this.containerElement = document.getElementById(this.containerId);
        if (!this.containerElement) {
            throw new Error(`找不到ID为${this.containerId}的容器元素`);
        }
        
        // 初始化子模块
        this.timeCalculator = new TimeCalculator();
        this.displayUpdater = new DisplayUpdater(this.containerElement);
        this.performanceManager = new PerformanceManager({
            updateInterval: this.updateInterval,
            pauseWhenHidden: this.pauseWhenHidden
        });
        
        // 绑定方法到实例
        this.update = this.update.bind(this);
    }
    
    /**
     * 启动计时器应用
     */
    start() {
        // 执行初始更新
        this.update();
        
        // 启动性能管理器的定时器
        this.performanceManager.startTimer(this.update);
        
        console.log('距离计时器已启动');
    }
    
    /**
     * 停止计时器应用
     */
    stop() {
        // 停止性能管理器的定时器
        this.performanceManager.stopTimer();
        
        console.log('距离计时器已停止');
    }
    
    /**
     * 更新计时器显示
     */
    update() {
        try {
            // 计算当前时间差
            const timeDiff = this.timeCalculator.calculateTimeDifference();
            
            // 更新显示
            this.displayUpdater.updateDisplay(timeDiff);
        } catch (error) {
            console.error('更新计时器时发生错误:', error);
            
            // 错误计数，如果连续错误过多，停止计时器
            this.errorCount = (this.errorCount || 0) + 1;
            
            if (this.errorCount > 5) {
                console.error('连续错误过多，停止计时器');
                this.stop();
                
                // 显示错误信息
                const container = this.containerElement;
                if (container) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.textContent = '计时器发生错误，已停止更新';
                    container.appendChild(errorDiv);
                }
            }
        }
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        try {
            // 停止计时器
            this.stop();
            
            // 清理性能管理器资源
            if (this.performanceManager) {
                this.performanceManager.cleanup();
            }
            
            // 重置错误计数
            this.errorCount = 0;
            
            console.log('距离计时器资源已清理');
        } catch (error) {
            console.error('清理资源时发生错误:', error);
        }
    }
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DistanceTimer;
}