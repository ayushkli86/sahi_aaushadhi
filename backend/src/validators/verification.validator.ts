import Joi from 'joi';

export const verifySchema = Joi.object({
  productId: Joi.string().required()
});
