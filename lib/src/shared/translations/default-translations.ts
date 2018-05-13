import { AwesomeDataTableTranslations } from './awesome-data-table-translations';

export let defaultTranslations = <AwesomeDataTableTranslations>{
    indexColumn: 'Index',
    selectColumn: 'Select',
    expandColumn: 'Expand',
    columnsMenuHeaderText: 'Columns',
    rowsMenuHeaderText: 'Rows',
    paginationResult: (offset: number, current: number, max: number) => {
        return `Showing: ${offset} - ${current} of ${max} records`;
    }
};
