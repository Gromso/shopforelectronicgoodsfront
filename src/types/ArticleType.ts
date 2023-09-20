export default class ArticleType{
    articleId?: number;
    name?:string;
    excerpt?:string;
    description?:string;
    imageUrl?:string;
    price?: number;

    status?: 'available' | 'visible' | 'hidden';
    isPromoted?:number;

    articleFeatures?:{
        article_feature_id:number;
        feature_id:number;
        value:string;
    }[];
    features?:{
        feature_id:number;
        name:string;
    }[];
    articlePrices?:{
        articlePrice_id:number;
        price:number;
    }[];
    photos?:{
        photo_id:number;
        image_path:string;
    }[];
    categoryId?: number;
    category?:{
        category_id:number;
        name:string;
    }
}