import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IOrder } from '../domain/models/IOrder';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';
import OrdersRepository from '../infra/typeorm/repositories/OrdersRepository';

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: OrdersRepository,

    @inject('CustomersRepository')
    private customersRepository: CustomersRepository,

    @inject('ProductsRepository')
    private productsRepository: ProductsRepository,
  ) {}
  public async execute({
    customer_id,
    products,
  }: IRequestCreateOrder): Promise<IOrder> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id');
    }

    const existsProducts = await this.productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids.');
    }

    const existsProductsId = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsId.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}.`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}.`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateStock(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
