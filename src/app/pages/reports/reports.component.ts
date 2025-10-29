import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Tabs, TabPanel, TabPanels, TabList, Tab } from 'primeng/tabs';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';
import { Tag } from 'primeng/tag';
import { 
    ReportsService, 
    BorrowingHistoryReport, 
    BookPopularityReport, 
    StudentPerformanceReport,
    BorrowerListReport 
} from '../../services/reports.service';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Button,
        Card,
        TableModule,
        Tabs,
        TabPanel,
        TabPanels,
        TabList,
        Tab,
        Select,
        DatePicker,
        ChartModule,
        Tag
    ],
    template: `
        <div class="reports-container">
            <h1 class="page-title">Library Reports & Analytics</h1>
            
            <!-- Summary Cards -->
            <div class="summary-grid" *ngIf="summary">
                <p-card>
                    <div class="summary-card">
                        <i class="pi pi-book summary-icon"></i>
                        <div>
                            <h3>{{summary.totalBooks}}</h3>
                            <p>Total Books</p>
                        </div>
                    </div>
                </p-card>
                <p-card>
                    <div class="summary-card">
                        <i class="pi pi-users summary-icon"></i>
                        <div>
                            <h3>{{summary.totalStudents}}</h3>
                            <p>Total Students</p>
                        </div>
                    </div>
                </p-card>
                <p-card>
                    <div class="summary-card">
                        <i class="pi pi-calendar summary-icon"></i>
                        <div>
                            <h3>{{summary.activeBorrowings}}</h3>
                            <p>Active Borrowings</p>
                        </div>
                    </div>
                </p-card>
                <p-card>
                    <div class="summary-card">
                        <i class="pi pi-exclamation-triangle summary-icon overdue"></i>
                        <div>
                            <h3>{{summary.overdueBorrowings}}</h3>
                            <p>Overdue Books</p>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Tabs for different reports -->
            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Borrowing History</p-tab>
                    <p-tab value="1">Book Popularity</p-tab>
                    <p-tab value="2">Student Performance</p-tab>
                    <p-tab value="3">Borrower List</p-tab>
                </p-tablist>
                <p-tabpanels>
                <!-- Borrowing History Tab -->
                <p-tabpanel value="0">
                    <p-card>
                        <div class="filters-section">
                            <h3>Filters</h3>
                            <div class="filter-grid">
                                <div class="filter-item">
                                    <label>Date Range:</label>
                                    <p-datePicker [(ngModel)]="dateRange" selectionMode="range" 
                                        [showIcon]="true" dateFormat="yy-mm-dd"
                                        (onSelect)="onDateRangeChange()" 
                                        placeholder="Select date range" />
                                </div>
                                <div class="filter-item">
                                    <label>Status:</label>
                                    <p-select [(ngModel)]="statusFilter" [options]="statusOptions"
                                        optionLabel="label" optionValue="value"
                                        (onChange)="onStatusFilterChange()"
                                        placeholder="Select status" />
                                </div>
                                <div class="filter-actions">
                                    <p-button label="Clear Filters" icon="pi pi-times" 
                                        (onClick)="clearFilters()" severity="secondary" />
                                </div>
                            </div>
                        </div>

                        <div class="actions-bar">
                            <p-button label="Export to Excel" icon="pi pi-file-excel" 
                                (onClick)="exportBorrowingHistoryToExcel()" severity="success" />
                            <p-button label="Print Report" icon="pi pi-print" 
                                (onClick)="printBorrowingHistory()" />
                        </div>

                        <p-table [value]="borrowingHistory" [loading]="loading" 
                            [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10,25,50]"
                            [scrollable]="true" scrollHeight="500px">
                            <ng-template #header>
                                <tr>
                                    <th>Borrower</th>
                                    <th>Type</th>
                                    <th>Book Title</th>
                                    <th>Accession #</th>
                                    <th>Borrow Date</th>
                                    <th>Due Date</th>
                                    <th>Return Date</th>
                                    <th>Status</th>
                                    <th>Days Overdue</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-item>
                                <tr>
                                    <td>{{item.borrowerName}}</td>
                                    <td>{{item.borrowerType}}</td>
                                    <td>{{item.bookTitle}}</td>
                                    <td>{{item.bookAccessionNumber}}</td>
                                    <td>{{item.borrowDate}}</td>
                                    <td>{{item.dueDate}}</td>
                                    <td>{{item.returnDate || 'Not returned'}}</td>
                                    <td><p-tag [value]="item.status" [severity]="getStatusSeverity(item.status)" /></td>
                                    <td>{{item.daysOverdue || '-'}}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </p-tabpanel>

                <!-- Book Popularity Tab -->
                <p-tabpanel value="1">
                    <p-card>
                        <div class="actions-bar">
                            <p-button label="Export to Excel" icon="pi pi-file-excel" 
                                (onClick)="exportBookPopularityToExcel()" severity="success" />
                            <p-button label="Print Report" icon="pi pi-print" 
                                (onClick)="printBookPopularity()" />
                        </div>

                        <div class="chart-container" *ngIf="borrowingTrendChart">
                            <h3>Top 10 Most Borrowed Books</h3>
                            <p-chart type="bar" [data]="borrowingTrendChart" 
                                [options]="{responsive: true, maintainAspectRatio: false}" 
                                height="300px" />
                        </div>

                        <p-table [value]="bookPopularity" [loading]="loading"
                            [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10,25,50]">
                            <ng-template #header>
                                <tr>
                                    <th>Rank</th>
                                    <th>Book Title</th>
                                    <th>Author</th>
                                    <th>ISBN</th>
                                    <th>Total Borrows</th>
                                    <th>Currently Borrowed</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-item>
                                <tr>
                                    <td><strong>{{item.rank}}</strong></td>
                                    <td>{{item.bookTitle}}</td>
                                    <td>{{item.author}}</td>
                                    <td>{{item.isbn}}</td>
                                    <td>{{item.totalBorrows}}</td>
                                    <td>{{item.currentlyBorrowed}}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </p-tabpanel>

                <!-- Student Performance Tab -->
                <p-tabpanel value="2">
                    <p-card>
                        <div class="actions-bar">
                            <p-button label="Export to Excel" icon="pi pi-file-excel" 
                                (onClick)="exportStudentPerformanceToExcel()" severity="success" />
                            <p-button label="Print Report" icon="pi pi-print" 
                                (onClick)="printStudentPerformance()" />
                        </div>

                        <div class="chart-container" *ngIf="performanceChart">
                            <h3>Student Performance Distribution</h3>
                            <p-chart type="pie" [data]="performanceChart" 
                                [options]="{responsive: true, maintainAspectRatio: false}"
                                height="300px" />
                        </div>

                        <p-table [value]="studentPerformance" [loading]="loading"
                            [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10,25,50]">
                            <ng-template #header>
                                <tr>
                                    <th>Student Name</th>
                                    <th>LRN</th>
                                    <th>Grade</th>
                                    <th>Section</th>
                                    <th>Total Borrowed</th>
                                    <th>Returned</th>
                                    <th>Overdue</th>
                                    <th>On-Time Returns</th>
                                    <th>Score</th>
                                    <th>Status</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-item>
                                <tr>
                                    <td>{{item.studentName}}</td>
                                    <td>{{item.studentLRN}}</td>
                                    <td>{{item.grade}}</td>
                                    <td>{{item.section}}</td>
                                    <td>{{item.totalBorrowedBooks}}</td>
                                    <td>{{item.booksReturned}}</td>
                                    <td>{{item.overdueBooks}}</td>
                                    <td>{{item.onTimeReturns}}</td>
                                    <td><strong>{{item.performanceScore}}</strong></td>
                                    <td><p-tag [value]="item.status" [severity]="getPerformanceSeverity(item.status)" /></td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </p-tabpanel>

                <!-- Borrower List Tab -->
                <p-tabpanel value="3">
                    <p-card>
                        <div class="filters-section">
                            <h3>Filters</h3>
                            <div class="filter-grid">
                                <div class="filter-item">
                                    <label>Borrower Type:</label>
                                    <p-select [(ngModel)]="borrowerTypeFilter" [options]="borrowerTypeOptions"
                                        optionLabel="label" optionValue="value"
                                        (onChange)="onBorrowerTypeFilterChange()"
                                        placeholder="Select type" />
                                </div>
                                <div class="filter-item">
                                    <label>Status:</label>
                                    <p-select [(ngModel)]="statusFilter" [options]="statusOptions"
                                        optionLabel="label" optionValue="value"
                                        (onChange)="onStatusFilterChange()"
                                        placeholder="Select status" />
                                </div>
                            </div>
                        </div>

                        <div class="actions-bar">
                            <p-button label="Export to Excel" icon="pi pi-file-excel" 
                                (onClick)="exportBorrowerListToExcel()" severity="success" />
                            <p-button label="Print Report" icon="pi pi-print" 
                                (onClick)="printBorrowerList()" />
                        </div>

                        <p-table [value]="borrowerList" [loading]="loading"
                            [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10,25,50]">
                            <ng-template #header>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>ID</th>
                                    <th>Grade/Dept</th>
                                    <th>Section</th>
                                    <th>Book Title</th>
                                    <th>Accession #</th>
                                    <th>Borrow Date</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-item>
                                <tr>
                                    <td>{{item.name}}</td>
                                    <td>{{item.type}}</td>
                                    <td>{{item.identifier}}</td>
                                    <td>{{item.grade || item.department || '-'}}</td>
                                    <td>{{item.section || '-'}}</td>
                                    <td>{{item.bookTitle}}</td>
                                    <td>{{item.bookAccessionNumber}}</td>
                                    <td>{{item.borrowDate}}</td>
                                    <td>{{item.dueDate}}</td>
                                    <td><p-tag [value]="item.status" [severity]="getStatusSeverity(item.status)" /></td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `,
    styles: [`
        .reports-container {
            padding: 2rem;
        }

        .page-title {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 2rem;
            color: #333;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .summary-card {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .summary-icon {
            font-size: 2.5rem;
            color: #007bff;
        }

        .summary-icon.overdue {
            color: #dc3545;
        }

        .summary-card h3 {
            font-size: 2rem;
            font-weight: bold;
            margin: 0;
        }

        .summary-card p {
            margin: 0;
            color: #666;
        }

        .filters-section {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .filters-section h3 {
            margin-top: 0;
            margin-bottom: 1rem;
        }

        .filter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            align-items: end;
        }

        .filter-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .filter-item label {
            font-weight: 600;
            color: #555;
        }

        .filter-actions {
            display: flex;
            align-items: end;
        }

        .actions-bar {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .chart-container {
            margin-bottom: 2rem;
            padding: 1rem;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chart-container h3 {
            margin-top: 0;
            margin-bottom: 1rem;
            text-align: center;
        }

        ::ng-deep .p-datatable {
            font-size: 0.9rem;
        }

        ::ng-deep .p-datatable-header {
            background: #f8f9fa;
            padding: 1rem;
        }

        ::ng-deep .p-datatable th {
            background: #007bff;
            color: white;
            font-weight: 600;
        }

        ::ng-deep .p-card {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        ::ng-deep .p-tab-header {
            font-size: 1.1rem;
            font-weight: 600;
        }
    `]
})
export class ReportsComponent implements OnInit {
    private reportsService = inject(ReportsService);

    // Loading states
    loading = false;
    
    // Summary statistics
    summary: any = null;

    // Report data
    borrowingHistory: BorrowingHistoryReport[] = [];
    bookPopularity: BookPopularityReport[] = [];
    studentPerformance: StudentPerformanceReport[] = [];
    borrowerList: BorrowerListReport[] = [];

    // Filters
    dateRange: Date[] = [];
    statusFilter: any = null;
    borrowerTypeFilter: any = null;

    // Dropdown options
    statusOptions = [
        { label: 'All Status', value: null },
        { label: 'Borrowed', value: 'borrowed' },
        { label: 'Returned', value: 'returned' },
        { label: 'Overdue', value: 'overdue' }
    ];

    borrowerTypeOptions = [
        { label: 'All Types', value: null },
        { label: 'Students', value: 'student' },
        { label: 'Teachers', value: 'teacher' }
    ];

    // Chart data
    borrowingTrendChart: any;
    performanceChart: any;

    ngOnInit() {
        this.loadSummary();
        this.loadAllReports();
    }

    async loadSummary() {
        try {
            this.summary = await this.reportsService.getReportSummary();
        } catch (error) {
            console.error('Error loading summary:', error);
        }
    }

    async loadAllReports() {
        this.loading = true;
        try {
            await Promise.all([
                this.loadBorrowingHistory(),
                this.loadBookPopularity(),
                this.loadStudentPerformance(),
                this.loadBorrowerList()
            ]);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            this.loading = false;
        }
    }

    async loadBorrowingHistory() {
        try {
            const startDate = this.dateRange[0] 
                ? this.dateRange[0].toISOString().split('T')[0] 
                : undefined;
            const endDate = this.dateRange[1] 
                ? this.dateRange[1].toISOString().split('T')[0] 
                : undefined;
            
            this.borrowingHistory = await this.reportsService.getBorrowingHistoryReport(
                startDate,
                endDate,
                this.statusFilter
            );
        } catch (error) {
            console.error('Error loading borrowing history:', error);
        }
    }

    async loadBookPopularity() {
        try {
            this.bookPopularity = await this.reportsService.getBookPopularityReport();
            this.prepareBookPopularityChart();
        } catch (error) {
            console.error('Error loading book popularity:', error);
        }
    }

    async loadStudentPerformance() {
        try {
            this.studentPerformance = await this.reportsService.getStudentPerformanceReport();
            this.preparePerformanceChart();
        } catch (error) {
            console.error('Error loading student performance:', error);
        }
    }

    async loadBorrowerList() {
        try {
            this.borrowerList = await this.reportsService.getBorrowerListReport(
                this.borrowerTypeFilter,
                this.statusFilter
            );
        } catch (error) {
            console.error('Error loading borrower list:', error);
        }
    }

    prepareBookPopularityChart() {
        const top10Books = this.bookPopularity.slice(0, 10);
        this.borrowingTrendChart = {
            labels: top10Books.map(b => b.bookTitle.substring(0, 30) + '...'),
            datasets: [{
                label: 'Total Borrows',
                data: top10Books.map(b => b.totalBorrows),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
    }

    preparePerformanceChart() {
        const statusCounts = {
            'Excellent': 0,
            'Good': 0,
            'Fair': 0,
            'Poor': 0
        };

        this.studentPerformance.forEach(s => {
            statusCounts[s.status]++;
        });

        this.performanceChart = {
            labels: ['Excellent', 'Good', 'Fair', 'Poor'],
            datasets: [{
                data: [
                    statusCounts['Excellent'],
                    statusCounts['Good'],
                    statusCounts['Fair'],
                    statusCounts['Poor']
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        };
    }

    // Filter handlers
    onDateRangeChange() {
        if (this.dateRange && this.dateRange.length === 2) {
            this.loadBorrowingHistory();
        }
    }

    onStatusFilterChange() {
        this.loadBorrowingHistory();
        this.loadBorrowerList();
    }

    onBorrowerTypeFilterChange() {
        this.loadBorrowerList();
    }

    clearFilters() {
        this.dateRange = [];
        this.statusFilter = null;
        this.borrowerTypeFilter = null;
        this.loadAllReports();
    }

    // Export functions
    exportBorrowingHistoryToExcel() {
        this.reportsService.exportToExcel(
            this.borrowingHistory,
            `borrowing-history-${new Date().toISOString().split('T')[0]}`,
            'Borrowing History'
        );
    }

    exportBookPopularityToExcel() {
        this.reportsService.exportToExcel(
            this.bookPopularity,
            `book-popularity-${new Date().toISOString().split('T')[0]}`,
            'Book Popularity'
        );
    }

    exportStudentPerformanceToExcel() {
        this.reportsService.exportToExcel(
            this.studentPerformance,
            `student-performance-${new Date().toISOString().split('T')[0]}`,
            'Student Performance'
        );
    }

    exportBorrowerListToExcel() {
        this.reportsService.exportToExcel(
            this.borrowerList,
            `borrower-list-${new Date().toISOString().split('T')[0]}`,
            'Borrower List'
        );
    }

    // Print functions
    printBorrowingHistory() {
        const tableHtml = this.generateTableHtml(
            this.borrowingHistory,
            ['borrowerName', 'borrowerType', 'bookTitle', 'borrowDate', 'dueDate', 'returnDate', 'status', 'daysOverdue'],
            ['Borrower', 'Type', 'Book Title', 'Borrow Date', 'Due Date', 'Return Date', 'Status', 'Days Overdue']
        );
        this.reportsService.printReport(tableHtml, 'Borrowing History Report');
    }

    printBookPopularity() {
        const tableHtml = this.generateTableHtml(
            this.bookPopularity,
            ['rank', 'bookTitle', 'author', 'totalBorrows', 'currentlyBorrowed'],
            ['Rank', 'Book Title', 'Author', 'Total Borrows', 'Currently Borrowed']
        );
        this.reportsService.printReport(tableHtml, 'Book Popularity Report');
    }

    printStudentPerformance() {
        const tableHtml = this.generateTableHtml(
            this.studentPerformance,
            ['studentName', 'grade', 'section', 'totalBorrowedBooks', 'booksReturned', 'overdueBooks', 'performanceScore', 'status'],
            ['Student Name', 'Grade', 'Section', 'Total Borrowed', 'Returned', 'Overdue', 'Score', 'Status']
        );
        this.reportsService.printReport(tableHtml, 'Student Performance Report');
    }

    printBorrowerList() {
        const tableHtml = this.generateTableHtml(
            this.borrowerList,
            ['name', 'type', 'identifier', 'grade', 'section', 'department', 'bookTitle', 'borrowDate', 'status'],
            ['Name', 'Type', 'ID', 'Grade', 'Section', 'Department', 'Book Title', 'Borrow Date', 'Status']
        );
        this.reportsService.printReport(tableHtml, 'Borrower List Report');
    }

    private generateTableHtml(data: any[], fields: string[], headers: string[]): string {
        let html = '<table><thead><tr>';
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr></thead><tbody>';

        data.forEach(row => {
            html += '<tr>';
            fields.forEach(field => {
                const value = row[field] !== undefined && row[field] !== null ? row[field] : '';
                html += `<td>${value}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }

    // Utility functions
    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        const statusMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            'borrowed': 'info',
            'returned': 'success',
            'overdue': 'danger'
        };
        return statusMap[status.toLowerCase()] || 'secondary';
    }

    getPerformanceSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        const statusMap: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
            'Excellent': 'success',
            'Good': 'info',
            'Fair': 'warn',
            'Poor': 'danger'
        };
        return statusMap[status] || 'secondary';
    }
}
