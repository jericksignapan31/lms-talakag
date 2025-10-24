import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { FirestoreBorrowingService } from '../../../services/firestore-borrowing.service';
import { FirestoreStudentService } from '../../../services/firestore-student.service';

interface GradeData {
    grade: string;
    totalBorrowings: number;
    activeBorrowings: number;
    returnedBorrowings: number;
    uniqueStudents: number;
}

@Component({
    standalone: true,
    selector: 'app-borrowing-by-grade-chart',
    imports: [CommonModule, ChartModule, TableModule],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <!-- Bar Chart -->
            <div class="col-span-12 lg:col-span-6">
                <div class="card">
                    <h5>Borrowing by Grade & Section</h5>
                    <p-chart type="bar" [data]="chartData" [options]="chartOptions" style="height: 400px"></p-chart>
                </div>
            </div>

            <!-- Status Breakdown -->
            <div class="col-span-12 lg:col-span-6">
                <div class="card">
                    <h5>Borrowing Status Overview</h5>
                    <p-chart type="bar" [data]="statusChartData" [options]="statusChartOptions" style="height: 400px"></p-chart>
                </div>
            </div>
        </div>

        <!-- Detailed Table - Full Width Separate Section -->
        <div class="grid grid-cols-12 gap-6 mt-8">
            <div class="col-span-12">
                <div class="card">
                    <h5 class="mb-4">Grade & Section Details</h5>
                    <p-table [value]="gradeDetails" [tableStyle]="{ 'width': '100%' }" responsiveLayout="scroll">
                        <ng-template #header>
                            <tr>
                                <th pSortableColumn style="width: 20%">Grade & Section <p-sortIcon field="grade"></p-sortIcon></th>
                                <th pSortableColumn style="width: 15%" class="text-center">Total Borrowings <p-sortIcon field="totalBorrowings"></p-sortIcon></th>
                                <th pSortableColumn style="width: 15%" class="text-center">Active <p-sortIcon field="activeBorrowings"></p-sortIcon></th>
                                <th pSortableColumn style="width: 15%" class="text-center">Returned <p-sortIcon field="returnedBorrowings"></p-sortIcon></th>
                                <th pSortableColumn style="width: 15%" class="text-center">Unique Students <p-sortIcon field="uniqueStudents"></p-sortIcon></th>
                                <th style="width: 10%" class="text-center">Active %</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-data>
                            <tr>
                                <td class="font-semibold">{{ data.grade }}</td>
                                <td class="text-center"><span class="font-bold text-lg">{{ data.totalBorrowings }}</span></td>
                                <td class="text-center"><span class="px-3 py-1 bg-blue-100 text-blue-800 rounded font-semibold">{{ data.activeBorrowings }}</span></td>
                                <td class="text-center"><span class="px-3 py-1 bg-green-100 text-green-800 rounded font-semibold">{{ data.returnedBorrowings }}</span></td>
                                <td class="text-center">{{ data.uniqueStudents }}</td>
                                <td class="text-center"><span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold">{{ calculatePercentage(data.activeBorrowings, data.totalBorrowings) }}%</span></td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `
})
export class BorrowingByGradeChart implements OnInit {
    private borrowingService = inject(FirestoreBorrowingService);
    private studentService = inject(FirestoreStudentService);

    chartData: any;
    chartOptions: any;
    statusChartData: any;
    statusChartOptions: any;
    gradeDetails: GradeData[] = [];

    ngOnInit() {
        this.loadGradeData();
    }

    private loadGradeData() {
        Promise.all([this.borrowingService.getBorrowings(), this.studentService.getStudents()]).then(([borrowings, students]) => {
            // Create a map of student LRN to grade/section
            const studentMap = new Map();
            students.forEach((student: any) => {
                const grade = student.grade || 'N/A';
                const section = student.section || 'N/A';
                const gradeSection = `${grade}-${section}`;
                studentMap.set(student.lrn, gradeSection);
            });

            // Process data by grade
            const gradeMap = new Map<string, GradeData>();
            
            borrowings.forEach((borrowing: any) => {
                // Try to get grade from student, if not found use borrower type as fallback
                let grade = studentMap.get(borrowing.studentLRN);
                if (!grade) {
                    // For teachers, mark as "Teachers"
                    grade = borrowing.borrowerType === 'teacher' ? 'Teachers' : 'Unknown';
                }
                
                if (!gradeMap.has(grade)) {
                    gradeMap.set(grade, {
                        grade,
                        totalBorrowings: 0,
                        activeBorrowings: 0,
                        returnedBorrowings: 0,
                        uniqueStudents: new Set<string>()
                    } as any);
                }

                const data = gradeMap.get(grade)!;
                data.totalBorrowings++;
                
                if (borrowing.status === 'borrowed') {
                    data.activeBorrowings++;
                } else if (borrowing.status === 'returned') {
                    data.returnedBorrowings++;
                }
                
                (data.uniqueStudents as any).add(borrowing.studentLRN);
            });

            // Convert Set to count and sort
            const sortedGrades: GradeData[] = Array.from(gradeMap.values())
                .map((data: any) => ({
                    ...data,
                    uniqueStudents: data.uniqueStudents.size
                }))
                .sort((a, b) => {
                    // Sort Teachers to the bottom
                    if (a.grade === 'Teachers') return 1;
                    if (b.grade === 'Teachers') return -1;
                    return a.grade.localeCompare(b.grade);
                });

            this.gradeDetails = sortedGrades;

            // Prepare chart data
            const labels = sortedGrades.map((d) => d.grade);
            const totalData = sortedGrades.map((d) => d.totalBorrowings);
            const activeData = sortedGrades.map((d) => d.activeBorrowings);
            const returnedData = sortedGrades.map((d) => d.returnedBorrowings);

            this.chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Borrowings',
                        data: totalData,
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    }
                ]
            };

            this.chartOptions = {
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        }
                    }
                }
            };

            // Status chart
            this.statusChartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Active',
                        data: activeData,
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    },
                    {
                        label: 'Returned',
                        data: returnedData,
                        backgroundColor: '#f59e0b',
                        borderRadius: 4
                    }
                ]
            };

            this.statusChartOptions = {
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            };
        });
    }

    calculatePercentage(active: number, total: number): number {
        return total === 0 ? 0 : Math.round((active / total) * 100);
    }
}
