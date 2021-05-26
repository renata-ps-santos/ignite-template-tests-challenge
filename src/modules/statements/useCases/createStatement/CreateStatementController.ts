import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfers'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { user_id: id } = request.params;

    const splittedPath = request.originalUrl.split('/')

    const type = splittedPath[4] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = {
      sender_id: null,
      user_id,
      type,
      amount,
      description,
    }

    if(statement.type === 'transfers' && id){
      statement.user_id = id
      statement.sender_id = user_id
    }
    await createStatement.execute(statement);

    return response.status(201).json(statement);
  }
}
