export default interface ApiCategotyDTO {
    categoryId: number;
    name: string;
    image_path: string;
    parentCategoryId: number | null;
}