import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';

export type BranchType = 'todos' | 'masculino' | 'femenino';

@Component({
  selector: 'app-branch-filter',
  imports: [],
  templateUrl: './branch-filter.html',
  styleUrl: './branch-filter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BranchFilter {// Usamos model() para two-way binding con la señal del padre
  activeBranch = model<BranchType>('todos');

  // También podemos emitir un output separado si es necesario
  branchChange = output<BranchType>();

  setBranch(branch: BranchType) {
    this.activeBranch.set(branch);
    this.branchChange.emit(branch);
  }
}
