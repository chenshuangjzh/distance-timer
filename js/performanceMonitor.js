/**
 * 性能监控模块 - 监控和优化应用性能
 * 实现需求4.1和4.4，处理性能监控和优化
 */
class PerformanceMonitor {
    /**
     * 构造函数 - 初始化性能监控器
     * @param {Object} options - 配置选项
     * @param {number} options.sampleInterval - 采样间隔（毫秒），默认为1000
     * @param {number} options.maxSamples - 最大采样数，默认为100
     * @param {boolean} options.autoStart - 是否自动开始监控，默认为false
     */
    constructor(options = {}) {
        // 配置选项
        this.sampleInterval = options.sampleInterval || 1000;
        this.maxSamples = options.maxSamples || 100;
        this.autoStart = options.autoStart || false;
        
        // 性能数据
        this.metrics = {
            fps: [],
            memory: [],
            updateTimes: [],
            timestamp: []
        };
        
        // 内部状态
        this.isMonitoring = false;
        this.timerId = null;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.startTime = 0;
        
        // 绑定方法到实例
        this.samplePerformance = this.samplePerformance.bind(this);
        this.frameCallback = this.frameCallback.bind(this);
        
        // 如果启用了自动开始，开始监控
        if (this.autoStart) {
            this.startMonitoring();
        }
    }
    
    /**
     * 开始性能监控
     */
    startMonitoring() {
        if (this.isMonitoring) {
            return;
        }
        
        // 设置初始状态
        this.isMonitoring = true;
        this.startTime = performance.now();
        this.lastFrameTime = this.startTime;
        this.frameCount = 0;
        
        // 清空之前的数据
        this.clearMetrics();
        
        // 开始采样
        this.timerId = setInterval(this.samplePerformance, this.sampleInterval);
        
        // 开始帧率计数
        requestAnimationFrame(this.frameCallback);
        
        console.log('性能监控已启动');
    }
    
    /**
     * 停止性能监控
     */
    stopMonitoring() {
        if (!this.isMonitoring) {
            return;
        }
        
        // 清除定时器
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        
        // 设置状态
        this.isMonitoring = false;
        
        console.log('性能监控已停止');
    }
    
    /**
     * 清空性能指标数据
     */
    clearMetrics() {
        this.metrics = {
            fps: [],
            memory: [],
            updateTimes: [],
            timestamp: []
        };
    }
    
    /**
     * 帧回调函数，用于计算FPS
     * @param {number} timestamp - 当前时间戳
     */
    frameCallback(timestamp) {
        if (!this.isMonitoring) {
            return;
        }
        
        // 增加帧计数
        this.frameCount++;
        
        // 请求下一帧
        requestAnimationFrame(this.frameCallback);
    }
    
    /**
     * 采样性能数据
     */
    samplePerformance() {
        if (!this.isMonitoring) {
            return;
        }
        
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        
        // 计算FPS
        const fps = this.frameCount / (elapsed / 1000);
        
        // 获取内存使用情况（如果可用）
        let memory = null;
        if (window.performance && window.performance.memory) {
            memory = {
                usedJSHeapSize: window.performance.memory.usedJSHeapSize / (1024 * 1024), // MB
                totalJSHeapSize: window.performance.memory.totalJSHeapSize / (1024 * 1024), // MB
                jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit / (1024 * 1024) // MB
            };
        }
        
        // 记录数据
        this.metrics.fps.push(Math.round(fps));
        this.metrics.memory.push(memory);
        this.metrics.timestamp.push(now);
        
        // 限制数据量
        if (this.metrics.fps.length > this.maxSamples) {
            this.metrics.fps.shift();
            this.metrics.memory.shift();
            this.metrics.timestamp.shift();
            this.metrics.updateTimes.shift();
        }
        
        // 重置计数器
        this.frameCount = 0;
        this.lastFrameTime = now;
    }
    
    /**
     * 记录更新时间
     * @param {number} updateTime - 更新操作耗时（毫秒）
     */
    recordUpdateTime(updateTime) {
        if (!this.isMonitoring) {
            return;
        }
        
        this.metrics.updateTimes.push(updateTime);
    }
    
    /**
     * 获取性能报告
     * @returns {Object} 性能报告
     */
    getPerformanceReport() {
        // 计算平均值、最小值、最大值
        const fpsData = this.metrics.fps;
        const updateTimesData = this.metrics.updateTimes;
        
        const avgFps = fpsData.length > 0 ? 
            fpsData.reduce((sum, val) => sum + val, 0) / fpsData.length : 0;
        
        const minFps = fpsData.length > 0 ? 
            Math.min(...fpsData) : 0;
        
        const maxFps = fpsData.length > 0 ? 
            Math.max(...fpsData) : 0;
        
        const avgUpdateTime = updateTimesData.length > 0 ? 
            updateTimesData.reduce((sum, val) => sum + val, 0) / updateTimesData.length : 0;
        
        const minUpdateTime = updateTimesData.length > 0 ? 
            Math.min(...updateTimesData) : 0;
        
        const maxUpdateTime = updateTimesData.length > 0 ? 
            Math.max(...updateTimesData) : 0;
        
        // 获取最新的内存使用情况
        const latestMemory = this.metrics.memory.length > 0 ? 
            this.metrics.memory[this.metrics.memory.length - 1] : null;
        
        // 计算运行时间
        const runningTime = (performance.now() - this.startTime) / 1000; // 秒
        
        return {
            fps: {
                average: avgFps,
                min: minFps,
                max: maxFps,
                current: fpsData.length > 0 ? fpsData[fpsData.length - 1] : 0
            },
            updateTime: {
                average: avgUpdateTime,
                min: minUpdateTime,
                max: maxUpdateTime,
                current: updateTimesData.length > 0 ? updateTimesData[updateTimesData.length - 1] : 0
            },
            memory: latestMemory,
            runningTime: runningTime,
            sampleCount: fpsData.length
        };
    }
    
    /**
     * 优化更新频率
     * @param {Object} performanceManager - 性能管理器实例
     * @param {number} targetFps - 目标FPS，默认为30
     */
    optimizeUpdateFrequency(performanceManager, targetFps = 30) {
        if (!performanceManager) {
            console.error('未提供性能管理器实例');
            return;
        }
        
        const report = this.getPerformanceReport();
        const currentFps = report.fps.current;
        
        // 如果当前FPS低于目标FPS的80%，增加更新间隔
        if (currentFps < targetFps * 0.8) {
            const newInterval = Math.min(performanceManager.updateInterval * 1.2, 500);
            performanceManager.updateInterval = newInterval;
            console.log(`性能优化: 降低更新频率，新间隔: ${newInterval}ms`);
        }
        // 如果当前FPS高于目标FPS的120%，减少更新间隔
        else if (currentFps > targetFps * 1.2 && performanceManager.updateInterval > 50) {
            const newInterval = Math.max(performanceManager.updateInterval * 0.8, 50);
            performanceManager.updateInterval = newInterval;
            console.log(`性能优化: 提高更新频率，新间隔: ${newInterval}ms`);
        }
    }
    
    /**
     * 显示性能监控面板
     */
    showPerformancePanel() {
        // 检查是否已存在面板
        let panel = document.getElementById('performance-panel');
        if (!panel) {
            // 创建面板
            panel = document.createElement('div');
            panel.id = 'performance-panel';
            panel.className = 'performance-panel';
            
            // 创建面板内容
            panel.innerHTML = `
                <h3>性能监控</h3>
                <div class="performance-metrics">
                    <div class="metric">
                        <span class="metric-label">FPS:</span>
                        <span id="fps-value" class="metric-value">0</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">更新时间:</span>
                        <span id="update-time-value" class="metric-value">0 ms</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">内存使用:</span>
                        <span id="memory-value" class="metric-value">N/A</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">运行时间:</span>
                        <span id="running-time-value" class="metric-value">0s</span>
                    </div>
                </div>
                <div class="performance-controls">
                    <button id="toggle-monitoring">暂停监控</button>
                    <button id="close-panel">关闭</button>
                </div>
            `;
            
            // 添加到文档
            document.body.appendChild(panel);
            
            // 添加事件监听器
            document.getElementById('toggle-monitoring').addEventListener('click', () => {
                if (this.isMonitoring) {
                    this.stopMonitoring();
                    document.getElementById('toggle-monitoring').textContent = '开始监控';
                } else {
                    this.startMonitoring();
                    document.getElementById('toggle-monitoring').textContent = '暂停监控';
                }
            });
            
            document.getElementById('close-panel').addEventListener('click', () => {
                this.hidePerformancePanel();
            });
            
            // 开始更新面板
            this.updatePerformancePanel();
        } else {
            // 显示已存在的面板
            panel.style.display = 'block';
        }
    }
    
    /**
     * 隐藏性能监控面板
     */
    hidePerformancePanel() {
        const panel = document.getElementById('performance-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }
    
    /**
     * 更新性能监控面板
     */
    updatePerformancePanel() {
        const panel = document.getElementById('performance-panel');
        if (!panel || panel.style.display === 'none') {
            return;
        }
        
        // 获取性能报告
        const report = this.getPerformanceReport();
        
        // 更新面板数据
        document.getElementById('fps-value').textContent = report.fps.current.toFixed(1);
        document.getElementById('update-time-value').textContent = `${report.updateTime.current.toFixed(2)} ms`;
        
        if (report.memory) {
            document.getElementById('memory-value').textContent = `${report.memory.usedJSHeapSize.toFixed(1)} MB / ${report.memory.totalJSHeapSize.toFixed(1)} MB`;
        } else {
            document.getElementById('memory-value').textContent = 'N/A';
        }
        
        document.getElementById('running-time-value').textContent = `${report.runningTime.toFixed(0)}s`;
        
        // 设置颜色指示性能状态
        const fpsElement = document.getElementById('fps-value');
        if (report.fps.current < 30) {
            fpsElement.className = 'metric-value poor';
        } else if (report.fps.current < 50) {
            fpsElement.className = 'metric-value average';
        } else {
            fpsElement.className = 'metric-value good';
        }
        
        // 继续更新
        requestAnimationFrame(() => this.updatePerformancePanel());
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        // 停止监控
        this.stopMonitoring();
        
        // 隐藏面板
        this.hidePerformancePanel();
    }
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}