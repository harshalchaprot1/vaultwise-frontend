import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReportsService } from '../../core/services/reports.service';
import { ReportSummary } from '../../core/models/report.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  readonly summary = signal<ReportSummary | null>(null);
  readonly loading = signal(false);
  readonly loadFailed = signal(false);

  constructor(private readonly reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.reportsService.getSummary().subscribe({
      next: (res) => {
        this.summary.set(res);
        this.loadFailed.set(false);
        this.loading.set(false);
      },
      error: () => {
        this.loadFailed.set(true);
        this.loading.set(false);
      }
    });
  }
}
