import { Pageable } from '../../core/model/page/Pageable';
import { FilterDataModel } from './FilterDataModel';

export class LoanDto{
  pageable:Pageable;
  filters: FilterDataModel;
}
