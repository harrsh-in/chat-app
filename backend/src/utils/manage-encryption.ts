import bcrypt from 'bcrypt';

export const hashValue = async ({
    text,
}: {
    text: string;
}): Promise<string> => {
    return await bcrypt.hash(text, 10);
};

export const compareHash = async ({
    hash,
    plainText,
}: {
    hash: string;
    plainText: string;
}): Promise<boolean> => {
    return await bcrypt.compare(plainText, hash);
};
