import User from "models/User";

const UserModel: any = new User().getModelForClass(User);

export const requiresAuth = async (req: any, res: any, next: any): Promise<any> => {
    let reqToken = req.token;
    let user = await UserModel.findOne({
        token: reqToken
    });
    if (user !== null) {
        req.user = user;
        next();
    } else {
        res.status(403).send('Unauthorized');
    }
}

export const denyToRegularUsers = async (req: any, res: any, next: any): Promise<any> => {
    // TODO: Put here logic to distinguish roles if it gets implemented.
    res.status(403).send({ message: "Method forbidden for regular users" });
}