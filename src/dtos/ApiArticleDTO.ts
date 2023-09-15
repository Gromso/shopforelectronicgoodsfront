export default interface ApiArticleDTO{
    article_id:number;
    category_id:number;
    name:string;
    excerpt:string;
    description:string;
    status: 'available' | 'visible' | 'hidden';
    isPromoted:number;

    articleFeatures:{
        article_feature_id:number;
        feature_id:number;
        value:string;
    }[];
    features:{
        feature_id:number;
        name:string;
    }[];
    articlePrices:{
        articlePrice_id:number;
        price:number;
    }[];
    photos:{
        photo_id:number;
        image_path:string;
    }[];
    category:{
        category_id:number;
        name:string;
    }

}