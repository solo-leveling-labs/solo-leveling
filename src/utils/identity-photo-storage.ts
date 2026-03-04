import { Directory, File, Paths } from "expo-file-system";

export type PhotoStep = "step1" | "step2" | "step3";

const PHOTO_DIR = "identity-verification";

const getPhotoDirectory = (): Directory =>
  new Directory(Paths.cache, PHOTO_DIR);

const ensurePhotoDirectory = (): Directory => {
  const directory = getPhotoDirectory();
  if (!directory.exists) {
    directory.create({ intermediates: true });
  }
  return directory;
};

export const saveIdentityPhoto = (step: PhotoStep, tempUri: string): string => {
  const directory = ensurePhotoDirectory();
  const fileName = `${step}.jpg`;
  const tempFile = new File(tempUri);
  const destFile = new File(directory, fileName);
  if (destFile.exists) {
    destFile.delete();
  }
  tempFile.move(destFile);
  return destFile.uri;
};

export const getIdentityPhotoUri = (step: PhotoStep): string | null => {
  const file = new File(getPhotoDirectory(), `${step}.jpg`);
  return file.exists ? file.uri : null;
};

export const deleteIdentityPhotos = (): void => {
  const directory = getPhotoDirectory();
  if (directory.exists) {
    directory.delete();
  }
};
