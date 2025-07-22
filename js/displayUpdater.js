/**
 * DisplayUpdater类 - 负责更新DOM元素以显示时间差
 * 实现需求2.1和2.2，处理显示更新的逻辑
 */
class DisplayUpdater {
    /**
     * 构造函数 - 初始化显示更新器
     * @param {Object} containerElement - 包含时间显示元素的DOM容器
     */
    constructor(containerElement) {
        // 存储容器元素引用
        this.container = containerElement;
        
        // 存储各个时间单位的DOM元素引用
        this.elements = {
            years: document.getElementById('years'),
            months: document.getElementById('months'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            milliseconds: document.getElementById('milliseconds')
        };
        
        // 验证所有必需的DOM元素是否存在
        this.validateElements();
    }
    
    /**
     * 验证所有必需的DOM元素是否存在
     * @throws {Error} 如果任何必需的元素不存在
     */
    validateElements() {
        // 检查容器元素
        if (!this.container) {
            throw new Error('容器元素不存在');
        }
        
        // 检查各个时间单位的DOM元素
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                throw new Error(`时间单位元素 ${key} 不存在`);
            }
        }
    }
    
    /**
     * 更新显示以反映当前时间差
     * @param {Object} timeData - 包含时间差数据的对象
     */
    updateDisplay(timeData) {
        // 更新每个时间单位的显示
        for (const [unit, value] of Object.entries(timeData)) {
            if (this.elements[unit]) {
                // 检查值是否发生变化
                const currentValue = this.elements[unit].textContent;
                const newValue = String(value);
                
                if (currentValue !== newValue) {
                    // 更新DOM元素的内容
                    this.elements[unit].textContent = newValue;
                    
                    // 添加变化的视觉效果
                    this.animateChange(this.elements[unit]);
                }
            }
        }
    }
    
    /**
     * 为变化的元素添加动画效果
     * @param {HTMLElement} element - 要添加动画的DOM元素
     */
    animateChange(element) {
        // 添加高亮类
        element.classList.add('highlight');
        
        // 300毫秒后移除高亮类
        setTimeout(() => {
            element.classList.remove('highlight');
        }, 300);
    }
    
    /**
     * 创建时间单位显示元素
     * @param {number|string} value - 时间值
     * @param {string} unit - 时间单位（年、月、日等）
     * @returns {HTMLElement} 创建的DOM元素
     */
    createTimeElement(value, unit) {
        // 创建时间单位的容器
        const container = document.createElement('div');
        container.className = 'time-unit';
        
        // 创建值元素
        const valueElement = document.createElement('span');
        valueElement.className = 'time-value';
        valueElement.textContent = value;
        
        // 创建单位标签元素
        const labelElement = document.createElement('span');
        labelElement.className = 'time-label';
        labelElement.textContent = unit;
        
        // 组装元素
        container.appendChild(valueElement);
        container.appendChild(labelElement);
        
        return container;
    }
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DisplayUpdater;
}