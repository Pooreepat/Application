import { IPet } from 'src/modules/pet/pet.interface';
import { IPreference } from 'src/modules/user/interfaces/preference.interface';

export const calculateSimilarity = (
  pet: IPet,
  preferences: IPreference[],
): number => {
  let maxScore = 0;

  preferences.forEach((preference) => {
    let score = 0;

    if (pet.species === preference.species) score += 10;
    if (pet.size === preference.size) score += 5;
    if (pet.breed === preference.breed) score += 7;
    if (pet.isSpayedOrNeutered === preference.isSpayedOrNeutered) score += 3;

    const matchedTags = pet.tags.filter((tag) =>
      preference.tags.includes(tag),
    ).length;
    const matchedVaccination = pet.vaccinationHistory.filter((vaccine) =>
      preference.vaccinationHistory.includes(vaccine),
    ).length;

    score += matchedTags * 2;
    score += matchedVaccination * 2;

    if (pet.isMale === preference.isMale) score += 4;

    maxScore = Math.max(maxScore, score);
  });

  return maxScore;
};
