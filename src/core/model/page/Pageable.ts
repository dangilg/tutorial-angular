import { SortPage } from './SortPage';

//Clase que define los datos de un objeto Pageable
export class Pageable {
    pageNumber: number;
    pageSize: number;
    sort: SortPage[];
}
