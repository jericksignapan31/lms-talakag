import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-offline',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
            <div class="max-w-md w-full text-center">
                <div class="mb-6">
                    <i class="pi pi-wifi text-6xl text-red-500 mb-4"></i>
                </div>
                <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">Offline Mode</h1>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">You're currently offline. Some features may not be available. Please check your internet connection.</p>
                <div class="bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg p-4 mb-6">
                    <p class="text-sm text-blue-800 dark:text-blue-100">✓ You can still access previously loaded pages and cached content</p>
                </div>
                <button (click)="tryReconnect()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Try Reconnecting</button>
            </div>
        </div>
    `,
    styles: []
})
export class OfflineComponent {
    tryReconnect(): void {
        window.location.reload();
    }
}
