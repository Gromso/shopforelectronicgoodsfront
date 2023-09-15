
export default interface CartType{
        cart_id: number,
        user_id: number,
        user: any,
        created_at_cart: string,
        cartArticles: {
            cartArticle_id:number,
            article_id: number,
            quantity:number,
            articles:{
                article_id: number,
                name:string,
                category:{
                    category_id:number,
                    name:string,
                };
                articlePrices:{
                    articlePrice_id:number,
                    price:number,
                }[];
            }
        }[]
}