import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService';
import { sendSuccess, sendError } from '../utils/response';
import { MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/httpStatus';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      sendError(res, 'No file provided.', [], HTTP_STATUS.BAD_REQUEST);
      return;
    }
    const result = await uploadToCloudinary(
      req.file.buffer,
      'atlas/products',
      req.file.mimetype
    );
    sendSuccess(res, MESSAGES.UPLOAD_SUCCESS, result);
  } catch (err) { next(err); }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      sendError(res, 'publicId is required.', [], HTTP_STATUS.BAD_REQUEST);
      return;
    }
    await deleteFromCloudinary(publicId);
    sendSuccess(res, MESSAGES.DELETE_SUCCESS, {});
  } catch (err) { next(err); }
};
