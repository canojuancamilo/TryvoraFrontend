import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BranchStats } from '../../../core/models/dashboard-admin.model';

@Component({
  selector: 'app-branch-summary',
  imports: [],
  templateUrl: './BranchSummary.html',
  styleUrl: './BranchSummary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchSummary { 
   branchStats = input<{
    masculino: BranchStats;
    femenino: BranchStats;
    total: BranchStats;
  } | null>(null);
}
