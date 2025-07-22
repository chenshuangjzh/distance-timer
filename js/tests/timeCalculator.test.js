/**
 * 时间计算模块的单元测试
 * 测试TimeCalculator类的功能和准确性
 */

// 导入TimeCalculator类
// 注意：在浏览器环境中，这个导入方式可能需要调整
const TimeCalculator = require('../timeCalculator.js');

// 测试套件
describe('TimeCalculator', () => {
    let calculator;
    
    // 在每个测试前创建一个新的计算器实例
    beforeEach(() => {
        calculator = new TimeCalculator();
    });
    
    // 测试闰年判断方法
    describe('isLeapYear', () => {
        test('应该正确识别闰年', () => {
            expect(calculator.isLeapYear(2020)).toBe(true); // 2020是闰年
            expect(calculator.isLeapYear(2000)).toBe(true); // 能被400整除的年份是闰年
            expect(calculator.isLeapYear(2024)).toBe(true); // 2024是闰年
        });
        
        test('应该正确识别非闰年', () => {
            expect(calculator.isLeapYear(2021)).toBe(false); // 2021不是闰年
            expect(calculator.isLeapYear(2100)).toBe(false); // 能被100整除但不能被400整除的年份不是闰年
            expect(calculator.isLeapYear(2023)).toBe(false); // 2023不是闰年
        });
    });
    
    // 测试获取月份天数方法
    describe('getDaysInMonth', () => {
        test('应该返回正确的月份天数', () => {
            expect(calculator.getDaysInMonth(2023, 0)).toBe(31); // 1月有31天
            expect(calculator.getDaysInMonth(2023, 1)).toBe(28); // 2023年2月有28天
            expect(calculator.getDaysInMonth(2020, 1)).toBe(29); // 2020年2月有29天（闰年）
            expect(calculator.getDaysInMonth(2023, 3)).toBe(30); // 4月有30天
            expect(calculator.getDaysInMonth(2023, 7)).toBe(31); // 8月有31天
        });
    });
    
    // 测试时间差计算方法
    describe('calculateTimeDifference', () => {
        test('应该正确计算简单的时间差', () => {
            // 创建一个比起始时间晚1年2个月3天4小时5分钟6秒7毫秒的日期
            const startDate = calculator.startDate; // 2020-10-05 12:00:00
            const laterDate = new Date(
                startDate.getFullYear() + 1,
                startDate.getMonth() + 2,
                startDate.getDate() + 3,
                startDate.getHours() + 4,
                startDate.getMinutes() + 5,
                startDate.getSeconds() + 6,
                startDate.getMilliseconds() + 7
            );
            
            const diff = calculator.calculateTimeDifference(laterDate);
            
            expect(diff.years).toBe(1);
            expect(diff.months).toBe(2);
            expect(diff.days).toBe(3);
            expect(diff.hours).toBe(4);
            expect(diff.minutes).toBe(5);
            expect(diff.seconds).toBe(6);
            expect(diff.milliseconds).toBe(7);
        });
        
        test('应该正确处理需要借位的情况', () => {
            // 创建一个日期：2021-09-04 11:59:59.999（比起始时间少1天、1分钟、1秒、1毫秒）
            const laterDate = new Date(2021, 8, 4, 11, 59, 59, 999);
            
            const diff = calculator.calculateTimeDifference(laterDate);
            
            expect(diff.years).toBe(0);
            expect(diff.months).toBe(11);
            expect(diff.days).toBe(29); // 30天（9月）- 1天
            expect(diff.hours).toBe(23); // 24小时 - 1小时
            expect(diff.minutes).toBe(59); // 60分钟 - 1分钟
            expect(diff.seconds).toBe(59); // 60秒 - 1秒
            expect(diff.milliseconds).toBe(999); // 1000毫秒 - 1毫秒
        });
        
        test('应该正确处理月末和闰年', () => {
            // 测试从2020-02-29（闰年2月29日）到2021-03-01的时间差
            const leapYearDate = new Date(2020, 1, 29, 12, 0, 0, 0);
            const nextYearDate = new Date(2021, 2, 1, 12, 0, 0, 0);
            
            // 临时修改计算器的起始日期
            calculator.startDate = leapYearDate;
            
            const diff = calculator.calculateTimeDifference(nextYearDate);
            
            expect(diff.years).toBe(1);
            expect(diff.months).toBe(0);
            expect(diff.days).toBe(1);
            expect(diff.hours).toBe(0);
            expect(diff.minutes).toBe(0);
            expect(diff.seconds).toBe(0);
            expect(diff.milliseconds).toBe(0);
        });
    });
    
    // 测试时间格式化方法
    describe('formatTimeDisplay', () => {
        test('应该正确格式化时间差', () => {
            const timeDiff = {
                years: 1,
                months: 2,
                days: 3,
                hours: 4,
                minutes: 5,
                seconds: 6,
                milliseconds: 7
            };
            
            const formatted = calculator.formatTimeDisplay(timeDiff);
            expect(formatted).toBe('1年2月3日4时5分6秒7毫秒');
        });
        
        test('应该处理缺失的值', () => {
            const timeDiff = {
                years: 1,
                // 缺少months
                days: 3,
                // 缺少hours
                minutes: 5,
                // 缺少seconds
                milliseconds: 7
            };
            
            const formatted = calculator.formatTimeDisplay(timeDiff);
            expect(formatted).toBe('1年0月3日0时5分0秒7毫秒');
        });
        
        test('应该处理非数字值', () => {
            const timeDiff = {
                years: '1', // 字符串
                months: NaN, // 非数字
                days: undefined, // 未定义
                hours: null, // 空值
                minutes: 5,
                seconds: 6,
                milliseconds: 7
            };
            
            const formatted = calculator.formatTimeDisplay(timeDiff);
            expect(formatted).toBe('1年0月0日0时5分6秒7毫秒');
        });
    });
});