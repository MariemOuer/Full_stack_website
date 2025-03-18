import express from "express";
import prisma_user_repository from "../repositories/concretes/prisma_user_repository";
import { AuthenticationService } from "../services/external/authentication/interfaces/authentication_service";
import { FirebaseAdminAuthenticationService } from "../services/external/authentication/concretes/firebase_admin_authentication_service";
import { AUTHENTICATE_BASE_ROUTE, CREATE_USER_RELATIVE_ROUTE, DELETE_USER_RELATIVE_ROUTE, USER_BASE_ROUTE } from "../utils/constants/route_constants";
import { safeExecute } from "../utils/general_error_helpers";
import { Result } from "../utils/result/result";
import { consumeResult } from "../utils/result/result_consumer_helpers";
import { UserService } from "../services/repository_services/user_service";
import { UserInfo } from "../types/user_info";

const router = express.Router();

const userService: UserService = new UserService({
  userRepository: prisma_user_repository,
});

const authenticationService: AuthenticationService = new FirebaseAdminAuthenticationService({
  userRepository: prisma_user_repository,
});

router.get(AUTHENTICATE_BASE_ROUTE, async (request: express.Request, response: express.Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const authHeader: string | undefined = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Result.error(new Error("No token"));
    }

    const token: string = authHeader.split(" ")[1];

    return authenticationService.authenticateUser(token);
  });

  return consumeResult(
    result,
    (user) => response.json(user),
    () => response.status(400).json(result)
  );
});

router.post(CREATE_USER_RELATIVE_ROUTE, async (requset: express.Request, response: express.Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const newUser: UserInfo = requset.body;
    return await userService.createUser(newUser);
  });

  return consumeResult(
    result,
    (user) => response.json(user),
    () => response.status(400).json(result)
  );
});

router.delete(DELETE_USER_RELATIVE_ROUTE, async (request: express.Request, response: express.Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const { authId } = request.body;
    return await userService.deleteUser(authId);
  });

  consumeResult(
    result,
    (user) => response.json(user),
    () => response.status(400).json(result)
  );
});

//for testing
router.get("/get-user/" + ":userId", async (request: express.Request<{ userId: string }>, response: express.Response): Promise<any> => {
  const result = await safeExecute(() => {
    return prisma_user_repository.getUserById(Number(request.params.userId));
  });

  return consumeResult(
    result,
    (user) => response.json(user),
    () => response.status(400).json(result)
  );
});

export default router;
