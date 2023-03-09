import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';
import { IOrderPaginate } from '@modules/orders/domain/models/IOrderPaginate';
import {
  IOrdersRepository,
  SearchParams,
} from '@modules/orders/domain/repositories/IOrdersRepository';
import { getRepository, Repository } from 'typeorm';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IOrderPaginate> {
    const [products, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      per_page: take,
      total: count,
      current_page: page,
      data: products,
    };

    return result;
  }
  public async create({ customer, products }: ICreateOrder): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    await this.ormRepository.save(order);
    return order;
  }
  public async findById(id: string): Promise<Order | undefined> {
    const order = this.ormRepository.findOne(id, {
      relations: ['order_products', 'customer'],
    });

    return order;
  }
}

export default OrdersRepository;
