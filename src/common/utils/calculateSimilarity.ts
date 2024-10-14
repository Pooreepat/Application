import { IPet } from 'src/modules/pet/pet.interface';
import { IPreference } from 'src/modules/preference/preference.interface';

export const calculateSimilarity = (
  pet: IPet,
  preference: IPreference,
): number => {
  let score = 0;

  if (pet.species === preference.species) score += 10;
  if (pet.size === preference.size) score += 5;
  if (pet.breed === preference.breed) score += 7;
  if (pet.isSpayedOrNeutered === preference.isSpayedOrNeutered) score += 3;

  const matchedTags = pet.tags.filter((tag) =>
    preference.tags.includes(tag),
  ).length;
  const matchedHealth = pet.generalHealth.filter((health) =>
    preference.generalHealth.includes(health),
  ).length;
  const matchedVaccination = pet.vaccinationHistory.filter((vaccine) =>
    preference.vaccinationHistory.includes(vaccine),
  ).length;

  score += matchedTags * 2;
  score += matchedHealth * 1;
  score += matchedVaccination * 2;

  if (preference.gender && pet.gender === preference.gender) score += 4;

  return score;
};
