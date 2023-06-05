import {ProductConfigure} from './product-configure';
import {ProductImage} from './product-image';

export interface Product{
  id: string,
  title: string,
  price: number,
  image: ProductImage,
  description: string
  configure: ProductConfigure
}
