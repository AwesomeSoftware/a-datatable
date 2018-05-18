import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AwesomeDataTable } from './table/table.component';
import { AwesomeDataTableColumn } from './column/column.directive';
import { AwesomeDataTableRow } from './row/row.component';
import { AwesomeDataTablePagination } from './pagination/pagination.component';
import { AwesomeDataTableHeader } from './header/header.component';

import { PixelConverterPipe } from './shared/index';
import { HideDirective } from './shared/index';
import { MinPipe } from './shared/index';

let MODULES = [
    AwesomeDataTable,
    AwesomeDataTableColumn,
    AwesomeDataTableRow,
    AwesomeDataTablePagination,
    AwesomeDataTableHeader,
    PixelConverterPipe,
    HideDirective,
    MinPipe
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: MODULES,
    exports: MODULES
})
export class AwesomeDataTableModule {
}

// original https://github.com/ggmod/angular-2-data-table
// forked https://github.com/briebug/angular-datatable