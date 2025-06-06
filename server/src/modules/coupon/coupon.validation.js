import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const createCouponSchema = Joi.object({
    code: Joi.string().min(4).max(10).required().alphanum(),
    amount: Joi.number().required(),
    fromDate: Joi.date().greater(Date.now()).required(),
    toDate: Joi.date().greater(Date.now()).required(),
    maxUsage: Joi.number().integer().positive().required(),
    usageCount: Joi.number().min(0).integer().optional(),
    // usagePerUser: Joi.array().items(
    //     Joi.object({
    //         userId: generalFields.id,
    //         maxUsage: Joi.number().integer().positive().required(),
    //         usageCount: Joi.number().integer().positive().required()
    //     }).required()
    // ).required()
}).required()


export const updateCouponSchema = Joi.object({
    code: Joi.string().min(4).max(10).optional().alphanum(),
    amount: Joi.number().optional(),
    fromDate: Joi.string().optional(),
    toDate: Joi.string().optional(),
    couponId: generalFields.id.required(),
    maxUsage: Joi.number().integer().positive().optional(),
    usageCount: Joi.number().min(0).integer().optional(),
}).required()


export const deleteCouponSchema = Joi.object({
    couponId: generalFields.id.required()
}).required()




