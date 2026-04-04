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
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);

  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    phoneNos: ['']
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

    const { name, email, password, confirmPassword, phoneNos } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    this.authService.register({
      name,
      email,
      password,
      phone_nos: this.toPhoneListOrNull(phoneNos)
    }).pipe(
      switchMap((authRes) => {
        const normalizedPhone = phoneNos.trim();
        if (!normalizedPhone) {
          return of(authRes);
        }

        return this.usersService
          .update(authRes.user.id, {
            name,
            email,
            phone_nos: normalizedPhone
          })
          .pipe(switchMap(() => of(authRes)));
      })
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Registration successful. Please sign in.', 'Close', { duration: 3000 });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || 'Registration failed. Try a different email.';
        this.snackBar.open(msg, 'Close', { duration: 3500 });
      }
    });
  }

  private toPhoneListOrNull(rawValue: string): string[] | null {
    const values = rawValue
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    return values.length ? values : null;
  }
}
