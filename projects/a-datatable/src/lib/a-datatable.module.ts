import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AwesomeDataTable } from './table/table.component';
import { AwesomeDataTableColumn } from './column/column.directive';
import { AwesomeDataTableRow } from './row/row.component';
import { AwesomeDataTablePagination } from './pagination/pagination.component';
import { AwesomeDataTableHeader } from './header/header.component';

import { PixelConverterPipe } from './shared';
import { HideDirective } from './shared';
import { MinPipe } from './shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        AwesomeDataTable,
        AwesomeDataTableColumn,
        AwesomeDataTableRow,
        AwesomeDataTablePagination,
        AwesomeDataTableHeader,
        PixelConverterPipe,
        HideDirective,
        MinPipe
    ],
    exports: [
        AwesomeDataTable,
        AwesomeDataTableColumn,
        AwesomeDataTableRow,
        AwesomeDataTablePagination,
        AwesomeDataTableHeader,
        PixelConverterPipe,
        HideDirective,
        MinPipe
    ]
})
export class AwesomeDataTableModule {
}

// original https://github.com/ggmod/angular-2-data-table
// forked https://github.com/briebug/angular-datatable