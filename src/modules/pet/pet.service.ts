import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './pet.schema';
import { Model, Types } from 'mongoose';
import { IProfileCreate } from '../profile/profile.interface';
import { IPet } from './pet.interface';
import { CreatePetDto } from './dto/create.dto';

@Injectable()
export class PetService {
  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  public async getPagination(
    skip: number,
    perPage: number,
  ): Promise<[PetDocument[], number]> {
    const pets = await this.petModel.find().skip(skip).limit(perPage).lean();
    const total = await this.petModel.countDocuments();
    return [pets, total];
  }

  public async getPetById(id: string | Types.ObjectId): Promise<PetDocument> {
    return this.petModel.findById(id).lean();
  }

  public async getPetByProfileId(profileId: string): Promise<PetDocument> {
    return this.petModel.findOne({ _profileId: profileId }).lean();
  }

  public async createPet(data: Partial<Pet>): Promise<PetDocument> {
    return this.petModel.create(data);
  }

  public async updatePet(
    profileId: string | Types.ObjectId,
    data: Partial<IPet>,
  ): Promise<PetDocument> {
    return this.petModel.findByIdAndUpdate(profileId, data, { new: true });
  }

  public async deletePet(id: string | Types.ObjectId): Promise<PetDocument> {
    return this.petModel.findByIdAndDelete(id);
  }
}
