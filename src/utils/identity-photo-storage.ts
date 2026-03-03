import { Directory, File, Paths } from "expo-file-system";

interface IdentityPhotoRecord {
  uri: string;
  capturedAt: number;
}

const getPhotoDirectory = () =>
  new Directory(Paths.document, "identity-verification");

const ensurePhotoDirectory = (): Directory => {
  const directory = getPhotoDirectory();
  if (!directory.exists) {
    directory.create({ intermediates: true });
  }
  return directory;
};

export const saveIdentityPhoto = (tempUri: string): IdentityPhotoRecord => {
  const directory = ensurePhotoDirectory();

  const timestamp = Date.now();
  const fileName = `identity_${timestamp}.jpg`;

  const tempFile = new File(tempUri);
  const destFile = new File(directory, fileName);
  tempFile.move(destFile);

  const record: IdentityPhotoRecord = {
    uri: destFile.uri,
    capturedAt: timestamp,
  };

  const manifest = new File(directory, "manifest.json");
  manifest.write(JSON.stringify(record));

  return record;
};

export const getIdentityPhoto = (): IdentityPhotoRecord | null => {
  try {
    const manifest = new File(getPhotoDirectory(), "manifest.json");
    if (!manifest.exists) return null;

    const content = manifest.textSync();
    return JSON.parse(content) as IdentityPhotoRecord;
  } catch {
    return null;
  }
};

export const deleteIdentityPhoto = (): void => {
  const directory = getPhotoDirectory();
  if (directory.exists) {
    directory.delete();
  }
};
