import { AwesomeDataTableColumn } from './../../column/column.directive';
import { AwesomeDataTableRow } from './../../row/row.component';

export type CellCallback = (item: any, row: AwesomeDataTableRow, column: AwesomeDataTableColumn, index: number) => string;
