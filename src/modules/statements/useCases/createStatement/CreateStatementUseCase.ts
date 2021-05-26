import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ sender_id,user_id, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);
    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }
    if(type === 'transfers'){
      const sender = await this.usersRepository.findById(sender_id);
      if(!sender){
        throw new CreateStatementError.UserNotFound();
      }
      const { balance } = await this.statementsRepository.getUserBalance({ user_id:sender_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
      const transfer = await this.statementsRepository.create({
        user_id,
        sender_id,
        type,
        amount,
        description
      });
      const statementOperation = await this.statementsRepository.create({
        user_id: sender_id,
        type,
        amount,
        description
      });
      return statementOperation;
    }

    if(type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description
    });

    return statementOperation;
  }
}
