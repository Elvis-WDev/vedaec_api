

import { JwtAdapter, bcryptAdapter } from '../../config';
import { prisma } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';

export class AuthService {

    // DI
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await prisma.user.findUnique({
            where: {
                email: registerUserDto.email
            },
        })

        if (existUser) throw CustomError.badRequest('Email already exist');

        try {

            // Encriptar la contraseña
            const userHashed = { ...registerUserDto, password: bcryptAdapter.hash(registerUserDto.password) };

            // Crear el usuario
            const user = await prisma.user.create({
                data: userHashed
            })

            // Apartar datos de la contraseña
            const { password, ...userEntity } = UserEntity.fromObject(user);

            // JWT <---- para mantener la autenticación del usuario
            const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });

            if (!token) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: userEntity,
                token: token
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }


    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await prisma.user.findUnique({
            where: {
                email: loginUserDto.email
            },
        })

        if (!user) throw CustomError.badRequest('Email not exist');

        // Comparar la contraseña
        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);

        if (!isMatching) throw CustomError.badRequest('Password is not valid');

        const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });

        const { password, ...userEntity } = UserEntity.fromObject(user);

        if (!token) throw CustomError.internalServer('Error while creating JWT');

        return {
            user: userEntity,
            token: token,
        }



    }


}