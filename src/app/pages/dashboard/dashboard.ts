import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { MonthlyBorrowingChart } from './components/monthlyborrowingchart';
import { BorrowingByGradeChart } from './components/borrowingbygradechar';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, MonthlyBorrowingChart, BorrowingByGradeChart],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <!-- Statistics Cards -->
            <app-stats-widget class="contents" />

            <!-- Monthly Borrowing Chart - Full Width Row -->
            <div class="col-span-12 mt-8">
                <app-monthly-borrowing-chart />
            </div>

            <!-- Borrowing by Grade Chart - Full Width Row -->
            <div class="col-span-12 mt-8">
                <app-borrowing-by-grade-chart />
            </div>
        </div>
    `
})
export class Dashboard {}
