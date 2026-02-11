import Joi from 'joi';

export const registerMedicineSchema = Joi.object({
  name: Joi.string().min(2).required(),
  manufacturer: Joi.string().min(2).required(),
  batchNumber: Joi.string().required(),
  manufactureDate: Joi.date().required(),
  expiryDate: Joi.date().greater(Joi.ref('manufactureDate')).required(),
  description: Joi.string().optional()
});
