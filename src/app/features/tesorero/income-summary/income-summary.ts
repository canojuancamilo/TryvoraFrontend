import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IncomeService } from '../../../servicios/income.service';

@Component({
  selector: 'app-income-summary',
  imports: [],
  templateUrl: './income-summary.html',
  styleUrl: './income-summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeSummary {
  incomeService = inject(IncomeService);

  readonly masculineTotal = computed(() => 
    this.incomeService.masculine().total.toFixed(2)
  );
  
  readonly feminineTotal = computed(() => 
    this.incomeService.feminine().total.toFixed(2)
  );
  
  readonly grandTotalFormatted = computed(() => 
    this.incomeService.grandTotal().toFixed(2)
  );
}
