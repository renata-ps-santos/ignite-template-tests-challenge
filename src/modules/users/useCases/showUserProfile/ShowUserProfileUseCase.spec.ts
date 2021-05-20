import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("Should be able to show a user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Test Show Profile",
      email: "test@show.profile",
      password: "test123"
    });
    const userProfile = await showUserProfileUseCase.execute(user.id);
    expect(userProfile).toHaveProperty("id");
    expect(userProfile.name).toEqual("Test Show Profile");
    expect(userProfile.email).toEqual("test@show.profile");
  });

  it("Shouldn't be able to show a non existent user profile", () => {
    expect( async () => {
      const user = {
        id: "1234abc"
      }
      await showUserProfileUseCase.execute(user.id);
    }).rejects.toBeInstanceOf(AppError);
  });
});
