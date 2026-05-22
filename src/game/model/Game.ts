import { Author } from "../../author/model/Author";
import { Category } from "../../category/model/category";

export class Game {
    id: number=-1;
    title: string='';
    age: number;
    category: Category;
    author: Author;
}
