import HttpError from '../utils/HttpError';

const testErrorController = async () => {
    throw new HttpError('This is a test error');
};

export default testErrorController;
