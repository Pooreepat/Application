import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './pet.schema';
import { Model, Types } from 'mongoose';
import { IPet } from './pet.interface';
import { PetCreateDto } from './dto/pet-create.dto';
import PetUpdateDto from './dto/pet-update.dto';
import { Status } from './pet.constant';

@Injectable()
export class PetService {
  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  public async getPagination(
    filterQuery: any,
    skip: number,
    perPage: number,
  ): Promise<[PetDocument[], number]> {
    const pets = await this.petModel
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean();
    const total = await this.petModel.countDocuments(filterQuery);
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

  async create(createPetDto: PetCreateDto): Promise<Pet> {
    const createdPet = new this.petModel(createPetDto);
    return createdPet.save();
  }

  async findAll(): Promise<Pet[]> {
    return this.petModel.find().exec();
  }

  async findOne(id: string): Promise<Pet> {
    const pet = await this.petModel.findById(id).exec();
    if (!pet) {
      throw new NotFoundException(`สัตว์เลี้ยง ID ${id} ไม่พบ`);
    }
    return pet;
  }

  async update(
    id: Types.ObjectId,
    updatePetDto: Partial<PetDocument>,
  ): Promise<Pet> {
    const pet = await this.petModel
      .findByIdAndUpdate(id, updatePetDto, { new: true })
      .exec();
    if (!pet) {
      throw new NotFoundException(`สัตว์เลี้ยง ID ${id} ไม่พบ`);
    }
    return pet;
  }

  async remove(id: string): Promise<void> {
    const result = await this.petModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`สัตว์เลี้ยง ID ${id} ไม่พบ`);
    }
  }

  async getPetByFilter(filter: any): Promise<Pet[]> {
    return this.petModel.find(filter).exec();
  }

  async searchPets({
    queryData,
    location,
    maxDistance,
    excludePetIds,
  }: {
    queryData: any;
    location: { latitude: number; longitude: number };
    maxDistance: number;
    excludePetIds: Types.ObjectId[];
  }) {
    const query: any = {
      _id: { $nin: excludePetIds },
      status: Status.STRAY,
      ...queryData,
    };

    return this.petModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          },
          distanceField: 'distance',
          maxDistance: maxDistance * 1000,
          spherical: true,
        },
      },
      {
        $match: query,
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profileId',
          foreignField: '_id',
          as: 'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    ]);
  }
}
