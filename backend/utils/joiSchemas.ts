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
      address:Joi.string().min(3).max(100).required(),
      password: Joi.string().required().min(8).max(50),
      city:Joi.string().required().min(3).max(25),
      country:Joi.string().required().min(3).max(25),
      email: Joi.string().email().required(),
      userType:Joi.string().required().valid('GAMER', 'INVESTOR'),
    });
    console.log("data", data)
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }
  public static LoginValidator(data: any): ValidationError {
    console.log("login", data)
    let schema = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }


  public static LogoutValidator(data: any): ValidationError {
    let schema = Joi.object({
      accessToken: Joi.string().required(),
      
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }

  public static EmailValidator(data:any) : ValidationError{
    let schema = Joi.object({
      email: Joi.string().email().required(),
      
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }
  

  public static UpdatePassword(data:any):ValidationError{
    let schema = Joi.object({
      password: Joi.string().min(3).max(15).required().label('Password'),
      confirmPassword: Joi.any().valid(Joi.ref('password')).required().label('Confirm Password').options({messages: {'any.only' : '{{#label}} password does not match'}})
      
      
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }


  
  public static CreateCampaigns(data:any):ValidationError{
    let schema = Joi.object({
      campaignName: Joi.string().min(3).required(),
      campaignDays: Joi.number().max(3).required(),
      campaignDescription : Joi.string().max(800).required(),
      campaignTargetedAmount:Joi.number().min(100).max(1000).required()
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }
}
