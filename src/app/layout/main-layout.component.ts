import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  private readonly observer = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  readonly isMobile = signal(false);
  readonly sidenavOpened = signal(true);

  readonly navItems = [
    { icon: 'space_dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'receipt_long', label: 'Transactions', route: '/transactions' },
    { icon: 'savings', label: 'Budgets', route: '/budgets' },
    { icon: 'analytics', label: 'Reports', route: '/reports' }
  ];

  readonly drawerMode = computed(() => (this.isMobile() ? 'over' : 'side'));

  constructor(
    readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.observer
      .observe('(max-width: 960px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.isMobile.set(state.matches);
        this.sidenavOpened.set(!state.matches);
      });
  }

  toggleSidenav(): void {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  closeForMobile(): void {
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
