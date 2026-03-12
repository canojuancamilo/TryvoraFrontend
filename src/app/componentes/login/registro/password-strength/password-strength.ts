import { ChangeDetectionStrategy, Component, input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  imports: [],
  templateUrl: './password-strength.html',
  styleUrl: './password-strength.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrength { 
   password= input<string>('');
  
  strengthWidth: string = '0%';
  strengthColor: string = '#EF4444';
  strengthLabel: string = '';
  strengthClass: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['password']) {
      this.calculateStrength();
    }
  }

  private calculateStrength(): void {
    if (!this.password) {
      this.strengthWidth = '0%';
      this.strengthLabel = '';
      return;
    }

    let score = 0;
    if (this.password.length >= 8) score++;
    if (/[A-Z]/.test(this.password())) score++;
    if (/[0-9]/.test(this.password())) score++;
    if (/[^A-Za-z0-9]/.test(this.password())) score++;

    const levels = [
      { pct: '25%', color: '#EF4444', text: 'Débil', cls: 'text-danger' },
      { pct: '50%', color: '#F59E0B', text: 'Regular', cls: 'text-warning' },
      { pct: '75%', color: '#06B6D4', text: 'Buena', cls: 'text-info' },
      { pct: '100%', color: '#10B981', text: 'Fuerte', cls: 'text-success' },
    ];

    const level = levels[Math.max(0, score - 1)] || levels[0];
    this.strengthWidth = level.pct;
    this.strengthColor = level.color;
    this.strengthLabel = level.text;
    this.strengthClass = level.cls;
  }
}