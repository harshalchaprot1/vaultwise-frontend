import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MonthlyReport } from '../../core/models/report.model';
import { ReportsService } from '../../core/services/reports.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly displayedColumns = ['month', 'income', 'expense', 'net'];
  readonly rows = signal<MonthlyReport[]>([]);

  readonly yearForm = this.fb.nonNullable.group({
    year: [new Date().getFullYear(), [Validators.required, Validators.min(2020), Validators.max(2100)]]
  });

  constructor(
    private readonly reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (this.yearForm.invalid) {
      return;
    }

    const year = this.yearForm.getRawValue().year;
    this.reportsService.getMonthly(year).subscribe((rows) => this.rows.set(rows));
  }

  net(row: MonthlyReport): number {
    return row.income - row.expense;
  }
}
