import {IProductConfigure} from './product-configure';
import {IProductImage} from './product-image';

export interface IProduct{
  id: string,
  title: string,
  price: number,
  image: IProductImage,
  description: string
  configure: IProductConfigure
}
