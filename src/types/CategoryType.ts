import ArticleType from "./ArticleType";

export default class CategoryType{
    categoryId?: number;
    name?: string;
    image_path?:string;
    items?: ArticleType[];
    parentCategoryId?:number | null;

}