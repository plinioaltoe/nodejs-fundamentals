import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const acceptedTypes = ['income', 'outcome'];
    if (!acceptedTypes.includes(type)) {
      throw Error('Type not accepted');
    }

    const balance = this.transactionsRepository.getBalance();
    const explodeBalance = type === 'outcome' && balance.total - value < 0;

    if (explodeBalance) {
      throw Error(`This transaction will explode your balance, don't do it.`);
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });
    return transaction;
  }
}

export default CreateTransactionService;
