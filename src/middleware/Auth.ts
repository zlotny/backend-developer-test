import User from "models/User";

const UserModel: any = new User().getModelForClass(User);

export const requiresAuth = async (req: any, res: any, next: any): Promise<any> => {
    let reqToken = req.token;
    let user = await UserModel.findOne({
        token: reqToken
    }).select("-token");
    if (user !== null) {
        req.user = user;
        next();
    } else {
        res.status(403).send('Unauthorized');
    }
}

export const denyToRegularUsers = async (req: any, res: any, next: any): Promise<any> => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(403).send({ message: "Method forbidden for regular users" });
    }
}