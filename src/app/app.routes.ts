import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { BudgetsComponent } from './features/budgets/budgets.component';
import { ReportsComponent } from './features/reports/reports.component';

export const routes: Routes = [
	{
		path: 'auth/login',
		component: LoginComponent
	},
	{
		path: 'login',
		redirectTo: 'auth/login',
		pathMatch: 'full'
	},
	{
		path: 'auth/register',
		component: RegisterComponent
	},
	{
		path: '',
		canActivate: [authGuard],
		component: MainLayoutComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'transactions', component: TransactionsComponent },
			{ path: 'budgets', component: BudgetsComponent },
			{ path: 'reports', component: ReportsComponent }
		]
	},
	{ path: '**', redirectTo: 'auth/login' }
];
