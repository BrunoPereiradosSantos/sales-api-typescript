import AppError from '@shared/errors/AppError';
//import { getCustomRepository } from 'typeorm';
//import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';
import { IDeleteCustomer } from '../domain/models/IDeleteCustomer';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}
  public async execute({ id }: IDeleteCustomer): Promise<void> {
    //const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    await this.customersRepository.remove(customer);
  }
}

export default DeleteCustomerService;
