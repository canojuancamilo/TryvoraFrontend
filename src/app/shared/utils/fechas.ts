import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FechasUtils {

  public formatearFecha(date: any, format: string): string {
    if (!date) return '';

    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      try {
        // Limpiar el formato "a. m." y "p. m." (nota el espacio fino)
        let cleanDateStr = date
          .replace(/a\.\s*m\./gi, 'AM')
          .replace(/p\.\s*m\./gi, 'PM')
          .replace(/\s+/g, ' ')  // Normalizar espacios
          .trim();

        dateObj = new Date(cleanDateStr);

        if (isNaN(dateObj.getTime())) {
          // Intentar parsear manualmente si new Date falla
          const match = cleanDateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
          if (match) {
            const [, day, month, year] = match;
            dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else {
            return '';
          }
        }
      } catch {
        return '';
      }
    } else {
      return '';
    }

    return this.formatDateCustom(dateObj, format);
  }

  public isValidDate(date: Date | null): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

 public parseDate(value: string, format: string = "dd/MM/yyyy"): Date | null {
  if (!value) {
    return null;
  }

  value = value.replace(/\u00A0/g, ' ');
  const hasSpanishTime = /a\.\s*m\.|p\.\s*m\./i.test(value);
  
  if (hasSpanishTime) {    
    const normalizedValue = value
      .replace(/a\.\s*m\./gi, 'AM')
      .replace(/p\.\s*m\./gi, 'PM')
      .replace(/\s+/g, ' ')
      .trim();    
   
    let finalFormat = "dd/MM/yyyy";    
    const hasSeconds = normalizedValue.match(/:\d{2}:\d{2}\s+(AM|PM)$/i);
    const hasHourMin = normalizedValue.match(/:\d{2}\s+(AM|PM)$/i);
    
    if (hasSeconds) {
      finalFormat = "dd/MM/yyyy HH:mm:ss aa";
    } else if (hasHourMin) {
      finalFormat = "dd/MM/yyyy HH:mm aa";
    }

    const tokens = this.extractTokensFromFormat(finalFormat);    
    const regexPattern = this.createRegexFromFormat(finalFormat, tokens);    
    const regex = new RegExp(`^${regexPattern}$`);    
    const match = normalizedValue.match(regex);
    
    if (match) {
      const dateParts = this.extractDateParts(match, tokens);
      const result = this.createDateFromParts(dateParts);

      return result;
    } else {
      const directRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s+(AM|PM)$/i;
      const directMatch = normalizedValue.match(directRegex);
      
      if (directMatch) {
        const [, day, month, year, hour, minute, second, ampm] = directMatch;
        
        let hour24 = parseInt(hour, 10);
        const isPM = ampm.toUpperCase() === 'PM';
        
        if (isPM && hour24 < 12) {
          hour24 += 12;
        } else if (!isPM && hour24 === 12) {
          hour24 = 0;
        }
        
        const date = new Date(
          parseInt(year, 10),
          parseInt(month, 10) - 1,
          parseInt(day, 10),
          hour24,
          parseInt(minute, 10),
          parseInt(second, 10)
        );
        
        return this.isValidDate(date) ? date : null;
      }

      const nativeDate = new Date(normalizedValue);      
      const isValid = this.isValidDate(nativeDate);
      return isValid ? nativeDate : null;
    }
  }

  if (typeof value === 'string' && value.includes('T')) {
    const isoDate = new Date(value);
    return this.isValidDate(isoDate) ? isoDate : null;
  }
  
  const tokens = this.extractTokensFromFormat(format);
  
  const regexPattern = this.createRegexFromFormat(format, tokens);
  
  const regex = new RegExp(`^${regexPattern}$`);
  
  const match = value.match(regex);
  
  if (!match) {
    const nativeDate = new Date(value);
    
    const isValid = this.isValidDate(nativeDate);
    return isValid ? nativeDate : null;
  }
  
  const dateParts = this.extractDateParts(match, tokens);
  
  const result = this.createDateFromParts(dateParts);
  
  return result;
}

  private formatDateCustom(date: Date, format: string): string {

    const tokens: { [key: string]: string } = {
      'YYYY': date.getFullYear().toString(),
      'yyyy': date.getFullYear().toString(),
      'YY': date.getFullYear().toString().slice(-2),
      'yy': date.getFullYear().toString().slice(-2),

      'MM': (date.getMonth() + 1).toString().padStart(2, '0'),
      'M': (date.getMonth() + 1).toString(),

      'DD': date.getDate().toString().padStart(2, '0'),
      'dd': date.getDate().toString().padStart(2, '0'),
      'D': date.getDate().toString(),
      'd': date.getDate().toString(),

      'HH': date.getHours().toString().padStart(2, '0'),
      'H': date.getHours().toString(),

      'mm': date.getMinutes().toString().padStart(2, '0'),
      'm': date.getMinutes().toString(),

      'ss': date.getSeconds().toString().padStart(2, '0'),
      's': date.getSeconds().toString(),
    };

    const regex = /YYYY|yyyy|YY|yy|MM|M|DD|dd|D|d|HH|H|mm|m|ss|s/g;

    return format.replace(regex, match => {
      const normalizedMatch = match.toUpperCase();

      if (['YYYY', 'YY', 'DD', 'D'].includes(normalizedMatch)) {
        return tokens[normalizedMatch] || match;
      }

      return tokens[match] || match;
    });
  }

  private extractTokensFromFormat(format: string): string[] {
    const tokenPattern = /YYYY|yyyy|YY|yy|MM|M|DD|dd|D|d|HH|H|hh|h|mm|m|ss|s|aaaa|aa|AAAA|AA/g;
    return format.match(tokenPattern) || [];
  }

  private createRegexFromFormat(format: string, tokens: string[]): string {  
  const tokenPatterns: { [key: string]: string } = {};

  tokens.forEach(token => {
    const upperToken = token.toUpperCase();
    
    switch (upperToken) {
      case 'YYYY':
      case 'AAAA':
        tokenPatterns[token] = '(\\d{4})';
        break;
      case 'YY':
      case 'AA':
        tokenPatterns[token] = '(\\d{2})';
        break;
      case 'MM':
      case 'DD':
      case 'HH':
      case 'hh':
      case 'mm':
      case 'ss':
        tokenPatterns[token] = '(\\d{2})';
        break;
      case 'M':
      case 'D':
      case 'd':
      case 'H':
      case 'h':
      case 'm':
      case 's':
        tokenPatterns[token] = '(\\d{1,2})';
        break;
      case 'AAAA':
      case 'AA':
      case 'aaaa':
      case 'aa':
        tokenPatterns[token] = '([AP]M|[ap]m)';
        break;
      default:
        tokenPatterns[token] = '(\\d+)';
    }
  });

  let regexPattern = '';
  let i = 0;
  
  while (i < format.length) {
    let tokenFound = false;

    for (const token of tokens) {
      if (format.startsWith(token, i)) {
        regexPattern += tokenPatterns[token];
        i += token.length;
        tokenFound = true;
        break;
      }
    }

    if (!tokenFound) {
      const char = format[i];
      if (/[.*+?^${}()|[\]\\]/.test(char)) {
        regexPattern += '\\' + char;
      } else {
        regexPattern += char;
      }
      i++;
    }
  }
  
  return regexPattern;
}

private extractDateParts(match: RegExpMatchArray, tokens: string[]): any {  
  const parts: any = {};

  for (let i = 1; i < match.length; i++) {
    const token = tokens[i - 1];
    const value = match[i];

    const upperToken = token.toUpperCase();
    if (upperToken === 'AAAA' || upperToken === 'AA' || 
        token === 'aaaa' || token === 'aa') {
      parts.isPM = value.toUpperCase() === 'PM';
      continue;
    }

    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) {
      continue;
    }

    switch (upperToken) {
      case 'YYYY':
      case 'AAAA':
      case 'YY':
      case 'AA':
        parts.year = token.length <= 2 ? this.expandTwoDigitYear(numericValue) : numericValue;
        break;
      case 'MM':
      case 'M':
        parts.month = numericValue - 1;
        break;
      case 'DD':
      case 'D':
      case 'dd':
      case 'd':
        parts.day = numericValue;
        break;
      case 'HH':
      case 'H':
        parts.hours = numericValue;
        parts.is24Hour = true;
        break;
      case 'hh':
      case 'h':
        parts.hours = numericValue;
        parts.is24Hour = false;
        break;
      case 'mm':
      case 'm':
        parts.minutes = numericValue;
        break;
      case 'ss':
      case 's':
        parts.seconds = numericValue;
        break;
      default:
    }
  }
  
  return parts;
}

  private createDateFromParts(parts: any): Date | null {
    if (parts.year === undefined || parts.month === undefined || parts.day === undefined) {
      return null;
    }

    const hours = parts.hours || 0;
    const minutes = parts.minutes || 0;
    const seconds = parts.seconds || 0;
    let adjustedHours = hours;

    if (!parts.is24Hour && parts.isPM && hours < 12) {
      adjustedHours = hours + 12;
    } else if (!parts.is24Hour && !parts.isPM && hours === 12) {
      adjustedHours = 0;
    }

    if (parts.year < 1900 || parts.year > 2100) return null;
    if (parts.month < 0 || parts.month > 11) return null;
    if (parts.day < 1 || parts.day > 31) return null;
    if (adjustedHours < 0 || adjustedHours > 23) return null;
    if (minutes < 0 || minutes > 59) return null;
    if (seconds < 0 || seconds > 59) return null;

    const date = new Date(
      parts.year,
      parts.month,
      parts.day,
      adjustedHours,
      minutes,
      seconds
    );

    return this.isValidDate(date) ? date : null;
  }

  private expandTwoDigitYear(year: number): number {
    if (year >= 0 && year <= 79) {
      return 2000 + year;
    } else if (year >= 80 && year <= 99) {
      return 1900 + year;
    }

    return year;
  }
}