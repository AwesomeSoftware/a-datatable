import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AwesomeDataTableModule } from './awesome-data-table/awesome-data-table.module';

import { AppComponent } from './app.component';

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
