import { BadRequestException, Injectable,  } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto, LoginDto, UserIdentityDto, SignoutDto } from './dto/auth.dto';
import { UserRepository } from 'src/user/user.repository';
import { SessionRepository } from 'src/auth/repository/session.repository';

@Injectable()
export class AuthService {
	constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionRepository: SessionRepository
    ) {}

	async inspectSession(token: string) {
		const session = await this.sessionRepository.getSessionByToken(token);
		if (!session) {
			throw new BadRequestException('Invalid token');
		}
		return { data: session ?? null};
	}

	async CreateSession(userId: number) {
		const sessionToken = crypto.randomUUID();
		await this.sessionRepository.createSession({
			userId: userId,
			sessionToken: sessionToken,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		});
		return sessionToken;
	}

	async signout(sessionToken: string) {
		
		const deletedSession = await this.sessionRepository.deleteSession(sessionToken);
		if (!deletedSession) {
			throw new BadRequestException('Session not found');
		}

		const dto = new SignoutDto();
		dto.userId = deletedSession.userId;
		return {data: dto};

	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;
        console.log('loginDto', loginDto);

        // check if user exists
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }

        

        

		// check if password is valid
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new BadRequestException('Invalid credentials');
		}

        // create session for user 
		const sessionToken = await this.CreateSession(user.id);


		return {
			data: new UserIdentityDto(sessionToken, user.id, user.name)
		}
	}

	async signup(signupDto: SignupDto) {
		// check if user already exists
		const existingUser = await this.userRepository.getUserByEmail(signupDto.email);
		if (existingUser) {
			throw new BadRequestException('User already exists');
		}

		// hash password
		const { email, password, name } = signupDto;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await this.userRepository.createUser({
			email,
			password: hashedPassword,
			name,
		});

        const sessionToken = await this.CreateSession(user.id);

		return {data: new UserIdentityDto(sessionToken, user.id, user.name)}
	}
}
