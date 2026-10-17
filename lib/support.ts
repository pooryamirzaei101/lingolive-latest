export const supportCategories={playback:'Video or audio',translation:'Subtitles or translation',account:'Account or sign-in',membership:'Membership or payment',vocabulary:'Saved words or sentences',other:'Other question'};
export const supportStatuses={open:'Open',in_progress:'In progress',resolved:'Resolved'};
export function safeLessonPath(value:string){return value===''||(/^\/(?!\/)[a-zA-Z0-9/_?=&%.-]*$/.test(value)&&value.length<=500&&!value.includes('..'))}
export function screenshotType(bytes:Uint8Array){if(bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71&&bytes[4]===13&&bytes[5]===10&&bytes[6]===26&&bytes[7]===10)return 'image/png';if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';if(String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'image/webp';return ''}
export const supportFaq=[
 {question:'How do I sign in or recover my password?',answer:'Open My account to sign in. Use the password recovery option for your sign-in provider. Never send passwords or verification codes in a support request.'},
 {question:'Why is a lesson locked?',answer:'Some lessons require an active Premium membership. Check Membership for your current access. If you paid but access is still locked, send a membership request with the payment reference. Do not include card details.'},
 {question:'How do I change subtitle languages?',answer:'Use the English and translation checkboxes below the video. Choose your preferred translation language in My account. A translation must be available for the lesson to display it.'},
 {question:'How do I save words and sentences?',answer:'Double-tap an English word to open its vocabulary panel, then choose Save to Word Bank. Use the save icon beside a transcript sentence to keep it in My Collection.'},
 {question:'What should I include when a video or audio will not play?',answer:'Include the lesson page path, your device and browser, and what happens when you press Play. A screenshot can help. Avoid sharing private information.'},
 {question:'Where do I see the administrator’s answer?',answer:'Open My requests and select your conversation. Replies are stored here; email notifications and instant live chat are not enabled. Use Refresh to check for new replies.'},
];
