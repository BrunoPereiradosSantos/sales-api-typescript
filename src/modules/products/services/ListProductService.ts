import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IProductPaginate } from '../domain/models/IProductPaginate';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

type SearchParams = {
  page: number;
  limit: number;
};

@injectable()
class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    page,
    limit,
  }: SearchParams): Promise<IProductPaginate> {
    let products = await redisCache.recover('sales-api-PRODUCT_LIST');

    if (!products) {
      const take = limit;
      const skip = (Number(page) - 1) * take;
      products = await this.productsRepository.findAll({
        page,
        skip,
        take,
      });
    }

    await redisCache.save('sales-api-PRODUCT_LIST', products);

    return products as IProductPaginate;
  }
}

export default ListProductService;
