import lightTheme from "../themes/lightTheme";
import darkTheme from "../themes/darkTheme";

// Types.ts
export interface WeekData {
    dateDay: number;
    weekDates: Date[];
    monthName: string;
    dateYear: number;
    dateMonth: number;
    fullDate: string;
  }
  
  export interface CalendarSelectorProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    theme: typeof lightTheme | typeof darkTheme; // Assurez-vous que ces thèmes sont correctement définis quelque part.
  }
  