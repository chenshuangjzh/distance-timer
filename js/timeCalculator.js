/**
 * TimeCalculator类 - 负责计算从特定起始时间到当前时间的精确时间差
 * 实现需求1.1和3.1，处理时间计算的核心逻辑
 */
class TimeCalculator {
    /**
     * 构造函数 - 初始化计时器的起始时间
     * 默认设置为2020年10月5日12:00:00
     * @param {Date|string|number} customStartDate - 可选的自定义起始时间
     * @throws {Error} 如果提供的日期无效
     */
    constructor(customStartDate) {
        try {
            // 设置起始时间为2020年10月5日12:00:00，或使用自定义起始时间
            if (customStartDate) {
                this.startDate = new Date(customStartDate);
                
                // 验证日期是否有效
                if (isNaN(this.startDate.getTime())) {
                    throw new Error('提供的起始日期无效');
                }
            } else {
                this.startDate = new Date(2020, 9, 5, 12, 0, 0, 0); // 注意：月份是从0开始的，所以10月是9
            }
        } catch (error) {
            console.error('初始化TimeCalculator时发生错误:', error);
            // 回退到默认日期
            this.startDate = new Date(2020, 9, 5, 12, 0, 0, 0);
            throw new Error(`初始化起始时间失败: ${error.message}`);
        }
    }

    /**
     * 计算从起始时间到当前时间的时间差
     * @param {Date} currentDate - 当前时间，默认为现在
     * @returns {Object} 包含年、月、日、时、分、秒、毫秒的时间差对象
     * @throws {Error} 如果日期计算出错
     */
    calculateTimeDifference(currentDate = new Date()) {
        try {
            // 确保我们使用的是当前时间的副本，避免修改原始对象
            currentDate = new Date(currentDate);
            
            // 验证日期是否有效
            if (isNaN(currentDate.getTime())) {
                throw new Error('提供的当前日期无效');
            }
            
            // 验证起始日期是否有效
            if (isNaN(this.startDate.getTime())) {
                throw new Error('起始日期无效');
            }
            
            // 获取起始时间的年、月、日、时、分、秒、毫秒
            const startYear = this.startDate.getFullYear();
            const startMonth = this.startDate.getMonth();
            const startDay = this.startDate.getDate();
            const startHour = this.startDate.getHours();
            const startMinute = this.startDate.getMinutes();
            const startSecond = this.startDate.getSeconds();
            const startMillisecond = this.startDate.getMilliseconds();
            
            // 获取当前时间的年、月、日、时、分、秒、毫秒
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDate();
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();
            const currentSecond = currentDate.getSeconds();
            const currentMillisecond = currentDate.getMilliseconds();
        
        // 初始化时间差对象
        let years = currentYear - startYear;
        let months = currentMonth - startMonth;
        let days = currentDay - startDay;
        let hours = currentHour - startHour;
        let minutes = currentMinute - startMinute;
        let seconds = currentSecond - startSecond;
        let milliseconds = currentMillisecond - startMillisecond;
        
        // 处理借位
        // 如果毫秒为负，从秒借位
        if (milliseconds < 0) {
            milliseconds += 1000;
            seconds -= 1;
        }
        
        // 如果秒为负，从分钟借位
        if (seconds < 0) {
            seconds += 60;
            minutes -= 1;
        }
        
        // 如果分钟为负，从小时借位
        if (minutes < 0) {
            minutes += 60;
            hours -= 1;
        }
        
        // 如果小时为负，从天借位
        if (hours < 0) {
            hours += 24;
            days -= 1;
        }
        
        // 如果天为负，从月借位（这里需要考虑不同月份的天数）
        if (days < 0) {
            // 获取上个月的天数
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            days += this.getDaysInMonth(prevMonthYear, prevMonth);
            months -= 1;
        }
        
        // 如果月为负，从年借位
        if (months < 0) {
            months += 12;
            years -= 1;
        }
        
        // 确保所有值都是非负的
        years = Math.max(0, years);
        months = Math.max(0, months);
        days = Math.max(0, days);
        hours = Math.max(0, hours);
        minutes = Math.max(0, minutes);
        seconds = Math.max(0, seconds);
        milliseconds = Math.max(0, milliseconds);
        
        return {
            years,
            months,
            days,
            hours,
            minutes,
            seconds,
            milliseconds
        };
        } catch (error) {
            console.error('计算时间差时发生错误:', error);
            // 返回默认值
            return {
                years: 0,
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0
            };
        }
    }

    /**
     * 判断指定年份是否为闰年
     * @param {number} year - 要检查的年份
     * @returns {boolean} 如果是闰年返回true，否则返回false
     */
    isLeapYear(year) {
        // 闰年规则：能被4整除但不能被100整除，或者能被400整除
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * 获取指定年月的天数
     * @param {number} year - 年份
     * @param {number} month - 月份（0-11，与Date对象一致）
     * @returns {number} 该月的天数
     */
    getDaysInMonth(year, month) {
        // 创建下个月的第0天（即当月的最后一天）
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * 格式化时间差显示
     * @param {Object} timeDiff - 时间差对象
     * @returns {string} 格式化的时间差字符串
     */
    formatTimeDisplay(timeDiff) {
        // 确保所有值都是数字，如果不是则默认为0
        const years = Number.isFinite(timeDiff.years) ? timeDiff.years : 0;
        const months = Number.isFinite(timeDiff.months) ? timeDiff.months : 0;
        const days = Number.isFinite(timeDiff.days) ? timeDiff.days : 0;
        const hours = Number.isFinite(timeDiff.hours) ? timeDiff.hours : 0;
        const minutes = Number.isFinite(timeDiff.minutes) ? timeDiff.minutes : 0;
        const seconds = Number.isFinite(timeDiff.seconds) ? timeDiff.seconds : 0;
        const milliseconds = Number.isFinite(timeDiff.milliseconds) ? timeDiff.milliseconds : 0;
        
        // 格式化为"X年Y月Z日W时V分U秒S毫秒"的格式
        return `${years}年${months}月${days}日${hours}时${minutes}分${seconds}秒${milliseconds}毫秒`;
    }
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimeCalculator;
}