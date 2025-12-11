import * as userModel from '../../domain/user/user.schema';
import * as authModel from '../../domain/auth/auth.schema';
import * as mailModel from '../mail/mail.schema';

export { userModel, authModel, mailModel };
export const schema = {
	userModel,
	authModel,
	mailModel
};

export * from '../../domain/user/user.schema';
export * from '../../domain/auth/auth.schema';
export * from '../mail/mail.schema';
