import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PwaService {
    private swUpdate = inject(SwUpdate);
    public installPrompt$ = new BehaviorSubject<Event | null>(null);
    public isAppInstalled$ = new BehaviorSubject<boolean>(false);

    constructor() {
        this.initializeServiceWorker();
        this.setupInstallPrompt();
        this.checkIfAppInstalled();
    }

    private initializeServiceWorker(): void {
        // Check for updates periodically (every hour)
        if (this.swUpdate.isEnabled) {
            interval(60 * 60 * 1000).subscribe(() => {
                this.swUpdate.checkForUpdate();
            });

            // When an update is available
            this.swUpdate.versionUpdates.subscribe((event) => {
                if (event.type === 'VERSION_READY') {
                    console.log('New version available');
                    this.promptUserToRefresh();
                }
            });
        }
    }

    /**
     * Setup install prompt listener
     */
    private setupInstallPrompt(): void {
        window.addEventListener('beforeinstallprompt', (event: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            event.preventDefault();
            // Store the event for later use
            this.installPrompt$.next(event);
            console.log('Install prompt is available');
        });

        // Listen for app installation
        window.addEventListener('appinstalled', () => {
            console.log('App installed');
            this.installPrompt$.next(null);
            this.isAppInstalled$.next(true);
        });
    }

    /**
     * Check if app is already installed
     */
    private checkIfAppInstalled(): void {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isAppInstalled$.next(true);
        }
    }

    /**
     * Trigger install prompt
     */
    async triggerInstallPrompt(): Promise<boolean> {
        const installPrompt = this.installPrompt$.value;
        if (!installPrompt) {
            console.log('Install prompt is not available');
            return false;
        }

        try {
            const promptEvent = installPrompt as any;
            promptEvent.prompt();
            const { outcome } = await promptEvent.userChoice;
            console.log(`User response: ${outcome}`);

            // Clear the saved prompt
            this.installPrompt$.next(null);
            return outcome === 'accepted';
        } catch (error) {
            console.error('Error triggering install prompt:', error);
            return false;
        }
    }

    /**
     * Check for service worker updates
     */
    checkForUpdates(): Promise<boolean> {
        if (this.swUpdate.isEnabled) {
            return this.swUpdate.checkForUpdate();
        }
        return Promise.resolve(false);
    }

    /**
     * Activate the latest version of the app
     */
    activateUpdate(): void {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.activateUpdate().then(() => {
                // Reload the page to load the new version
                window.location.reload();
            });
        }
    }

    /**
     * Prompt user to refresh for new version
     */
    private promptUserToRefresh(): void {
        const message = 'A new version of the app is available. Would you like to update?';
        if (confirm(message)) {
            this.activateUpdate();
        }
    }

    /**
     * Check if service worker is enabled
     */
    isServiceWorkerEnabled(): boolean {
        return this.swUpdate.isEnabled;
    }

    /**
     * Get install prompt availability
     */
    isInstallPromptAvailable(): boolean {
        return this.installPrompt$.value !== null;
    }
}
