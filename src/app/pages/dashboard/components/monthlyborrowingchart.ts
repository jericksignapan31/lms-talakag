import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FirestoreBorrowingService } from '../../../services/firestore-borrowing.service';

@Component({
    standalone: true,
    selector: 'app-monthly-borrowing-chart',
    imports: [CommonModule, ChartModule],
    template: `
        <div class="card">
            <h5>Monthly Borrowing Trends</h5>
            <p-chart type="line" [data]="chartData" [options]="chartOptions"></p-chart>
        </div>
    `
})
export class MonthlyBorrowingChart implements OnInit {
    private borrowingService = inject(FirestoreBorrowingService);

    chartData: any;
    chartOptions: any;

    ngOnInit() {
        this.loadMonthlyData();
    }

    private loadMonthlyData() {
        this.borrowingService.getBorrowings().then((borrowings: any[]) => {
            // Count borrowings by month
            const monthlyData = this.countBorrowingsByMonth(borrowings);

            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            const currentYear = new Date().getFullYear();
            const labels = months.map((month, index) => `${month.slice(0, 3)} ${currentYear}`);
            const data = Array(12)
                .fill(0)
                .map((_, i) => monthlyData[i] || 0);

            this.chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Books Borrowed',
                        data: data,
                        fill: false,
                        tension: 0.4,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            };

            this.chartOptions = {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        }
                    }
                }
            };
        });
    }

    private countBorrowingsByMonth(borrowings: any[]): number[] {
        const currentYear = new Date().getFullYear();
        const monthCounts = Array(12).fill(0);

        borrowings.forEach((borrowing: any) => {
            if (borrowing.borrowDate) {
                const date = borrowing.borrowDate instanceof Date ? borrowing.borrowDate : new Date(borrowing.borrowDate);

                if (date.getFullYear() === currentYear) {
                    monthCounts[date.getMonth()]++;
                }
            }
        });

        return monthCounts;
    }
}
