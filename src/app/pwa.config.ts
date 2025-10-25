import { ApplicationConfig } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';

export const PWA_CONFIG: ApplicationConfig = {
    providers: [
        provideServiceWorker('ngsw-worker.js', {
            enabled: environment.production,
            registrationStrategy: 'registerWhenStable:30000'
        })
    ]
};
