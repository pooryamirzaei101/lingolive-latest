export class MediaApiError extends Error{
 constructor(public code:string,public field:string,public stage:'validation'|'credentials'|'provider'|'storage',message:string,public status=400){super(message);this.name='MediaApiError'}
}
export function mediaErrorResponse(error:unknown,context:string){
 let problem:MediaApiError;
 if(error instanceof MediaApiError)problem=error;
 else{const message=typeof (error as {message?:unknown})?.message==='string'?(error as {message:string}).message:'';const provider=/^(DeepL|Azure Translator|Google Cloud Translation|Translation provider|Transcription provider)/.test(message);
 if(provider){const code=/timed out|timeout/i.test(message)?'PROVIDER_TIMEOUT':/quota|spending limit|character quota/i.test(message)?'PROVIDER_ACCOUNT_LIMIT':/rate limit/i.test(message)?'PROVIDER_RATE_LIMIT':/Unsupported target language/i.test(message)?'UNSUPPORTED_TARGET_LANGUAGE':/Invalid API key|401|403/.test(message)?'PROVIDER_AUTH_REJECTED':'PROVIDER_REQUEST_FAILED';problem=new MediaApiError(code,'translationProvider','provider',message,code==='PROVIDER_TIMEOUT'?504:code==='PROVIDER_ACCOUNT_LIMIT'||code==='PROVIDER_RATE_LIMIT'?429:502)}
 else problem=new MediaApiError('PROCESSING_ERROR','request','validation',message&& !/SQL|database|JSON|crypto|decrypt|encrypt|OperationError|TypeError|SyntaxError/i.test(message)?message:'The operation could not complete. Check the saved settings and try again.');}
 console.warn(JSON.stringify({event:'media_api_error',context,code:problem.code,field:problem.field,stage:problem.stage,status:problem.status}));
 return Response.json({error:problem.message,code:problem.code,field:problem.field,stage:problem.stage,settingsUrl:'/administration/media-apis'},{status:problem.status,headers:{'Cache-Control':'no-store'}})
}
export async function mediaJson(request:Request){try{const value=await request.json();if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value as Record<string,any>}catch{throw new MediaApiError('INVALID_JSON','request','validation','Send a JSON object with the required action and settings.')}}
