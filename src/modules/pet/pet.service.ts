import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './pet.schema';
import { Model, Types } from 'mongoose';
import { IPet } from './pet.interface';
import { EPetStatus } from './pet.constant';

@Injectable()
export class PetService {
  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  public async getPagination(
    filterQuery: any,
    page: number,
    perPage: number,
  ): Promise<[PetDocument[], number]> {
    const data = await this.petModel.aggregate([
      {
        $match: filterQuery,
      },
      {
        $lookup: {
          from: 'user',
          localField: '_caretakerId',
          foreignField: '_id',
          as: 'caretaker',
        },
      },
      { $unwind: { path: '$caretaker', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: 1 } },
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
    ]);
    const total = await this.petModel.countDocuments(filterQuery);
    return [data, total];
  }

  public async getPetById(petId: Types.ObjectId): Promise<PetDocument> {
    const pet = await this.petModel.aggregate([
      { $match: { _id: petId } },
      {
        $lookup: {
          from: 'user',
          localField: '_caretakerId',
          foreignField: '_id',
          as: 'caretaker',
        },
      },
      { $unwind: { path: '$caretaker', preserveNullAndEmptyArrays: true } },
      { $limit: 1 },
    ]);
    return pet[0];
  }

  public async createPet(data: Partial<IPet>): Promise<PetDocument> {
    return this.petModel.create(data);
  }

  public async updatePet(
    petId: Types.ObjectId,
    data: Partial<IPet>,
  ): Promise<PetDocument> {
    return this.petModel.findByIdAndUpdate(petId, data, { new: true }).lean();
  }

  public async deletePet(petId: Types.ObjectId): Promise<PetDocument> {
    return this.petModel.findByIdAndDelete(petId).lean();
  }

  public async findPetByCaretakerId(
    caretakerId: Types.ObjectId,
  ): Promise<PetDocument[]> {
    return this.petModel.find({ _caretakerId: caretakerId }).lean();
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
      status: EPetStatus.UNADOPTED,
      isHiddened: false,
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
      { $sort: { createdAt: 1 } },
      {
        $lookup: {
          from: 'user',
          localField: '_caretakerId',
          foreignField: '_id',
          as: 'caretaker',
        },
      },
      { $unwind: { path: '$caretaker', preserveNullAndEmptyArrays: true } },
    ]);
  }
}
