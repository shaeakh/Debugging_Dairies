import { z } from 'zod';
import { MessageConstants } from '@constants/allConstant.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';

const Message = MessageConstants.validation;

export const CategorySchema = z.object({
  id: CommonItemDTO.IdSchema.shape.id,
  name: z.string(Message.categoryName),
});

export const CreateSchema = CategorySchema.pick({
  name: true,
});

export type Category = z.infer<typeof CategorySchema>;
export type Create = z.infer<typeof CreateSchema>;
