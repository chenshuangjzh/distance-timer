/**
 * 错误处理模块 - 提供全局错误处理功能
 * 实现需求4.4，处理错误和边界情况
 */
class ErrorHandler {
    /**
     * 构造函数 - 初始化错误处理器
     * @param {Object} options - 配置选项
     * @param {boolean} options.enableGlobalHandling - 是否启用全局错误处理，默认为true
     * @param {Function} options.errorCallback - 错误发生时的回调函数
     */
    constructor(options = {}) {
        // 配置选项
        this.enableGlobalHandling = options.enableGlobalHandling !== false;
        this.errorCallback = options.errorCallback || null;
        
        // 错误计数
        this.errorCount = 0;
        this.errorLog = [];
        
        // 绑定方法到实例
        this.handleError = this.handleError.bind(this);
        this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
        
        // 如果启用了全局错误处理，添加事件监听器
        if (this.enableGlobalHandling) {
            this.setupGlobalHandlers();
        }
    }
    
    /**
     * 设置全局错误处理器
     */
    setupGlobalHandlers() {
        // 处理未捕获的JavaScript错误
        window.addEventListener('error', this.handleError);
        
        // 处理未处理的Promise拒绝
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
    
    /**
     * 处理JavaScript错误
     * @param {ErrorEvent} event - 错误事件
     */
    handleError(event) {
        // 增加错误计数
        this.errorCount++;
        
        // 记录错误
        const errorInfo = {
            type: 'error',
            message: event.message || 'Unknown error',
            source: event.filename || 'Unknown source',
            line: event.lineno || 'Unknown line',
            column: event.colno || 'Unknown column',
            timestamp: new Date().toISOString(),
            count: this.errorCount
        };
        
        this.logError(errorInfo);
        
        // 调用错误回调
        if (this.errorCallback) {
            this.errorCallback(errorInfo);
        }
    }
    
    /**
     * 处理未处理的Promise拒绝
     * @param {PromiseRejectionEvent} event - Promise拒绝事件
     */
    handleUnhandledRejection(event) {
        // 增加错误计数
        this.errorCount++;
        
        // 记录错误
        const errorInfo = {
            type: 'unhandledRejection',
            message: event.reason ? (event.reason.message || String(event.reason)) : 'Unknown rejection',
            timestamp: new Date().toISOString(),
            count: this.errorCount
        };
        
        this.logError(errorInfo);
        
        // 调用错误回调
        if (this.errorCallback) {
            this.errorCallback(errorInfo);
        }
    }
    
    /**
     * 记录错误信息
     * @param {Object} errorInfo - 错误信息对象
     */
    logError(errorInfo) {
        // 将错误添加到日志
        this.errorLog.push(errorInfo);
        
        // 限制日志大小，最多保留50条记录
        if (this.errorLog.length > 50) {
            this.errorLog.shift();
        }
        
        // 在控制台中输出错误信息
        console.error('应用错误:', errorInfo);
    }
    
    /**
     * 手动记录错误
     * @param {Error|string} error - 错误对象或错误消息
     * @param {string} source - 错误来源
     */
    reportError(error, source = 'manual') {
        // 增加错误计数
        this.errorCount++;
        
        // 记录错误
        const errorInfo = {
            type: 'manual',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : null,
            source: source,
            timestamp: new Date().toISOString(),
            count: this.errorCount
        };
        
        this.logError(errorInfo);
        
        // 调用错误回调
        if (this.errorCallback) {
            this.errorCallback(errorInfo);
        }
    }
    
    /**
     * 获取错误日志
     * @returns {Array} 错误日志数组
     */
    getErrorLog() {
        return [...this.errorLog];
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        // 移除事件监听器
        if (this.enableGlobalHandling) {
            window.removeEventListener('error', this.handleError);
            window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
        }
        
        // 清空错误日志
        this.errorLog = [];
        this.errorCount = 0;
    }
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}