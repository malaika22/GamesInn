import Joi from "joi";

export interface ValidationError {
  errored: boolean;
  errors: string[] | null;
  value: any;
}

export abstract class JoiSchemas {

  public static SignUpValidator(data: any): ValidationError {
    let schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      password: Joi.string().required().min(8).max(50),
      dob: Joi.string().required().regex(/^\d{2}\/\d{2}\/\d{4}$/),
      email: Joi.string().email().required(),
      number: Joi.string().required().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im),
      countryCode: Joi.string().required().min(2).max(4)
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }
  public static LoginValidator(data: any, key: string): ValidationError {
    let schema = Joi.object({
      [key]: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }

}
