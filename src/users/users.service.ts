import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true, //isso é para retornar apenas esses itens quando o usuario for cadastrado na resposta do terminal
        email: true,
        Task: true,
      },
    });

    if (user) return user;

    throw new HttpException('Usuario não encontrado!', HttpStatus.BAD_REQUEST);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: createUserDto.password,
        },
        select: {
          id: true,
          name: true, //isso é para retornar apenas esses itens quando o usuario for cadastrado na resposta do terminal
          email: true,
        },
      });

      return user;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Usuario não encontrado!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new HttpException('Usuario não existe!', HttpStatus.BAD_REQUEST);
      }

      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: updateUserDto.name ? updateUserDto.name : user.name,
          passwordHash: updateUserDto.password
            ? updateUserDto.password
            : user.passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return updateUser;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Falha ao cadastrar esse usuario!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new HttpException('Usuario não existe!', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      return {
        message: 'Usuario foi deletado',
      };
    } catch (err) {
      throw new HttpException(
        'Falha ao deletar  usuario!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
