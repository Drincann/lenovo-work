const HolidaysAdditional = [
  { month: 1, day: 1 },
  { month: 1, day: 2 },
  { month: 1, day: 3 },
  { month: 2, day: 11 },
  { month: 2, day: 12 },
  { month: 2, day: 13 },
  { month: 2, day: 14 },
  { month: 2, day: 15 },
  { month: 2, day: 16 },
  { month: 2, day: 17 },
  { month: 4, day: 3 },
  { month: 4, day: 4 },
  { month: 4, day: 5 },
  { month: 5, day: 1 },
  { month: 5, day: 2 },
  { month: 5, day: 3 },
  { month: 5, day: 4 },
  { month: 5, day: 5 },
  { month: 6, day: 12 },
  { month: 6, day: 13 },
  { month: 6, day: 14 },
  { month: 9, day: 19 },
  { month: 9, day: 20 },
  { month: 9, day: 21 },
  { month: 10, day: 1 },
  { month: 10, day: 2 },
  { month: 10, day: 3 },
  { month: 10, day: 4 },
  { month: 10, day: 5 },
  { month: 10, day: 6 },
  { month: 10, day: 7 },
];


/**
 * @desc 工厂, 通过工作小时列表构造计算函数
 * @param workHours 工作小时列表
 * @returns 一个计算函数
 */
export const createCalculator = (workHours?: number[]) => {
  const workHoursOfDay = new Set(workHours ?? [9, 10, 11, 13, 14, 15, 16, 17,]);
  const holidaysSetCache = new Map<number, Set<string> /* Date string */>();

  /**
   * @desc 生成指定年份的节假日列表
   * @param year 年份
   * @returns 节假日列表
   */
  const generateHoliday = (year: number): Date[] => {
    const holidays: Date[] = [];
    const date = new Date(year, 0, 1);

    while (date.getFullYear() === year) {
      if (date.getDay() === 0 || date.getDay() === 6) {
        holidays.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }
    return holidays.concat([
      ...HolidaysAdditional.map(date => new Date(year, date.month - 1, date.day)),
    ]);
  }

  /**
   * @desc 管理节假日列表缓存
   * @param year 
   * @returns 
   */
  const useHolidaysSet = (year: number): Set<string> => {
    if (!holidaysSetCache.has(year)) {
      holidaysSetCache.set(year, new Set(generateHoliday(year).map(date => date.toDateString())));
    }
    return holidaysSetCache.get(year)!;
  };

  return (start: Date, hours: number): Date => {
    const end = new Date(start.getTime());

    while (hours > 0) {
      const holidaysSet = useHolidaysSet(end.getFullYear());
      end.setHours(end.getHours() + 1);
      if (holidaysSet.has(end.toDateString())) continue;
      if (workHoursOfDay.has(end.getHours())) hours--;
    }
    return end;
  }
}


