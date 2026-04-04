import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Transaction } from '../../core/models/transaction.model';
import { TransactionUpsertPayload, TransactionsService } from '../../core/services/transactions.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly displayedColumns = ['date', 'type', 'category', 'amount', 'description', 'actions'];
  readonly transactions = signal<Transaction[]>([]);

  readonly form = this.fb.nonNullable.group({
    type: ['expense' as 'income' | 'expense', Validators.required],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    brandId: [0],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    note: [''],
    transactionDate: ['', Validators.required]
  });

  private editingId: number | null = null;

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
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
    const payload: TransactionUpsertPayload = {
      user_id: userId,
      category_id: formValue.categoryId,
      amount: formValue.amount,
      type: formValue.type,
      note: formValue.note,
      transaction_date: formValue.transactionDate,
      brand_id: formValue.brandId > 0 ? formValue.brandId : undefined
    };

    if (this.editingId) {
      this.transactionsService.update(this.editingId, payload).subscribe((updated) => {
        this.transactions.update((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
        this.resetForm();
        this.snackBar.open('Transaction updated successfully.', 'Close', { duration: 2600 });
      }, () => {
        this.snackBar.open('Update failed. Check category ID and required fields.', 'Close', { duration: 3500 });
      });
      return;
    }

    this.transactionsService.create(payload).subscribe((created) => {
      this.transactions.update((rows) => [created, ...rows]);
      this.resetForm();
      this.snackBar.open('Transaction saved successfully.', 'Close', { duration: 2600 });
    }, () => {
      this.snackBar.open('Save failed. Use valid category ID and date.', 'Close', { duration: 3500 });
    });
  }

  edit(transaction: Transaction): void {
    this.editingId = transaction.id;
    this.form.patchValue({
      type: transaction.type,
      categoryId: Number(transaction.category),
      brandId: 0,
      amount: transaction.amount,
      note: transaction.description || '',
      transactionDate: transaction.date.slice(0, 10)
    });
  }

  remove(id: number): void {
    this.transactionsService.delete(id).subscribe(() => this.loadTransactions());
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private loadTransactions(): void {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      return;
    }

    this.transactionsService.getAllByUser(userId).subscribe({
      next: (rows) => this.transactions.set(rows),
      error: () => this.transactions.set([])
    });
  }

  private resetForm(): void {
    this.editingId = null;
    this.form.reset({ type: 'expense', categoryId: 0, brandId: 0, amount: 0, note: '', transactionDate: '' });
  }
}
