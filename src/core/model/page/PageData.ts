import { Pageable } from "./Pageable";

import { Author } from "../../../author/model/Author";

export class PageData<T> {
    content: T[];
    pageable: Pageable;
    totalElements: number;
}
