/**
 * 集成测试 - 测试各模块间的协作
 */

// 模拟DOM环境
document.body.innerHTML = `
<div class="container">
    <h1>距离计时器</h1>
    <p class="subtitle">从2020年10月5日12点开始已经过去了</p>
    
    <div id="timer-container" class="timer-container">
        <div class="time-unit">
            <span id="years" class="time-value">0</span>
            <span class="time-label">年</span>
        </div>
        <div class="time-unit">
            <span id="months" class="time-value">0</span>
            <span class="time-label">月</span>
        </div>
        <div class="time-unit">
            <span id="days" class="time-value">0</span>
            <span class="time-label">日</span>
        </div>
        <div class="time-unit">
            <span id="hours" class="time-value">0</span>
            <span class="time-label">时</span>
        </div>
        <div class="time-unit">
            <span id="minutes" class="time-value">0</span>
            <span class="time-label">分</span>
        </div>
        <div class="time-unit">
            <span id="seconds" class="time-value">0</span>
            <span class="time-label">秒</span>
        </div>
        <div class="time-unit">
            <span id="milliseconds" class="time-value">0</span>
            <span class="time-label">毫秒</span>
        </div>
    </div>
    
    <div id="status-container" class="status-container">
        <div id="loading-indicator" class="loading-indicator hidden">加载中...</div>
        <div id="error-container" class="error-container hidden"></div>
    </div>
</div>
`;

describe('距离计时器集成测试', () => {
    let timeCalculator;
    let displayUpdater;
    let performanceManager;
    let distanceTimer;
    
    beforeEach(() => {
        // 创建各个模块的实例
        timeCalculator = new TimeCalculator();
        displayUpdater = new DisplayUpdater(document.getElementById('timer-container'));
        performanceManager = new PerformanceManager({
            updateInterval: 100,
            pauseWhenHidden: true
        });
        
        // 创建主应用实例
        distanceTimer = new DistanceTimer({
            containerId: 'timer-container',
            updateInterval: 100,
            pauseWhenHidden: true
        });
        
        // 重置DOM元素
        document.getElementById('years').textContent = '0';
        document.getElementById('months').textContent = '0';
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        document.getElementById('milliseconds').textContent = '0';
    });
    
    afterEach(() => {
        // 清理资源
        if (distanceTimer) {
            distanceTimer.cleanup();
        }
        
        if (performanceManager) {
            performanceManager.cleanup();
        }
    });
    
    // 测试模块间的协作
    test('各模块应该能够正确协作', () => {
        // 创建一个特定的日期用于测试
        const testDate = new Date(2022, 0, 1, 12, 0, 0, 0); // 2022-01-01 12:00:00
        
        // 计算时间差
        const timeDiff = timeCalculator.calculateTimeDifference(testDate);
        
        // 更新显示
        displayUpdater.updateDisplay(timeDiff);
        
        // 验证DOM是否正确更新
        expect(document.getElementById('years').textContent).toBe(String(timeDiff.years));
        expect(document.getElementById('months').textContent).toBe(String(timeDiff.months));
        expect(document.getElementById('days').textContent).toBe(String(timeDiff.days));
        expect(document.getElementById('hours').textContent).toBe(String(timeDiff.hours));
        expect(document.getElementById('minutes').textContent).toBe(String(timeDiff.minutes));
        expect(document.getElementById('seconds').textContent).toBe(String(timeDiff.seconds));
        expect(document.getElementById('milliseconds').textContent).toBe(String(timeDiff.milliseconds));
    });
    
    // 测试主应用的更新方法
    test('DistanceTimer的update方法应该正确更新显示', () => {
        // 模拟一个特定的时间
        const originalDate = global.Date;
        const mockDate = new Date(2022, 0, 1, 12, 0, 0, 0); // 2022-01-01 12:00:00
        
        // 替换全局Date构造函数
        global.Date = class extends Date {
            constructor() {
                return mockDate;
            }
        };
        
        // 执行更新
        distanceTimer.update();
        
        // 验证DOM是否正确更新
        const expectedTimeDiff = timeCalculator.calculateTimeDifference(mockDate);
        expect(document.getElementById('years').textContent).toBe(String(expectedTimeDiff.years));
        expect(document.getElementById('months').textContent).toBe(String(expectedTimeDiff.months));
        expect(document.getElementById('days').textContent).toBe(String(expectedTimeDiff.days));
        
        // 恢复原始Date构造函数
        global.Date = originalDate;
    });
    
    // 测试性能优化功能
    test('PerformanceManager应该能够正确暂停和恢复', () => {
        // 创建一个模拟回调函数
        const mockCallback = jest.fn();
        
        // 启动计时器
        performanceManager.startTimer(mockCallback);
        
        // 验证计时器已启动
        expect(performanceManager.isRunning).toBe(true);
        expect(performanceManager.isPaused).toBe(false);
        
        // 暂停计时器
        performanceManager.pauseTimer();
        
        // 验证计时器已暂停
        expect(performanceManager.isRunning).toBe(true);
        expect(performanceManager.isPaused).toBe(true);
        
        // 恢复计时器
        performanceManager.resumeTimer();
        
        // 验证计时器已恢复
        expect(performanceManager.isRunning).toBe(true);
        expect(performanceManager.isPaused).toBe(false);
        
        // 停止计时器
        performanceManager.stopTimer();
        
        // 验证计时器已停止
        expect(performanceManager.isRunning).toBe(false);
    });
    
    // 测试页面可见性API集成
    test('PerformanceManager应该响应页面可见性变化', () => {
        // 创建一个模拟回调函数
        const mockCallback = jest.fn();
        
        // 启动计时器
        performanceManager.startTimer(mockCallback);
        
        // 模拟页面隐藏事件
        Object.defineProperty(document, 'hidden', { value: true, writable: true });
        const visibilityEvent = new Event('visibilitychange');
        document.dispatchEvent(visibilityEvent);
        
        // 验证计时器已暂停
        expect(performanceManager.isPaused).toBe(true);
        
        // 模拟页面可见事件
        Object.defineProperty(document, 'hidden', { value: false, writable: true });
        document.dispatchEvent(visibilityEvent);
        
        // 验证计时器已恢复
        expect(performanceManager.isPaused).toBe(false);
    });
});