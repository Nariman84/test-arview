import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EventFormComponent } from './event-form/event-form.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'event-form',	component: EventFormComponent	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [ RouterModule ]
})
export class AppRoutingModule {

};