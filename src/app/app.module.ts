import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AwesomeDataTableModule } from 'a-datatable';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AwesomeDataTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
