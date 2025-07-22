/**
 * 浏览器兼容性检查模块
 * 实现需求3.4，处理浏览器兼容性和时区问题
 */
class BrowserCompatibility {
    /**
     * 构造函数 - 初始化兼容性检查器
     */
    constructor() {
        // 存储兼容性检查结果
        this.compatibilityResults = {};
        
        // 执行兼容性检查
        this.checkCompatibility();
    }
    
    /**
     * 检查浏览器兼容性
     * @returns {Object} 兼容性检查结果
     */
    checkCompatibility() {
        // 检查必需的API
        this.compatibilityResults = {
            requestAnimationFrame: typeof window.requestAnimationFrame === 'function',
            pageVisibility: typeof document.hidden !== 'undefined',
            dateTimeAPI: typeof Date.prototype.toISOString === 'function',
            es6Features: this.checkES6Features(),
            timeZoneSupport: this.checkTimeZoneSupport(),
            cssFeatures: this.checkCSSFeatures()
        };
        
        return this.compatibilityResults;
    }
    
    /**
     * 检查ES6特性支持
     * @returns {boolean} 是否支持必需的ES6特性
     */
    checkES6Features() {
        try {
            // 检查箭头函数
            eval('() => {}');
            
            // 检查类
            eval('class Test {}');
            
            // 检查模板字符串
            eval('`test`');
            
            // 检查解构赋值
            eval('const {a} = {a: 1}');
            
            // 检查默认参数
            eval('function test(a = 1) {}');
            
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * 检查时区支持
     * @returns {boolean} 是否支持时区处理
     */
    checkTimeZoneSupport() {
        try {
            // 检查Intl.DateTimeFormat API
            const hasIntl = typeof Intl === 'object' && typeof Intl.DateTimeFormat === 'function';
            
            // 检查toLocaleString方法
            const hasLocaleString = typeof Date.prototype.toLocaleString === 'function';
            
            // 检查getTimezoneOffset方法
            const hasTimezoneOffset = typeof Date.prototype.getTimezoneOffset === 'function';
            
            return hasIntl && hasLocaleString && hasTimezoneOffset;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * 检查CSS特性支持
     * @returns {Object} CSS特性支持情况
     */
    checkCSSFeatures() {
        const result = {
            flexbox: false,
            grid: false,
            animations: false
        };
        
        // 检查flexbox支持
        if (typeof document.body.style.flexBasis !== 'undefined' || 
            typeof document.body.style.webkitFlexBasis !== 'undefined') {
            result.flexbox = true;
        }
        
        // 检查grid支持
        if (typeof document.body.style.grid !== 'undefined') {
            result.grid = true;
        }
        
        // 检查动画支持
        if (typeof document.body.style.animation !== 'undefined' || 
            typeof document.body.style.webkitAnimation !== 'undefined') {
            result.animations = true;
        }
        
        return result;
    }
    
    /**
     * 获取当前时区信息
     * @returns {Object} 时区信息
     */
    getTimeZoneInfo() {
        const date = new Date();
        
        return {
            offset: date.getTimezoneOffset(),
            offsetHours: -date.getTimezoneOffset() / 60,
            timeZoneName: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
            localeString: date.toLocaleString()
        };
    }
    
    /**
     * 应用兼容性修复
     */
    applyCompatibilityFixes() {
        // 如果不支持requestAnimationFrame，使用setTimeout作为替代
        if (!this.compatibilityResults.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
            
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
            
            console.warn('使用setTimeout替代requestAnimationFrame');
        }
        
        // 如果不支持Page Visibility API，使用替代方法
        if (!this.compatibilityResults.pageVisibility) {
            document.hidden = false;
            document.visibilityState = 'visible';
            
            // 使用blur和focus事件作为替代
            window.addEventListener('blur', function() {
                document.hidden = true;
                document.visibilityState = 'hidden';
                const event = new Event('visibilitychange');
                document.dispatchEvent(event);
            });
            
            window.addEventListener('focus', function() {
                document.hidden = false;
                document.visibilityState = 'visible';
                const event = new Event('visibilitychange');
                document.dispatchEvent(event);
            });
            
            console.warn('使用blur/focus事件替代Page Visibility API');
        }
        
        // 应用CSS兼容性修复
        this.applyCSSFixes();
    }
    
    /**
     * 应用CSS兼容性修复
     */
    applyCSSFixes() {
        const cssFeatures = this.compatibilityResults.cssFeatures;
        
        // 如果不支持flexbox，添加替代样式
        if (!cssFeatures.flexbox) {
            const style = document.createElement('style');
            style.textContent = `
                .timer-container {
                    display: block;
                    text-align: center;
                }
                
                .time-unit {
                    display: inline-block;
                    margin: 10px;
                }
            `;
            document.head.appendChild(style);
            
            console.warn('应用flexbox兼容性修复');
        }
        
        // 如果不支持动画，禁用动画效果
        if (!cssFeatures.animations) {
            const style = document.createElement('style');
            style.textContent = `
                .highlight {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
            
            console.warn('禁用不支持的动画效果');
        }
    }
    
    /**
     * 显示兼容性警告
     */
    showCompatibilityWarnings() {
        const results = this.compatibilityResults;
        const warnings = [];
        
        // 检查各项兼容性问题
        if (!results.requestAnimationFrame) {
            warnings.push('您的浏览器不支持requestAnimationFrame API，可能会影响动画性能');
        }
        
        if (!results.pageVisibility) {
            warnings.push('您的浏览器不支持Page Visibility API，切换标签页时性能优化可能不可用');
        }
        
        if (!results.es6Features) {
            warnings.push('您的浏览器不支持现代JavaScript特性，某些功能可能无法正常工作');
        }
        
        if (!results.timeZoneSupport) {
            warnings.push('您的浏览器对时区支持有限，时间计算可能不准确');
        }
        
        if (!results.cssFeatures.flexbox) {
            warnings.push('您的浏览器不支持Flexbox布局，页面显示可能不够美观');
        }
        
        if (!results.cssFeatures.animations) {
            warnings.push('您的浏览器不支持CSS动画，视觉效果将被简化');
        }
        
        // 如果有警告，显示在页面上
        if (warnings.length > 0) {
            const warningContainer = document.createElement('div');
            warningContainer.className = 'compatibility-warning';
            warningContainer.innerHTML = `
                <h3>浏览器兼容性警告</h3>
                <ul>
                    ${warnings.map(warning => `<li>${warning}</li>`).join('')}
                </ul>
                <p>建议使用最新版本的Chrome、Firefox或Safari浏览器以获得最佳体验。</p>
                <button id="dismiss-warning">我知道了</button>
            `;
            
            document.body.appendChild(warningContainer);
            
            // 添加关闭按钮事件
            document.getElementById('dismiss-warning').addEventListener('click', function() {
                warningContainer.style.display = 'none';
            });
        }
        
        return warnings;
    }
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserCompatibility;
}