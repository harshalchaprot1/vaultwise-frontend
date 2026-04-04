import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Budget } from '../../core/models/budget.model';
import { AuthService } from '../../core/services/auth.service';
import { BudgetUpsertPayload, BudgetsService } from '../../core/services/budgets.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    PercentPipe,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatProgressBarModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly displayedColumns = ['category', 'period', 'limitAmount', 'spent', 'usage', 'actions'];
  readonly budgets = signal<Budget[]>([]);

  readonly form = this.fb.nonNullable.group({
    categoryId: [0, [Validators.required, Validators.min(1)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  private editingId: number | null = null;

  constructor(
    private readonly budgetsService: BudgetsService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      return;
    }

    const formValue = this.form.getRawValue();
    const payload: BudgetUpsertPayload = {
      user_id: userId,
      category_id: formValue.categoryId,
      amount: formValue.amount,
      start_date: formValue.startDate,
      end_date: formValue.endDate
    };

    if (this.editingId) {
      this.budgetsService.update(this.editingId, payload).subscribe(() => {
        this.resetForm();
        this.loadBudgets();
        this.snackBar.open('Budget updated successfully.', 'Close', { duration: 2600 });
      }, () => {
        this.snackBar.open('Update failed. Check required fields.', 'Close', { duration: 3500 });
      });
      return;
    }

    this.budgetsService.create(payload).subscribe(() => {
      this.resetForm();
      this.loadBudgets();
      this.snackBar.open('Budget saved successfully.', 'Close', { duration: 2600 });
    }, () => {
      this.snackBar.open('Save failed. Check category ID and dates.', 'Close', { duration: 3500 });
    });
  }

  edit(row: Budget): void {
    this.editingId = row.id;
    this.form.patchValue({
      categoryId: Number(row.category),
      amount: row.limitAmount,
      startDate: '',
      endDate: ''
    });
  }

  remove(id: number): void {
    this.budgetsService.delete(id).subscribe(() => this.loadBudgets());
  }

  usagePercent(row: Budget): number {
    if (!row.spent || row.limitAmount === 0) {
      return 0;
    }
    return Math.min((row.spent / row.limitAmount) * 100, 100);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private loadBudgets(): void {
    this.budgetsService.getAll().subscribe((rows) => this.budgets.set(rows));
  }

  private resetForm(): void {
    this.editingId = null;
    this.form.reset({ categoryId: 0, amount: 0, startDate: '', endDate: '' });
  }
}
