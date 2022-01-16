import Joi from "joi";

export interface ValidationError {
  errored: boolean;
  errors: string[] | null;
  value: any;
}

export abstract class JoiSchemas {

  public static SignUpValidator(data: any): ValidationError {
    let schema = Joi.object({
      userName: Joi.string().min(3).max(30).required(),
      firstName: Joi.string().min(3).max(30).required(),
      lastName:Joi.string().min(3).max(30).required(),
      address:Joi.string().min(3).max(40).required(),
      password: Joi.string().required().min(8).max(50),
      city:Joi.string().required().min(3).max(25),
      country:Joi.string().required().min(8).max(25),
      email: Joi.string().email().required(),
      userType:Joi.string().required().valid('GAMER', 'INVESTOR'),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }
  public static LoginValidator(data: any): ValidationError {
    let schema = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }

}
