import AppError from '@shared/errors/AppError';
import redisCache from '@shared/cache/RedisCache';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { inject, injectable } from 'tsyringe';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { IProduct } from '../domain/models/IProduct';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct> {
    const productExists = await this.productsRepository.findByName(name);

    if (productExists) {
      throw new AppError('There is already product with this name');
    }

    const product = this.productsRepository.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate('sales-api-PRODUCT_LIST');

    return product;
  }
}

export default CreateProductService;
