import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);

  readonly hidePassword = signal(true);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { identifier, password } = this.form.getRawValue();
    this.resolveEmail(identifier)
      .pipe(
        switchMap((email) =>
          this.authService.login({
            email,
            password
          })
        )
      )
      .subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || 'Login failed. Verify email/user ID and password.';
        this.snackBar.open(msg, 'Close', {
          duration: 3500
        });
      }
    });
  }

  private resolveEmail(identifier: string) {
    const normalized = identifier.trim();
    if (normalized.includes('@')) {
      return of(normalized);
    }

    const userId = Number(normalized);
    if (!Number.isInteger(userId) || userId <= 0) {
      return throwError(() => new Error('Enter a valid email or numeric user ID.'));
    }

    return this.usersService.getAll().pipe(
      switchMap((users) => {
        const matched = users.find((u) => u.id === userId);
        if (!matched) {
          return throwError(() => new Error('No user found for that ID.'));
        }
        return of(matched.email);
      }),
      catchError(() => throwError(() => new Error('Unable to resolve user ID. Please use email login.')))
    );
  }

}
