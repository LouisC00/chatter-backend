import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import { S3Service } from '../common/s3/s3.service';
import { USERS_BUCKET, USERS_IMAGE_FILE_EXTENSION } from './users.constants';
import { UserDocument } from './entities/user.document';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      return this.toEntity(
        await this.usersRepository.create({
          ...createUserInput,
          password: await this.hashPassword(createUserInput.password),
        }),
      );
    } catch (err) {
      if (err.message.includes('E11000')) {
        throw new UnprocessableEntityException('Email already exists.');
      }
      throw err;
    }
  }

  async uploadImage(file: Buffer, userId: string): Promise<string> {
    console.error('Uploading image for user:', userId);

    const key = this.getUserImage(userId);
    console.error('Generated S3 key:', key);

    try {
      await this.s3Service.upload({
        bucket: USERS_BUCKET,
        key: key,
        file,
      });
      console.error('Image uploaded to S3 successfully');
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw error; // Rethrow the error to handle it further up the call stack
    }

    // Construct the URL of the uploaded image
    const imageUrl = this.s3Service.getObjectUrl(USERS_BUCKET, key);
    console.error('Constructed image URL:', imageUrl);

    try {
      // Update the user's document in MongoDB with the new image URL
      await this.usersRepository.findOneAndUpdate(
        { _id: userId },
        { $set: { imageUrl: imageUrl } },
      );
      console.error('User document updated in MongoDB with image URL');
    } catch (error) {
      console.error('Error updating user document in MongoDB:', error);
      throw error; // Rethrow the error to handle it further up the call stack
    }

    // Return the new image URL for immediate use (e.g., updating the client-side UI)
    return imageUrl;
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findAll() {
    return (await this.usersRepository.find({})).map((userDocument) =>
      this.toEntity(userDocument),
    );
  }

  async findOne(_id: string) {
    return this.toEntity(await this.usersRepository.findOne({ _id }));
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(
        updateUserInput.password,
      );
    }
    return this.toEntity(
      await this.usersRepository.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...updateUserInput,
          },
        },
      ),
    );
  }

  async remove(_id: string) {
    return this.toEntity(await this.usersRepository.findOneAndDelete({ _id }));
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return this.toEntity(user);
  }

  toEntity(userDocument: UserDocument): User {
    const user = {
      ...userDocument,
      imageUrl: this.s3Service.getObjectUrl(
        USERS_BUCKET,
        this.getUserImage(userDocument._id.toHexString()),
      ),
    };
    delete user.password;
    return user;
  }

  private getUserImage(userId: string) {
    return `${userId}.${USERS_IMAGE_FILE_EXTENSION}`;
  }
}
